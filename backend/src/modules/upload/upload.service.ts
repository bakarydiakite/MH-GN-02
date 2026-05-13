import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://nibyqdwvvaqlkdxkaqyk.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYnlxZHd2dmFxbGtkeGthcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDA0MjQsImV4cCI6MjA5MzIxNjQyNH0.utiJj7FQseT7LPxYxVmesnFkumA4-fmM32fclZ8OpOY';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized');
  }

  async uploadImage(base64Data: string, filename: string): Promise<string> {
    try {
      // Convertir base64 en Buffer
      const buffer = Buffer.from(base64Data, 'base64');

      const { data, error } = await this.supabase.storage
        .from('birth-document')
        .upload(filename, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        this.logger.error('Upload error:', error);
        throw error;
      }

      // Obtenir l'URL publique
      const { data: urlData } = this.supabase.storage
        .from('birth-document')
        .getPublicUrl(filename);

      this.logger.log(`File uploaded: ${filename}`);
      return urlData.publicUrl;
    } catch (error) {
      this.logger.error('Error uploading to Supabase:', error);
      throw error;
    }
  }

  async uploadMultiple(files: { base64: string; type: string }[]): Promise<{ type: string; url: string }[]> {
    const results: { type: string; url: string }[] = [];

    for (const file of files) {
      const filename = `${Date.now()}_${file.type}.jpg`;
      const url = await this.uploadImage(file.base64, filename);
      results.push({ type: file.type, url });
    }

    return results;
  }

  getPublicUrl(filename: string): string {
    const { data } = this.supabase.storage
      .from('birth-document')
      .getPublicUrl(filename);
    return data.publicUrl;
  }
}
