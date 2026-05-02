import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMINISTRATEUR, UserRole.SUPERVISEUR)
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboardStats(@Request() req: any) {
    return this.statsService.getDashboardStats(req.user.userId);
  }
}
