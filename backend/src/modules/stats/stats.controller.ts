import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboardStats(@Request() req: any) {
    return this.statsService.getDashboardStats(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR, UserRole.SUPERVISEUR)
  @Get('field-map')
  getFieldMap(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.statsService.getFieldMap(req.user.userId, from, to);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATEUR, UserRole.SUPERVISEUR)
  @Get('geocode')
  getGeocode(@Request() req: any, @Query('q') q: string) {
    return this.statsService.geocodeGuinea(req.user.userId, q);
  }
}
