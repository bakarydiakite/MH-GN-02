import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AdminRegisterDto, LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(dto: { idToken: string }) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: dto.idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');

      const { email, family_name, given_name, sub } = payload;

      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await this.prisma.user.create({
          data: {
            email: email!,
            nom: family_name || 'User',
            prenom: given_name || '',
            role: UserRole.FAMILLE,
            motDePasseHash: await bcrypt.hash(sub, 10), // Placeholder password
            actif: true,
          },
        });
      }

      return this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async register(dto: RegisterDto) {
    // ... existing register code ...
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Si c'est une famille et qu'aucun mot de passe n'est fourni, on met un par défaut pour la démo
    const finalPassword = dto.password || (dto.role === 'FAMILLE' ? 'password123' : null);
    
    if (!finalPassword) {
      throw new BadRequestException('Le mot de passe est obligatoire pour les agents.');
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Convert role to uppercase to match Prisma enum
    const role = (dto.role?.toUpperCase() || 'AGENT') as UserRole;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        motDePasseHash: hashedPassword,
        nom: dto.nom,
        prenom: dto.prenom,
        telephone: dto.telephone,
        role: role,
      },
    });

    // If role is AGENT, create an entry in the agent table too
    if (user.role === UserRole.AGENT) {
      // Vérifier si le centre existe réellement avant de le lier
      let validCenterId = undefined;
      if (dto.centerId) {
        const center = await this.prisma.center.findUnique({ 
          where: { id: dto.centerId } 
        });
        if (center) validCenterId = dto.centerId;
      }

      await this.prisma.agent.create({
        data: {
          utilisateurId: user.id,
          matricule: dto.matricule,
          fonction: dto.fonction,
          centerId: validCenterId,
          actif: true,
        },
      });
    }

    return this.generateToken(user);
  }

  async registerFirstAdmin(dto: AdminRegisterDto) {
    const existingAdmin = await this.prisma.user.count({
      where: { role: UserRole.ADMINISTRATEUR },
    });

    if (existingAdmin > 0) {
      throw new ConflictException(
        "Un compte administrateur existe deja. La creation publique d'un admin est fermee.",
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('Email deja utilise');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        motDePasseHash: await bcrypt.hash(dto.password, 10),
        nom: dto.nom.trim(),
        prenom: dto.prenom?.trim(),
        telephone: dto.telephone?.trim(),
        role: UserRole.ADMINISTRATEUR,
        actif: true,
        derniereConnexionAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        utilisateurId: user.id,
        action: 'ADMIN_BOOTSTRAP_CREATED',
        typeEntite: 'User',
        entiteId: user.id,
        details: {
          email: user.email,
          role: user.role,
        },
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email.toLowerCase().trim() },
          { telephone: dto.email.trim() }
        ]
      },
    });

    // LOGIQUE "MAGIC LOGIN" : Si l'utilisateur n'existe pas mais que le numéro est dans la table Parent
    if (!user) {
      const inputTel = dto.email.trim();
      const cleanTel = inputTel.replace(/[^\d+]/g, ''); // Garder uniquement chiffres et +
      
      // On cherche avec plusieurs formats (avec ou sans +224)
      const parentRecord = await this.prisma.parent.findFirst({
        where: {
          OR: [
            { telephone: cleanTel },
            { telephone: cleanTel.startsWith('6') ? `+224${cleanTel}` : cleanTel },
            { telephone: cleanTel.startsWith('+224') ? cleanTel.substring(4) : cleanTel },
            { telephone: { contains: cleanTel.slice(-9) } } // Recherche par les 9 derniers chiffres (sécurité)
          ]
        }
      });

      if (parentRecord) {
        try {
          // On vérifie une dernière fois si l'utilisateur n'existe pas déjà (sécurité concurrence)
          const existingUser = await this.prisma.user.findFirst({
            where: { telephone: parentRecord.telephone }
          });

          if (existingUser) {
            user = existingUser;
          } else {
            const tel = parentRecord.telephone || cleanTel;
            // On crée le compte User automatiquement
            user = await this.prisma.user.create({
              data: {
                email: `${tel.replace('+', '')}@famille.nc`,
                telephone: tel,
                nom: parentRecord.nom,
                prenom: parentRecord.prenom || '',
                motDePasseHash: await bcrypt.hash('password123', 10),
                role: 'FAMILLE',
              }
            });
          }
        } catch (dbError) {
          throw new UnauthorizedException("Erreur lors de la création de votre espace. Veuillez contacter un agent.");
        }
      } else {
        throw new UnauthorizedException("Numéro non reconnu. Vérifiez que l'agent a bien enregistré votre numéro sur l'acte de naissance.");
      }
    }

    // LOGIQUE SPÉCIFIQUE DÉMO : Pas de mot de passe requis pour les FAMILLES
    if (user.role === 'FAMILLE') {
      return this.generateToken(user);
    }

    // Pour les AGENTS, le mot de passe reste obligatoire
    const isPasswordValid = await bcrypt.compare(dto.password || '', user.motDePasseHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.generateToken(user);
  }

  async adminLogin(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email.toLowerCase().trim() },
          { telephone: dto.email.trim() },
        ],
      },
    });

    if (!user || !user.actif) {
      throw new UnauthorizedException('Identifiants administrateur invalides');
    }

    const allowedRoles: UserRole[] = [
      UserRole.ADMINISTRATEUR,
      UserRole.SUPERVISEUR,
      UserRole.VERIFICATEUR,
    ];

    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedException("Ce compte n'a pas accès au portail web d'administration");
    }

    const isPasswordValid = await bcrypt.compare(dto.password || '', user.motDePasseHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants administrateur invalides');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { derniereConnexionAt: new Date() },
    });

    return this.generateToken(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        derniereConnexionAt: true,
      },
    });

    if (!user || !user.actif) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  private generateToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
    };
  }
}
