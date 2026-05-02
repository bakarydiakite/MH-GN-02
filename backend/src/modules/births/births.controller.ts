import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { BirthsService } from './births.service';
import { CreateBirthDto, ValidateBirthDto } from './dto/birth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('births')
export class BirthsController {
  constructor(private readonly birthsService: BirthsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateBirthDto) {
    return this.birthsService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any, @Query() filters: any) {
    return this.birthsService.findAll({ ...filters, userId: req.user.userId });
  }

  @Get('verify/:iun')
  verify(@Param('iun') iun: string) {
    return this.birthsService.verify(iun);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link')
  link(@Request() req: any, @Body('iun') iun: string) {
    return this.birthsService.linkChildToUser(req.user.userId, iun);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.birthsService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SUPERVISEUR, UserRole.ADMINISTRATEUR)
  @Post(':id/validate')
  validate(@Param('id') id: string, @Request() req: any) {
    // Note: on utilise un ID temporaire puisqu'il n'y a plus de req.user
    return this.birthsService.validate(id, 'admin-id-test');
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SUPERVISEUR, UserRole.ADMINISTRATEUR)
  @Post(':id/reject')
  reject(@Param('id') id: string, @Request() req: any, @Body() dto: ValidateBirthDto) {
    return this.birthsService.reject(id, req.user.userId, dto);
  }
}
