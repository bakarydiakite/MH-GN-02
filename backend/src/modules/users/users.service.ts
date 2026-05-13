import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
        photoUrl: true,
        actif: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            centerId: true,
            center: {
              select: { nom: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Transformer pour inclure centreId et centreNom
    return users.map(user => ({
      ...user,
      centreId: user.agent?.centerId || null,
      centreNom: user.agent?.center?.nom || null,
      agent: undefined,
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
        photoUrl: true,
        actif: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            centerId: true,
            center: {
              select: { nom: true }
            }
          }
        }
      },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return {
      ...user,
      centreId: user.agent?.centerId || null,
      centreNom: user.agent?.center?.nom || null,
      agent: undefined,
    };
  }

  async create(data: any) {
    const { centerId, matricule, fonction, motDePasseHash, ...userData } = data;
    
    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        motDePasseHash: motDePasseHash || 'temp123', // Sera écrasé par le mot de passe fourni
      },
    });
    
    // Si Superviseur ou Agent, créer le profil agent avec le centre
    if ((userData.role === 'SUPERVISEUR' || userData.role === 'AGENT') && centerId) {
      await this.prisma.agent.create({
        data: {
          utilisateurId: user.id,
          centerId: centerId,
          matricule: matricule || `SUP-${Date.now()}`,
          fonction: fonction || (userData.role === 'SUPERVISEUR' ? 'Superviseur' : 'Agent'),
        },
      });
    }
    
    return this.findOne(user.id);
  }

  async update(id: string, data: any) {
    // Vérifier que l'utilisateur existe
    await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
        photoUrl: true,
        actif: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    // Vérifier que l'utilisateur existe
    await this.findOne(id);
    
    await this.prisma.user.delete({
      where: { id },
    });
    
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
