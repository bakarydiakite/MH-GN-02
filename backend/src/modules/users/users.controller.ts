import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('centers')
  findAllCenters() {
    return this.prisma.center.findMany({
      select: { id: true, nom: true, type: true },
      orderBy: { nom: 'asc' },
    });
  }

  /** Profil de l’utilisateur connecté (doit être déclaré avant GET :id). */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: { userId: string } }) {
    return this.usersService.findOne(req.user.userId);
  }

  /** Mise à jour du profil connecté (doit être déclaré avant PATCH :id). */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Request() req: { user: { userId: string } }, @Body() body: UpdateProfileDto) {
    const userId = req.user.userId;
    const { password, ...rest } = body;
    const updateData: Record<string, unknown> = {};
    if (rest.prenom !== undefined) updateData.prenom = rest.prenom;
    if (rest.nom !== undefined) updateData.nom = rest.nom;
    if (rest.telephone !== undefined) updateData.telephone = rest.telephone;
    if (rest.photoUrl !== undefined) updateData.photoUrl = rest.photoUrl;
    if (password && password.length > 0) {
      updateData.motDePasseHash = await bcrypt.hash(password, 10);
    }
    if (Object.keys(updateData).length === 0) {
      return this.usersService.findOne(userId);
    }
    return this.usersService.update(userId, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
