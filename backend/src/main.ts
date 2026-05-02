import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { json, urlencoded } from 'express';

// Fix for BigInt serialization issue with Prisma/NestJS
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase body size for Base64 images
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS for Web and Mobile connectivity
  app.enableCors();

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Activer le CORS pour permettre au Frontend de communiquer avec le Backend
  app.enableCors({
    origin: '*', // En développement, on autorise tout. En production, on mettra l'URL du frontend.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Serveur NaissanceChain démarré sur : http://192.168.1.127:${port}`);
}
bootstrap();
