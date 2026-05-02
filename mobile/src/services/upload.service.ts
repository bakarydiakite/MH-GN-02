import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const uploadService = {
  async uploadImage(uri?: string, type?: string): Promise<string | undefined> {
    if (!uri) return undefined;
    try {
      const fileName = `${Date.now()}_${type}.jpg`;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      
      const { data, error } = await supabase.storage
        .from('birth-document')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('birth-document')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (e) {
      console.error('Error uploading to Supabase:', e);
      return undefined;
    }
  }
};
