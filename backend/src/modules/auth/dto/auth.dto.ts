import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Peut être email ou téléphone

  @IsString()
  @IsOptional()
  password?: string;
}

export class RegisterDto {
  @IsEmail() @IsNotEmpty() email: string;
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

export class AdminRegisterDto {
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() @MinLength(8) password: string;
  @IsString() @IsNotEmpty() nom: string;
  @IsString() @IsOptional() prenom?: string;
  @IsString() @IsOptional() telephone?: string;
}

export class GoogleLoginDto {
  @IsString() @IsNotEmpty() idToken: string;
}
