import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param path - Optional custom path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<string> {
  const fileName = path || `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
