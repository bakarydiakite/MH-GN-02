import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminRegisterDto, LoginDto, RegisterDto, GoogleLoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  adminRegister(@Body() dto: AdminRegisterDto) {
    return this.authService.registerFirstAdmin(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return this.authService.me(req.user.userId);
  }
}
