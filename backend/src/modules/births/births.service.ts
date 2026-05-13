import { Injectable, NotFoundException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateBirthDto, ValidateBirthDto, UpdateRejectedBirthDto } from './dto/birth.dto';
import { BirthStatus, ParentType, AttachmentType, UserRole, Prisma } from '@prisma/client';

@Injectable()
export class BirthsService {
  private readonly logger = new Logger(BirthsService.name);

  /** Données réservées supervision terrain (non exposées aux vérificateurs — cahier des charges). */
  private static readonly GPS_SUPERVISION_FIELDS = [
    'enregistrementLatitude',
    'enregistrementLongitude',
    'enregistrementPrecisionM',
    'enregistrementCaptureLe',
  ] as const;

  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  private stripGpsSupervision<T extends Record<string, unknown>>(entity: T): T {
    const copy = { ...entity } as Record<string, unknown>;
    for (const key of BirthsService.GPS_SUPERVISION_FIELDS) {
      delete copy[key];
    }
    return copy as T;
  }

  private stripGpsFromRecordsList<T extends Record<string, unknown>>(records: T[]): T[] {
    return records.map((r) => this.stripGpsSupervision(r));
  }

  private async isVerificateur(userId: string | null | undefined): Promise<boolean> {
    if (!userId) return false;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === UserRole.VERIFICATEUR;
  }

  private normalizePhone(t?: string | null): string {
    if (!t) return '';
    return t.replace(/[^\d+]/g, '');
  }

  private phonesMatch(a?: string | null, b?: string | null): boolean {
    const na = this.normalizePhone(a);
    const nb = this.normalizePhone(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    const digits = (s: string) => s.replace(/\D/g, '');
    const da = digits(na);
    const db = digits(nb);
    if (da.length >= 9 && db.length >= 9) {
      return da.slice(-9) === db.slice(-9);
    }
    return false;
  }

  async assertCanViewBirthRecord(
    viewerUserId: string | null | undefined,
    record: {
      id: string;
      statut: BirthStatus;
      centerId: string | null;
      agentId: string;
      parents: { telephone: string | null }[];
    },
  ): Promise<void> {
    if (!viewerUserId) return;
    const user = await this.prisma.user.findUnique({
      where: { id: viewerUserId },
      include: { agent: true },
    });
    if (!user) throw new ForbiddenException('Utilisateur introuvable');

    if (user.role === UserRole.ADMINISTRATEUR || user.role === UserRole.VERIFICATEUR) {
      return;
    }

    if (user.role === UserRole.SUPERVISEUR) {
      if (user.agent?.centerId && record.centerId && record.centerId !== user.agent.centerId) {
        throw new ForbiddenException('Dossier hors de votre centre');
      }
      return;
    }

    if (user.role === UserRole.AGENT && user.agent) {
      if (record.agentId !== user.agent.id) {
        throw new ForbiddenException('Ce dossier appartient à un autre agent');
      }
      return;
    }

    if (user.role === UserRole.FAMILLE) {
      if (record.statut !== BirthStatus.VALIDE) {
        throw new ForbiddenException('Acte disponible après validation par le superviseur');
      }
      const ok = record.parents.some((p) => this.phonesMatch(p.telephone, user.telephone));
      if (!ok) {
        throw new ForbiddenException(
          "Vous n'avez pas accès à cet acte (rattachement ou numéro du parent sur l'acte)",
        );
      }
      return;
    }

    throw new ForbiddenException('Accès refusé');
  }

  private parseSafeDate(dateStr: string, fieldName: string): Date {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      throw new BadRequestException(`Format de date invalide pour ${fieldName}: ${dateStr}. Attendu: AAAA-MM-DD`);
    }
    return d;
  }

  private parseSafeTime(timeStr: string): Date {
    // Si c'est déjà un ISO string complet, on le parse normalement
    if (timeStr.includes('T')) return new Date(timeStr);
    
    // Sinon on attend HH:mm
    const d = new Date(`1970-01-01T${timeStr}${timeStr.length === 5 ? ':00' : ''}Z`);
    if (isNaN(d.getTime())) {
      return new Date(`1970-01-01T00:00:00Z`); // Fallback safe
    }
    return d;
  }

  async create(userId: string, dto: CreateBirthDto) {
    // 1. Find the agent corresponding to the user
    const agent = await this.prisma.agent.findUnique({
      where: { utilisateurId: userId },
    });

    if (!agent) {
      throw new NotFoundException('Agent profile not found for this user');
    }

    // 2. Generate IUN (National Unique Identifier) immediately
    const year = new Date().getFullYear();
    const iun = `GN-${year}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 3. Create the record with status EN_ATTENTE (requires supervisor validation)
    const record = await this.prisma.birthRecord.create({
      data: {
        agentId: agent.id,
        centerId: agent.centerId,
        statut: BirthStatus.EN_ATTENTE, // Requires supervisor validation
        identifiantUniqueNational: iun,
        enregistrementLatitude: dto.enregistrementLatitude ?? undefined,
        enregistrementLongitude: dto.enregistrementLongitude ?? undefined,
        enregistrementPrecisionM: dto.enregistrementPrecisionM ?? undefined,
        enregistrementCaptureLe:
          dto.enregistrementLatitude != null && dto.enregistrementLongitude != null
            ? new Date()
            : undefined,
        // dateValidation will be set when supervisor validates
        enfant: {
          create: {
            prenoms: dto.prenomsEnfant,
            nom: dto.nomEnfant,
            dateNaissance: this.parseSafeDate(dto.dateNaissanceEnfant, 'Date de naissance enfant'),
            heureNaissance: dto.heureNaissanceEnfant ? this.parseSafeTime(dto.heureNaissanceEnfant) : null,
            sexe: dto.sexeEnfant,
            nationalite: dto.nationaliteEnfant || 'Guinéenne',
            regionNaissance: dto.regionNaissance,
            prefectureNaissanceId: dto.prefectureNaissanceId,
            sousPrefectureNaissanceId: dto.sousPrefectureNaissanceId,
            communeNaissanceId: dto.communeNaissanceId,
            villageNaissanceId: dto.villageNaissanceId,
            lieuNaissanceLibelle: dto.lieuNaissanceLibelle,
          },
        },
        parents: {
          create: [
            {
              type: ParentType.MERE,
              nom: dto.nomMere,
              prenom: dto.prenomMere || '',
              dateNaissance: dto.dateNaissanceMere ? this.parseSafeDate(dto.dateNaissanceMere, 'Date de naissance mère') : null,
              numeroIdentification: dto.idNationalMere,
              cniOuAutre: dto.cniMere,
              profession: dto.professionMere,
              nationalite: dto.nationaliteMere || 'Guinéenne',
              regionAdresse: dto.regionParents,
              quartierDistrict: dto.quartierParents,
              secteurVillage: dto.secteurParents,
              telephone: dto.telephoneMere,
            },
            ...(dto.nomPere ? [{
              type: ParentType.PERE,
              nom: dto.nomPere,
              prenom: dto.prenomPere || '',
              dateNaissance: dto.dateNaissancePere ? this.parseSafeDate(dto.dateNaissancePere, 'Date de naissance père') : null,
              numeroIdentification: dto.idNationalPere,
              cniOuAutre: dto.cniPere,
              profession: dto.professionPere,
              nationalite: dto.nationalitePere || 'Guinéenne',
              regionAdresse: dto.regionParents,
              quartierDistrict: dto.quartierParents,
              secteurVillage: dto.secteurParents,
              telephone: dto.telephonePere,
            }] : []),
          ],
        },
        declarant: dto.nomDeclarant ? {
          create: {
            nom: dto.nomDeclarant,
            numeroIdentification: dto.idNationalDeclarant,
            cniOuAutre: dto.cniDeclarant,
            lienParente: dto.lienParenteDeclarant,
          },
        } : undefined,
        attachments: {
          create: [
            ...(dto.carnetMaternite ? [{
              type: AttachmentType.PHOTO_CARNET,
              urlFichier: dto.carnetMaternite,
              nomFichier: 'carnet_maternite.jpg'
            }] : []),
            ...(dto.cniMerePhoto ? [{
              type: AttachmentType.PHOTO_CNI,
              urlFichier: dto.cniMerePhoto,
              nomFichier: 'cni_mere.jpg'
            }] : []),
            ...(dto.cniPerePhoto ? [{
              type: AttachmentType.PHOTO_CNI,
              urlFichier: dto.cniPerePhoto,
              nomFichier: 'cni_pere.jpg'
            }] : []),
            ...(dto.acteMariagePhoto ? [{
              type: AttachmentType.PHOTO_AUTRE,
              urlFichier: dto.acteMariagePhoto,
              nomFichier: 'acte_mariage.jpg'
            }] : []),
          ]
        }
      } as Prisma.BirthRecordUncheckedCreateInput,
      include: {
        enfant: true,
        parents: true,
      },
    });

    // 4. Return record - Blockchain anchoring will happen when supervisor validates
    this.logger.log(`[BirthsService] Record created with status EN_ATTENTE: ${record.id}`);
    return record;
  }

  async findAll(filters: any) {
    const { limit, userId, ...where } = filters;
    
    // Mode démo sans authentification : retourner tous les enregistrements
    if (!userId) {
      const records = await this.prisma.birthRecord.findMany({
        where: { ...where },
        take: limit ? parseInt(limit) : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          enfant: true,
<<<<<<< HEAD
          blockchainTx: true,
          acteNumerique: true,
=======
          parents: true,
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
          agent: { include: { user: { select: { nom: true, prenom: true } } } },
          attachments: true,
          center: { include: { prefecture: true } },
          blockchainTx: true,
        },
      });
      console.log(`[BirthsService] Demo mode - Found ${records.length} records`);
      return records;
    }

    // 1. Déterminer le rôle et le profil de l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true }
    });

    if (!user) return [];

    let queryWhere: any = { ...where };

    // 2. Filtrage par rôle
    if (user.role === UserRole.AGENT && user.agent) {
      // Agent: voir uniquement ses propres actes
      queryWhere.agentId = user.agent.id;
      console.log(`[BirthsService] Agent filtering: ${user.agent.id}`);
    } else if (user.role === UserRole.SUPERVISEUR) {
      // Superviseur: voir les actes de son centre (ou tous si pas de centre assigné)
      if (user.agent?.centerId) {
        queryWhere.centerId = user.agent.centerId;
        console.log(`[BirthsService] Superviseur filtering by center: ${user.agent.centerId}`);
      } else {
        console.log(`[BirthsService] Superviseur sees all records (no center assigned)`);
      }
    } else if (user.role === UserRole.VERIFICATEUR) {
      // Vérificateur: voir tous les actes (lecture seule)
      console.log(`[BirthsService] Verificateur sees all records`);
    } else if (user.role === UserRole.ADMINISTRATEUR) {
      // Admin: voir tous les actes
      console.log(`[BirthsService] Admin sees all records`);
    } else if (user.role === UserRole.FAMILLE) {
      queryWhere.statut = BirthStatus.VALIDE;
      if (user.telephone) {
        const raw = user.telephone.trim();
        const digits = raw.replace(/\D/g, '');
        const last9 = digits.slice(-9);
        queryWhere.parents = {
          some: {
            OR: [
              { telephone: raw },
              { telephone: raw.replace(/\s/g, '') },
              { telephone: { contains: last9 } },
            ],
          },
        };
      } else {
        queryWhere.id = '00000000-0000-0000-0000-000000000000';
      }
    }

    const records = await this.prisma.birthRecord.findMany({
      where: queryWhere,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        enfant: true,
<<<<<<< HEAD
        blockchainTx: true,
        acteNumerique: true,
=======
        parents: true,
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
        agent: { include: { user: { select: { nom: true, prenom: true } } } },
        attachments: true,
        center: { include: { prefecture: true } },
        blockchainTx: true,
      },
    });

    console.log(`[BirthsService] Found ${records.length} records`);
    if (await this.isVerificateur(userId)) {
      return this.stripGpsFromRecordsList(records as Record<string, unknown>[]) as typeof records;
    }
    return records;
  }

  async findOne(id: string, viewerUserId?: string | null) {
    const record = await this.prisma.birthRecord.findUnique({
      where: { id },
      include: {
        enfant: {
          include: {
            prefecture: true,
            sousPrefecture: true,
            commune: true,
            village: true,
          },
        },
        parents: true,
        declarant: true,
        agent: { include: { user: true } },
        acteNumerique: true,
        attachments: true,
        blockchainTx: true,
        center: {
          include: {
            prefecture: true,
            commune: true,
            sousPrefecture: true,
            village: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Birth record with ID ${id} not found`);
    }

    await this.assertCanViewBirthRecord(viewerUserId, record);

    let result: Record<string, unknown> = { ...record } as unknown as Record<string, unknown>;
    if (record.approuvePar) {
      const appro = await this.prisma.user.findUnique({
        where: { id: record.approuvePar },
        select: { nom: true, prenom: true },
      });
      result = {
        ...result,
        approbateurPrenom: appro?.prenom ?? null,
        approbateurNom: appro?.nom ?? null,
      };
    }

    if (await this.isVerificateur(viewerUserId)) {
      return this.stripGpsSupervision(result) as typeof record;
    }

    return result;
  }

  async findPending(viewerUserId?: string | null) {
    const where: Prisma.BirthRecordWhereInput = { statut: BirthStatus.EN_ATTENTE };
    if (viewerUserId) {
      const user = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
        include: { agent: true },
      });
      if (user?.role === UserRole.SUPERVISEUR && user.agent?.centerId) {
        where.centerId = user.agent.centerId;
      }
    }

    const list = await this.prisma.birthRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        enfant: true,
        parents: true,
        agent: { include: { user: { select: { nom: true, prenom: true, email: true } } } },
        attachments: true,
        center: { include: { prefecture: true } },
        blockchainTx: true,
      },
    });
    if (await this.isVerificateur(viewerUserId)) {
      return this.stripGpsFromRecordsList(list as Record<string, unknown>[]) as typeof list;
    }
    return list;
  }

  async findByStatus(status: string, viewerUserId?: string | null) {
    const statusEnum = status.toUpperCase().replace('-', '_') as BirthStatus;

    const where: Prisma.BirthRecordWhereInput = { statut: statusEnum };
    if (viewerUserId) {
      const user = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
        include: { agent: true },
      });
      if (user?.role === UserRole.SUPERVISEUR && user.agent?.centerId) {
        where.centerId = user.agent.centerId;
      }
    }

    const list = await this.prisma.birthRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        enfant: true,
        parents: true,
        agent: { include: { user: { select: { nom: true, prenom: true } } } },
        attachments: true,
        center: { include: { prefecture: true } },
        blockchainTx: true,
      },
    });
    if (await this.isVerificateur(viewerUserId)) {
      return this.stripGpsFromRecordsList(list as Record<string, unknown>[]) as typeof list;
    }
    return list;
  }

  async validate(id: string, validatorId: string) {
    const record = (await this.findOne(id, validatorId)) as Record<string, unknown> & {
      statut: BirthStatus;
      enfant: {
        nom: string;
        prenoms: string;
        dateNaissance: Date;
        sexe: string;
        lieuNaissanceLibelle: string | null;
      };
    };

    if (record.statut !== BirthStatus.EN_ATTENTE) {
      throw new BadRequestException('Record is not in pending status');
    }

    // 1. Generate IUN
    const year = new Date().getFullYear();
    const iun = `GN-${year}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 2. Préparer les données pour le Hash (données pivots immuables)
    const hashData = {
      identifiantUniqueNational: iun,
      nomEnfant: record.enfant!.nom,
      prenomEnfant: record.enfant!.prenoms,
      dateNaissance: record.enfant!.dateNaissance.toISOString(),
      sexe: record.enfant!.sexe,
      lieuNaissance: record.enfant!.lieuNaissanceLibelle || 'Non spécifié',
    };
    
    const hash = this.blockchain.generateHash(hashData);

    // 3. Ancrage réel sur la Blockchain Polygon Amoy
    const anchorResult = await this.blockchain.anchorHash(hash);

    // 4. Mise à jour de la base de données avec les preuves d'immuabilité
    return this.prisma.birthRecord.update({
      where: { id },
      data: {
        statut: BirthStatus.VALIDE,
        identifiantUniqueNational: iun,
        hashBlockchain: hash,
        dateValidation: new Date(),
        approuvePar: validatorId,
        blockchainTx: {
          create: {
            txHash: anchorResult.txHash,
            statut: anchorResult.mode === 'live' ? 'CONFIRMEE' : 'EN_ATTENTE',
            reseauBlockchain: anchorResult.network,
            blocNumero: anchorResult.blockNumber ? BigInt(anchorResult.blockNumber) : null,
          },
        },
        acteNumerique: {
          create: {
            numeroActe: `ACTE-${iun}`,
            qrCodeData: iun,
          },
        },
      },
      include: {
        enfant: true,
        acteNumerique: true,
        blockchainTx: true,
      },
    });
  }

  async reject(id: string, validatorId: string, dto: { motif: string }) {
    const record = await this.findOne(id, validatorId);
    if (record.statut !== BirthStatus.EN_ATTENTE) {
      throw new BadRequestException('Seuls les dossiers en attente peuvent être rejetés');
    }
    return this.prisma.birthRecord.update({
      where: { id },
      data: {
        statut: BirthStatus.REJETE,
        commentaireRejet: dto.motif,
        dateValidation: new Date(),
        approuvePar: validatorId,
      },
      include: {
        enfant: true,
        parents: true,
        agent: { include: { user: { select: { id: true, email: true, nom: true, prenom: true } } } },
      },
    });
  }

  async findRejectionsForAgent(userId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { utilisateurId: userId },
    });
    if (!agent) {
      return [];
    }
    return this.prisma.birthRecord.findMany({
      where: { agentId: agent.id, statut: BirthStatus.REJETE },
      orderBy: { updatedAt: 'desc' },
      include: {
        enfant: true,
        parents: true,
        center: { include: { prefecture: true } },
      },
    });
  }

  async resubmitRejected(id: string, userId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { utilisateurId: userId },
    });
    if (!agent) {
      throw new ForbiddenException('Profil agent introuvable');
    }
    const record = await this.prisma.birthRecord.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Dossier introuvable');
    }
    if (record.agentId !== agent.id) {
      throw new ForbiddenException('Ce dossier ne vous appartient pas');
    }
    if (record.statut !== BirthStatus.REJETE) {
      throw new BadRequestException('Seuls les dossiers rejetés peuvent être renvoyés en validation');
    }
    return this.prisma.birthRecord.update({
      where: { id },
      data: {
        statut: BirthStatus.EN_ATTENTE,
        commentaireRejet: null,
        dateValidation: null,
        approuvePar: null,
      },
      include: {
        enfant: true,
        parents: true,
      },
    });
  }

  async updateRejectedBirth(id: string, userId: string, dto: UpdateRejectedBirthDto) {
    const agent = await this.prisma.agent.findUnique({
      where: { utilisateurId: userId },
    });
    if (!agent) {
      throw new ForbiddenException('Profil agent introuvable');
    }
    const record = await this.prisma.birthRecord.findUnique({
      where: { id },
      include: { enfant: true, parents: true, declarant: true },
    });
    if (!record) {
      throw new NotFoundException('Dossier introuvable');
    }
    if (record.agentId !== agent.id) {
      throw new ForbiddenException('Ce dossier ne vous appartient pas');
    }
    if (record.statut !== BirthStatus.REJETE) {
      throw new BadRequestException('Modifications réservées aux dossiers rejetés');
    }
    const enfant = record.enfant;
    if (!enfant) {
      throw new BadRequestException('Enfant introuvable');
    }

    await this.prisma.$transaction(async (tx) => {
      const childUpdate: Prisma.ChildUncheckedUpdateInput = {};
      if (dto.prenomsEnfant !== undefined) childUpdate.prenoms = dto.prenomsEnfant;
      if (dto.nomEnfant !== undefined) childUpdate.nom = dto.nomEnfant;
      if (dto.dateNaissanceEnfant !== undefined) {
        childUpdate.dateNaissance = this.parseSafeDate(dto.dateNaissanceEnfant, 'Date de naissance enfant');
      }
      if (dto.heureNaissanceEnfant !== undefined) {
        childUpdate.heureNaissance = dto.heureNaissanceEnfant
          ? this.parseSafeTime(dto.heureNaissanceEnfant)
          : null;
      }
      if (dto.sexeEnfant !== undefined) childUpdate.sexe = dto.sexeEnfant;
      if (dto.nationaliteEnfant !== undefined) childUpdate.nationalite = dto.nationaliteEnfant;
      if (dto.regionNaissance !== undefined) childUpdate.regionNaissance = dto.regionNaissance;
      if (dto.lieuNaissanceLibelle !== undefined) childUpdate.lieuNaissanceLibelle = dto.lieuNaissanceLibelle;
      if (dto.prefectureNaissanceId !== undefined) {
        childUpdate.prefectureNaissanceId = dto.prefectureNaissanceId;
      }
      if (dto.sousPrefectureNaissanceId !== undefined) {
        childUpdate.sousPrefectureNaissanceId = dto.sousPrefectureNaissanceId;
      }
      if (dto.communeNaissanceId !== undefined) {
        childUpdate.communeNaissanceId = dto.communeNaissanceId;
      }
      if (dto.villageNaissanceId !== undefined) {
        childUpdate.villageNaissanceId = dto.villageNaissanceId;
      }

      if (Object.keys(childUpdate).length > 0) {
        await tx.child.update({
          where: { id: enfant.id },
          data: childUpdate,
        });
      }

      const mere = record.parents.find((p) => p.type === ParentType.MERE);
      const pere = record.parents.find((p) => p.type === ParentType.PERE);

      if (mere) {
        const pu: Prisma.ParentUpdateInput = {};
        if (dto.nomMere !== undefined) pu.nom = dto.nomMere;
        if (dto.prenomMere !== undefined) pu.prenom = dto.prenomMere;
        if (dto.dateNaissanceMere !== undefined) {
          pu.dateNaissance = dto.dateNaissanceMere
            ? this.parseSafeDate(dto.dateNaissanceMere, 'Date de naissance mère')
            : null;
        }
        if (dto.professionMere !== undefined) pu.profession = dto.professionMere;
        if (dto.nationaliteMere !== undefined) pu.nationalite = dto.nationaliteMere;
        if (dto.idNationalMere !== undefined) pu.numeroIdentification = dto.idNationalMere;
        if (dto.cniMere !== undefined) pu.cniOuAutre = dto.cniMere;
        if (dto.telephoneMere !== undefined) pu.telephone = dto.telephoneMere;
        if (dto.regionParents !== undefined) pu.regionAdresse = dto.regionParents;
        if (dto.quartierParents !== undefined) pu.quartierDistrict = dto.quartierParents;
        if (dto.secteurParents !== undefined) pu.secteurVillage = dto.secteurParents;
        if (Object.keys(pu).length > 0) {
          await tx.parent.update({ where: { id: mere.id }, data: pu });
        }
      }

      if (pere) {
        const pu: Prisma.ParentUpdateInput = {};
        if (dto.nomPere !== undefined) pu.nom = dto.nomPere;
        if (dto.prenomPere !== undefined) pu.prenom = dto.prenomPere;
        if (dto.dateNaissancePere !== undefined) {
          pu.dateNaissance = dto.dateNaissancePere
            ? this.parseSafeDate(dto.dateNaissancePere, 'Date de naissance père')
            : null;
        }
        if (dto.professionPere !== undefined) pu.profession = dto.professionPere;
        if (dto.nationalitePere !== undefined) pu.nationalite = dto.nationalitePere;
        if (dto.idNationalPere !== undefined) pu.numeroIdentification = dto.idNationalPere;
        if (dto.cniPere !== undefined) pu.cniOuAutre = dto.cniPere;
        if (dto.telephonePere !== undefined) pu.telephone = dto.telephonePere;
        if (dto.regionParents !== undefined) pu.regionAdresse = dto.regionParents;
        if (dto.quartierParents !== undefined) pu.quartierDistrict = dto.quartierParents;
        if (dto.secteurParents !== undefined) pu.secteurVillage = dto.secteurParents;
        if (Object.keys(pu).length > 0) {
          await tx.parent.update({ where: { id: pere.id }, data: pu });
        }
      }

      if (record.declarant) {
        const du: Prisma.DeclarantUpdateInput = {};
        if (dto.nomDeclarant !== undefined) du.nom = dto.nomDeclarant;
        if (dto.idNationalDeclarant !== undefined) du.numeroIdentification = dto.idNationalDeclarant;
        if (dto.cniDeclarant !== undefined) du.cniOuAutre = dto.cniDeclarant;
        if (dto.lienParenteDeclarant !== undefined) du.lienParente = dto.lienParenteDeclarant;
        if (Object.keys(du).length > 0) {
          await tx.declarant.update({ where: { id: record.declarant.id }, data: du });
        }
      }
    });

    return this.findOne(id, userId);
  }

  async linkChildToUser(userId: string, iun: string) {
    // 1. Trouver l'acte de naissance
    const record = await this.prisma.birthRecord.findUnique({
      where: { identifiantUniqueNational: iun },
      include: { parents: true, enfant: true }
    });

    if (!record) {
      throw new NotFoundException('Acte de naissance non trouvé');
    }

    if (record.statut !== BirthStatus.VALIDE) {
      throw new BadRequestException('Seul un acte déjà validé peut être lié à votre espace famille');
    }

    // 2. Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.telephone?.trim()) {
      throw new BadRequestException('Renseignez votre numéro de téléphone dans votre profil avant de lier un acte');
    }

    // 3. Liaison effective : On met à jour le numéro d'identification du parent correspondant
    // Pour la démo, on cherche le parent qui a le même nom que l'utilisateur
    const matchingParent = record.parents.find(p => 
      p.nom.toLowerCase() === user.nom.toLowerCase()
    ) || record.parents[0]; // Fallback sur le premier parent si pas de match de nom

    if (matchingParent) {
      await this.prisma.parent.update({
        where: { id: matchingParent.id },
        data: {
          telephone: user.telephone
        }
      });
    }

    return {
      message: 'Lien établi avec succès',
      recordId: record.id,
      childName: `${record.enfant?.prenoms} ${record.enfant?.nom}`
    };
  }

<<<<<<< HEAD
  async verify(reference: string, ipAddress?: string) {
    const normalizedReference = reference.trim();
    const record = await this.prisma.birthRecord.findFirst({
      where: {
        OR: [
          { identifiantUniqueNational: normalizedReference },
          { numeroCertificat: normalizedReference },
          { numeroIdentificationNational: normalizedReference },
          { acteNumerique: { is: { numeroActe: normalizedReference } } },
          { acteNumerique: { is: { qrCodeData: normalizedReference } } },
        ],
      },
=======
  async verify(iun: string, viewerUserId?: string | null) {
    const record = await this.prisma.birthRecord.findUnique({
      where: { identifiantUniqueNational: iun },
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
      include: {
        enfant: true,
        parents: true,
        agent: { include: { user: { select: { nom: true, prenom: true } } } },
        center: true,
        acteNumerique: true,
        blockchainTx: true,
      },
    });

    if (!record) {
      await this.prisma.verification.create({
        data: {
          moyen: 'REFERENCE',
          valeurRecherchee: normalizedReference,
          resultat: 'INTROUVABLE',
          adresseIp: ipAddress,
        },
      });

      return {
        valid: false,
        status: 'INTROUVABLE',
        reference: normalizedReference,
        message: 'Aucun acte de naissance ne correspond a cette reference',
      };
    }

<<<<<<< HEAD
    const isValidated = record.statut === BirthStatus.VALIDE;
    const blockchainVerified =
      Boolean(record.hashBlockchain) &&
      Boolean(record.blockchainTx?.txHash) &&
      record.blockchainTx?.statut !== 'ECHEC';

    await this.prisma.verification.create({
      data: {
        naissanceId: record.id,
        moyen: 'REFERENCE',
        valeurRecherchee: normalizedReference,
        resultat: isValidated ? 'VERIFIE' : 'NON_VALIDE',
        adresseIp: ipAddress,
      },
    });

    return {
      valid: isValidated,
      status: isValidated ? 'VERIFIE' : 'NON_VALIDE',
      blockchainVerified,
      reference: normalizedReference,
      record: {
        id: record.id,
        statut: record.statut,
        identifiantUniqueNational: record.identifiantUniqueNational,
        numeroCertificat: record.numeroCertificat,
        numeroActe: record.acteNumerique?.numeroActe,
        dateValidation: record.dateValidation,
        enfant: record.enfant,
        parents: record.parents,
        centre: record.center,
        agent: record.agent,
        hashBlockchain: record.hashBlockchain,
        blockchainTx: record.blockchainTx,
      },
    };
=======
    if (await this.isVerificateur(viewerUserId)) {
      return this.stripGpsSupervision(record as Record<string, unknown>) as typeof record;
    }

    return record;
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
  }

  async addAttachment(naissanceId: string, type: string, urlFichier: string, nomFichier?: string) {
    const attachmentType = type as AttachmentType;
    
    return this.prisma.attachment.create({
      data: {
        naissanceId,
        type: attachmentType,
        urlFichier,
        nomFichier: nomFichier || 'document.jpg',
        mimeType: 'image/jpeg',
      },
    });
  }

  async seedAttachments() {
    // Récupérer tous les actes sans pièces jointes
    const records = await this.prisma.birthRecord.findMany({
      where: {
        attachments: { none: {} }
      },
    });

    const baseUrl = 'https://via.placeholder.com/400x300';
    let added = 0;

    for (const record of records) {
      // Ajouter carnet maternité
      await this.prisma.attachment.create({
        data: {
          naissanceId: record.id,
          type: AttachmentType.PHOTO_CARNET,
          urlFichier: `${baseUrl}/4CAF50/FFFFFF?text=Carnet+Maternite`,
          nomFichier: 'carnet_maternite.jpg',
          mimeType: 'image/jpeg',
        },
      });

      // Ajouter CNI mère
      await this.prisma.attachment.create({
        data: {
          naissanceId: record.id,
          type: AttachmentType.PHOTO_CNI,
          urlFichier: `${baseUrl}/2196F3/FFFFFF?text=CNI+Mere`,
          nomFichier: 'cni_mere.jpg',
          mimeType: 'image/jpeg',
        },
      });

      // Ajouter CNI père (70% des cas)
      if (Math.random() > 0.3) {
        await this.prisma.attachment.create({
          data: {
            naissanceId: record.id,
            type: AttachmentType.PHOTO_CNI,
            urlFichier: `${baseUrl}/FF9800/FFFFFF?text=CNI+Pere`,
            nomFichier: 'cni_pere.jpg',
            mimeType: 'image/jpeg',
          },
        });
      }

      added++;
    }

    return { message: `Pièces jointes ajoutées à ${added} actes` };
  }
}
