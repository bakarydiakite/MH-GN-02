import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

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
}
