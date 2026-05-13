import { Injectable, NotFoundException } from '@nestjs/common';
import { BirthStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true },
    });

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
  }
}
