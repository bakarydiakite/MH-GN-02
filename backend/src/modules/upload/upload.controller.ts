import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  async uploadImage(@Body() body: { base64: string; filename?: string }) {
    const filename = body.filename || `${Date.now()}_document.jpg`;
    const url = await this.uploadService.uploadImage(body.base64, filename);
    return { url, filename };
  }

  @UseGuards(JwtAuthGuard)
  @Post('multiple')
  async uploadMultiple(@Body() body: { files: { base64: string; type: string }[] }) {
    const results = await this.uploadService.uploadMultiple(body.files);
    return { files: results };
  }
}
