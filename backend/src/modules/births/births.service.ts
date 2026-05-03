import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateBirthDto, ValidateBirthDto } from './dto/birth.dto';
import { BirthStatus, ParentType, AttachmentType, UserRole } from '@prisma/client';

@Injectable()
export class BirthsService {
  private readonly logger = new Logger(BirthsService.name);

  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

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

    // 3. Create the record with status VALIDATED directly for the demo
    const record = await this.prisma.birthRecord.create({
      data: {
        agentId: agent.id,
        centerId: agent.centerId,
        statut: BirthStatus.VALIDE, // Direct validation for demo
        identifiantUniqueNational: iun,
        dateValidation: new Date(),
        enfant: {
          create: {
            prenoms: dto.prenomsEnfant,
            nom: dto.nomEnfant,
            dateNaissance: new Date(dto.dateNaissanceEnfant),
            heureNaissance: dto.heureNaissanceEnfant ? new Date(`1970-01-01T${dto.heureNaissanceEnfant}:00Z`) : null,
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
              dateNaissance: dto.dateNaissanceMere ? new Date(dto.dateNaissanceMere) : null,
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
              dateNaissance: dto.dateNaissancePere ? new Date(dto.dateNaissancePere) : null,
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
      },
      include: {
        enfant: true,
        parents: true,
      },
    });

    // 4. Blockchain Anchoring
    try {
      const hashData = {
        identifiantUniqueNational: iun,
        nomEnfant: record.enfant!.nom,
        prenomEnfant: record.enfant!.prenoms,
        dateNaissance: record.enfant!.dateNaissance.toISOString(),
        sexe: record.enfant!.sexe,
        lieuNaissance: record.enfant!.lieuNaissanceLibelle || 'Non spécifié',
      };
      
      const hash = this.blockchain.generateHash(hashData);
      const anchorResult = await this.blockchain.anchorHash(hash);

      // 5. Update record with Blockchain Proof and create Acte Numerique
      return this.prisma.birthRecord.update({
        where: { id: record.id },
        data: {
          hashBlockchain: hash,
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
          parents: true,
          acteNumerique: true,
          blockchainTx: true,
        },
      });
    } catch (error) {
      this.logger.error(`[BirthsService] Blockchain anchoring failed for record ${record.id}:`, error);
      // Even if blockchain fails, the record is created in DB for demo
      return record;
    }
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
          agent: { include: { user: { select: { nom: true, prenom: true } } } },
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
      queryWhere.agentId = user.agent.id;
      console.log(`[BirthsService] Agent filtering: ${user.agent.id}`);
    } else if (user.role === UserRole.FAMILLE) {
      // Pour les familles, on cherche les actes où l'utilisateur est le père ou la mère
      // On utilise son NIN ou son téléphone comme identifiant
      queryWhere.parents = {
        some: {
          telephone: user.telephone
        }
      };
      console.log(`[BirthsService] Family filtering for user: ${user.email}`);
    }

    const records = await this.prisma.birthRecord.findMany({
      where: queryWhere,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        enfant: true,
        agent: { include: { user: { select: { nom: true, prenom: true } } } },
      },
    });

    console.log(`[BirthsService] Found ${records.length} records`);
    return records;
  }

  async findOne(id: string) {
    const record = await this.prisma.birthRecord.findUnique({
      where: { id },
      include: {
        enfant: true,
        parents: true,
        declarant: true,
        agent: { include: { user: true }},
        acteNumerique: true,
        attachments: true,
      },
    });

    if (!record) {
      throw new NotFoundException(`Birth record with ID ${id} not found`);
    }

    return record;
  }

  async validate(id: string, validatorId: string) {
    const record = await this.findOne(id);

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

  async reject(id: string, validatorId: string, dto: ValidateBirthDto) {
    return this.prisma.birthRecord.update({
      where: { id },
      data: {
        statut: BirthStatus.REJETE,
        commentaireRejet: dto.commentaireRejet,
        dateValidation: new Date(),
        approuvePar: validatorId,
      },
    });
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

    // 2. Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
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

  async verify(iun: string) {
    const record = await this.prisma.birthRecord.findUnique({
      where: { identifiantUniqueNational: iun },
      include: {
        enfant: true,
        blockchainTx: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Identifiant Unique National non trouvé');
    }

    return record;
  }
}
