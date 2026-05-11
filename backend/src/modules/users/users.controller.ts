import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  // GET /users/centers - Liste tous les centres
  @UseGuards(JwtAuthGuard)
  @Get('centers')
  findAllCenters() {
    return this.prisma.center.findMany({
      select: { id: true, nom: true, type: true },
      orderBy: { nom: 'asc' },
    });
  }

  // GET /users - Liste tous les utilisateurs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id - Récupère un utilisateur
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // POST /users - Crée un utilisateur
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Post()
  async create(@Body() body: any) {
    const { password, ...data } = body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    return this.usersService.create({
      ...data,
      motDePasseHash: hashedPassword,
    });
  }

  // PATCH /users/:id - Met à jour un utilisateur
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const { password, ...data } = body;
    const updateData: any = { ...data };
    if (password) {
      updateData.motDePasseHash = await bcrypt.hash(password, 10);
    }
    return this.usersService.update(id, updateData);
  }

  // PATCH /users/me - Met à jour le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Request() req: any, @Body() body: { prenom?: string, nom?: string, telephone?: string, photoUrl?: string }) {
    try {
      const userId = req.user.userId;
      return await this.usersService.update(userId, {
        prenom: body.prenom,
        nom: body.nom,
        telephone: body.telephone,
        photoUrl: body.photoUrl,
      });
    } catch (error) {
      console.error('UpdateMe Error:', error);
      throw error;
    }
  }

  // DELETE /users/:id - Supprime un utilisateur
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
