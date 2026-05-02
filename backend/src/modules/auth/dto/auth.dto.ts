import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Peut être email ou téléphone

  @IsString()
  @IsOptional()
  password?: string;
}

export class RegisterDto {
  @IsString() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() @MinLength(6) password: string;
  @IsString() @IsNotEmpty() nom: string;
  @IsString() @IsOptional() prenom?: string;
  @IsString() @IsOptional() telephone?: string;
  @IsString() @IsOptional() role?: string;
  
  // Optional Agent fields
  @IsString() @IsOptional() matricule?: string;
  @IsString() @IsOptional() fonction?: string;
  @IsString() @IsOptional() centerId?: string;
}

export class GoogleLoginDto {
  @IsString() @IsNotEmpty() idToken: string;
}
