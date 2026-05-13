<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { BirthStatus, UserRole } from '@prisma/client';
=======
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

/** Même rayon que le frontend (couverture autour d’un passage GPS). */
const FIELD_COVERAGE_RADIUS_KM = 18;

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function parseCoordonneesGps(raw: string | null): { lat: number; lng: number } | null {
  if (!raw?.trim()) return null;
  const t = raw.trim().replace(/\s+/g, ' ');
  const parts = t.split(/[,;]\s*|\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  const lat = Number.parseFloat(parts[0].replace(',', '.'));
  const lng = Number.parseFloat(parts[1].replace(',', '.'));
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function isWithinGpsCoverage(
  lat: number,
  lng: number,
  gpsPoints: { lat: number; lng: number }[],
  radiusKm: number,
): boolean {
  const here = { lat, lng };
  return gpsPoints.some((p) => haversineKm(here, p) <= radiusKm);
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< HEAD
  async getDashboardStats(userId: string) {
=======
  /** Admin ou superviseur uniquement (même règle que la carte terrain). */
  private async requireAdminOrSuperviseur(userId: string) {
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true },
    });

<<<<<<< HEAD
    if (!user || !user.actif) {
      throw new NotFoundException('Utilisateur non trouve');
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const scope =
      user.role === UserRole.AGENT && user.agent
        ? { agentId: user.agent.id }
        : user.role === UserRole.FAMILLE
          ? { parents: { some: { telephone: user.telephone || undefined } } }
          : {};

    const [totalBirths, pendingValidations, validatedBirths, monthlyBirths, anchoredOnBlockchain] =
      await Promise.all([
        this.prisma.birthRecord.count({ where: scope }),
        this.prisma.birthRecord.count({ where: { ...scope, statut: BirthStatus.EN_ATTENTE } }),
        this.prisma.birthRecord.count({ where: { ...scope, statut: BirthStatus.VALIDE } }),
        this.prisma.birthRecord.count({ where: { ...scope, createdAt: { gte: startOfMonth } } }),
        this.prisma.birthRecord.count({ where: { ...scope, hashBlockchain: { not: null } } }),
      ]);

    return {
      totalBirths,
      pendingValidations,
      validatedBirths,
      monthlyBirths,
      anchoredOnBlockchain,
      total: totalBirths,
      pending: pendingValidations,
      validated: validatedBirths,
      totalMois: monthlyBirths,
    };
=======
    if (!user) {
      throw new ForbiddenException('Utilisateur introuvable');
    }

    if (user.role !== UserRole.ADMINISTRATEUR && user.role !== UserRole.SUPERVISEUR) {
      throw new ForbiddenException('Accès réservé aux administrateurs et superviseurs');
    }

    return user;
  }

  async getDashboardStats(userId: string | null) {
    console.log(`[StatsService] DASHBOARD_REQUEST for userId: ${userId}`);
    
    // Récupérer l'utilisateur si fourni
    let user = null;
    if (userId) {
      user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { agent: true }
      });
    }

    // Déterminer le filtre
    let filter: any = {};
    
    if (user?.role === 'SUPERVISEUR' && user.agent?.centerId) {
      // Superviseur: voir uniquement les stats de son centre
      filter.centerId = user.agent.centerId;
      console.log(`[StatsService] Superviseur filtering by center: ${filter.centerId}`);
    } else if (user?.role === 'AGENT' && user.agent?.id) {
      // Agent: voir uniquement ses propres enregistrements
      filter.agentId = user.agent.id;
      console.log(`[StatsService] Agent filtering by agentId: ${filter.agentId}`);
    } else if (user?.role === 'FAMILLE' && user.telephone) {
      // Famille: voir les actes où l'utilisateur est parent
      filter.parents = {
        some: {
          telephone: user.telephone
        }
      };
      console.log(`[StatsService] Family filtering by telephone: ${user.telephone}`);
    }
    // Admin, Verificateur -> stats globales (pas de filtre supplémentaire)

    const totalBirths = await this.prisma.birthRecord.count({
      where: filter
    });
    
    const pendingValidations = await this.prisma.birthRecord.count({
      where: { 
        statut: 'EN_ATTENTE',
        ...filter
      }
    });
    
    const validated = await this.prisma.birthRecord.count({
      where: { 
        statut: 'VALIDE',
        ...filter
      }
    });
    
    // Compter les actes ancrés sur blockchain (toujours global ou filtré par agent ?)
    // Pour l'agent, on montre ses actes ancrés
    const anchoredOnBlockchain = await this.prisma.blockchainTransaction.count({
      where: { 
        statut: 'CONFIRMEE',
        ...(filter.agentId && { naissance: { agentId: filter.agentId } }),
        ...(filter.centerId && { naissance: { centerId: filter.centerId } })
      }
    });
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalMois = await this.prisma.birthRecord.count({
      where: { 
        createdAt: { gte: startOfMonth },
        ...filter
      }
    });
    
    return { 
      totalBirths, 
      totalMois, 
      pendingValidations, 
      validated,
      anchoredOnBlockchain 
    };
  }

  /**
   * Données pour la carte « couverture terrain » : points GPS des enregistrements
   * et préfectures sans dossier sur la période.
   * Réservé admin / superviseur (pas les vérificateurs — cahier des charges).
   */
  async getFieldMap(userId: string, from?: string, to?: string) {
    const user = await this.requireAdminOrSuperviseur(userId);

    let birthWhere: Record<string, unknown> = {};

    if (user.role === UserRole.SUPERVISEUR && user.agent?.centerId) {
      birthWhere.centerId = user.agent.centerId;
    }

    const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('Paramètres de dates invalides');
    }

    birthWhere.createdAt = { gte: fromDate, lte: toDate };

    const births = await this.prisma.birthRecord.findMany({
      where: birthWhere,
      select: {
        id: true,
        statut: true,
        createdAt: true,
        identifiantUniqueNational: true,
        prefectureAdministrativeId: true,
        enregistrementLatitude: true,
        enregistrementLongitude: true,
        agent: {
          include: { user: { select: { nom: true, prenom: true } } },
        },
        enfant: {
          select: {
            prenoms: true,
            nom: true,
            lieuNaissanceLibelle: true,
            prefectureNaissanceId: true,
          },
        },
      },
    });

    const prefTouches = new Map<string, number>();
    for (const b of births) {
      const touched = new Set<string>();
      if (b.prefectureAdministrativeId) {
        touched.add(b.prefectureAdministrativeId);
      }
      if (b.enfant?.prefectureNaissanceId) {
        touched.add(b.enfant.prefectureNaissanceId);
      }
      for (const pid of touched) {
        prefTouches.set(pid, (prefTouches.get(pid) || 0) + 1);
      }
    }

    const prefectures = await this.prisma.prefecture.findMany({
      orderBy: { nom: 'asc' },
      select: { id: true, nom: true, code: true, region: true },
    });

    const prefectureSummary = prefectures.map((p) => {
      const birthCount = prefTouches.get(p.id) || 0;
      return {
        id: p.id,
        nom: p.nom,
        code: p.code,
        region: p.region,
        birthCount,
        untouched: birthCount === 0,
      };
    });

    const points = births
      .filter(
        (b) =>
          b.enregistrementLatitude != null &&
          b.enregistrementLongitude != null &&
          !Number.isNaN(b.enregistrementLatitude) &&
          !Number.isNaN(b.enregistrementLongitude),
      )
      .map((b) => ({
        id: b.id,
        lat: b.enregistrementLatitude as number,
        lng: b.enregistrementLongitude as number,
        createdAt: b.createdAt,
        statut: b.statut,
        iun: b.identifiantUniqueNational,
        agentName:
          [b.agent?.user?.prenom, b.agent?.user?.nom].filter(Boolean).join(' ') || '—',
        enfant: b.enfant ? `${b.enfant.prenoms} ${b.enfant.nom}` : '—',
        lieuNaissance: b.enfant?.lieuNaissanceLibelle,
      }));

    const withGps = points.length;
    const withoutGps = births.length - withGps;

    const gpsCoords = points.map((p) => ({ lat: p.lat, lng: p.lng }));

    const unvisitedPlaces: {
      type: 'PREFECTURE' | 'CENTRE_DE_SANTE' | 'COMMUNE';
      id: string;
      nom: string;
      prefecture: string | null;
      region: string | null;
      motif: string;
      lat: number | null;
      lng: number | null;
    }[] = [];

    for (const p of prefectureSummary) {
      if (!p.untouched) continue;
      unvisitedPlaces.push({
        type: 'PREFECTURE',
        id: p.id,
        nom: p.nom,
        prefecture: p.nom,
        region: p.region,
        motif:
          'Aucun dossier lié sur la période (préfecture administrative ou lieu de naissance enregistré).',
        lat: null,
        lng: null,
      });
    }

    let superviseurPrefectureId: string | null = null;
    if (user.role === UserRole.SUPERVISEUR && user.agent?.centerId) {
      const agentCenter = await this.prisma.center.findUnique({
        where: { id: user.agent.centerId },
        select: { prefectureId: true },
      });
      superviseurPrefectureId = agentCenter?.prefectureId ?? null;
    }

    const centerWhere: Prisma.CenterWhereInput = {
      actif: true,
      coordonneesGps: { not: null },
    };
    if (user.role === UserRole.SUPERVISEUR) {
      if (superviseurPrefectureId) {
        centerWhere.prefectureId = superviseurPrefectureId;
      } else if (user.agent?.centerId) {
        centerWhere.id = user.agent.centerId;
      }
    }

    const centersForGaps = await this.prisma.center.findMany({
      where: centerWhere,
      select: {
        id: true,
        nom: true,
        type: true,
        coordonneesGps: true,
        prefecture: { select: { nom: true, region: true } },
        commune: { select: { nom: true } },
        village: { select: { nom: true } },
      },
    });

    for (const c of centersForGaps) {
      const pos = parseCoordonneesGps(c.coordonneesGps);
      if (!pos) continue;
      if (gpsCoords.length > 0 && isWithinGpsCoverage(pos.lat, pos.lng, gpsCoords, FIELD_COVERAGE_RADIUS_KM)) {
        continue;
      }
      const detailParts = [c.commune?.nom, c.village?.nom].filter(Boolean);
      const detail = detailParts.length > 0 ? detailParts.join(' · ') : null;
      unvisitedPlaces.push({
        type: 'CENTRE_DE_SANTE',
        id: c.id,
        nom: `${c.nom} (${c.type})`,
        prefecture: c.prefecture?.nom ?? null,
        region: c.prefecture?.region ?? null,
        motif:
          gpsCoords.length === 0
            ? `Aucun passage terrain GPS sur la période (${FIELD_COVERAGE_RADIUS_KM} km).${detail ? ` ${detail}.` : ''}`
            : `Aucun passage dans ${FIELD_COVERAGE_RADIUS_KM} km autour du centre.${detail ? ` ${detail}.` : ''}`,
        lat: pos.lat,
        lng: pos.lng,
      });
    }

    const untouchedPrefIds = prefectureSummary.filter((p) => p.untouched).map((p) => p.id);
    if (untouchedPrefIds.length > 0) {
      const communesOrphelines = await this.prisma.commune.findMany({
        where: { prefectureId: { in: untouchedPrefIds } },
        orderBy: { nom: 'asc' },
        take: 250,
        select: {
          id: true,
          nom: true,
          prefecture: { select: { nom: true, region: true } },
        },
      });
      for (const co of communesOrphelines) {
        unvisitedPlaces.push({
          type: 'COMMUNE',
          id: co.id,
          nom: co.nom,
          prefecture: co.prefecture.nom,
          region: co.prefecture.region,
          motif:
            'Préfecture sans dossier lié sur la période — commune à prioriser pour une mission terrain (coordonnées non renseignées au niveau commune).',
          lat: null,
          lng: null,
        });
      }
    }

    const typeOrder = { PREFECTURE: 0, CENTRE_DE_SANTE: 1, COMMUNE: 2 };
    unvisitedPlaces.sort((a, b) => {
      const ta = typeOrder[a.type];
      const tb = typeOrder[b.type];
      if (ta !== tb) return ta - tb;
      return a.nom.localeCompare(b.nom, 'fr');
    });

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      summary: {
        totalBirths: births.length,
        withGps,
        withoutGps,
        untouchedPrefectureCount: prefectureSummary.filter((p) => p.untouched).length,
      },
      points,
      prefectures: prefectureSummary,
      unvisitedPlaces,
      coverageRadiusKm: FIELD_COVERAGE_RADIUS_KM,
    };
  }

  /**
   * Recherche de lieux en Guinée (proxy Nominatim) pour la carte terrain.
   * Usage modéré — respecter https://nominatim.org/release-docs/develop/api/Usage-Policy/
   */
  async geocodeGuinea(userId: string, q: string) {
    await this.requireAdminOrSuperviseur(userId);

    const trimmed = (q || '').trim();
    if (trimmed.length < 2 || trimmed.length > 200) {
      throw new BadRequestException('Recherche invalide (2 à 200 caractères).');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=6&countrycodes=gn&q=${encodeURIComponent(trimmed)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NaissanceChain/1.0 (field-map admin; +https://nominatim.openstreetmap.org)',
        'Accept-Language': 'fr',
      },
    });

    if (!res.ok) {
      throw new BadRequestException('Service de recherche indisponible.');
    }

    const raw = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;

    const results = raw
      .map((r) => ({
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        displayName: r.display_name,
      }))
      .filter((r) => !Number.isNaN(r.lat) && !Number.isNaN(r.lng));

    return { results };
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
  }
}
