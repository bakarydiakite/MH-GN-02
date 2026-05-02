import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BirthStatus } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    console.log(`[StatsService] DASHBOARD_REQUEST for userId: ${userId}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // --- LOGIQUE POUR AGENT ---
    if (user.role === 'AGENT' && user.agent) {
      const totalAll = await this.prisma.birthRecord.count({
        where: { agentId: user.agent.id },
      });

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalMois = await this.prisma.birthRecord.count({
        where: {
          agentId: user.agent.id,
          createdAt: { gte: startOfMonth },
        },
      });

      return { totalMois, total: totalAll, pending: 0 };
    }

    // --- LOGIQUE POUR FAMILLE ---
    if (user.role === 'FAMILLE') {
      // On compte les actes où l'utilisateur est listé comme parent via son téléphone dédié
      const linkedBirthsCount = await this.prisma.birthRecord.count({
        where: {
          parents: {
            some: {
              telephone: user.telephone
            }
          }
        }
      });

      return {
        totalMois: 0,
        total: linkedBirthsCount,
        pending: 0,
      };
    }

    return { totalMois: 0, total: 0, pending: 0 };
  }
}
