import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type StorageBucket = 'products' | 'vendors' | 'categories' | 'avatars';

export const STORAGE_BUCKETS = {
  products: 'products',
  vendors: 'vendors', 
  categories: 'categories',
  avatars: 'avatars',
} as const;

export interface UploadOptions {
  bucket: StorageBucket;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface SingleUploadResult {
  url: string;
  path: string;
}

export interface SingleUploadError {
  error: string;
}

export interface MultipleUploadResult {
  urls: string[];
  paths: string[];
  errors: string[];
}

// Default configurations for each bucket
const BUCKET_CONFIGS = {
  products: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  vendors: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  categories: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  avatars: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
};

/**
 * Validate file before upload
 */
export function validateFile(file: File, options: UploadOptions): string | null {
  const config = BUCKET_CONFIGS[options.bucket];
  const maxSize = options.maxSize || config.maxSize;
  const allowedTypes = options.allowedTypes || config.allowedTypes;

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }

  return null;
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  const fileName = prefix 
    ? `${prefix}-${baseName}-${timestamp}-${random}.${extension}`
    : `${baseName}-${timestamp}-${random}.${extension}`;
    
  return fileName;
}

/**
 * Upload single file to Supabase Storage
 */
export async function uploadFile(
  file: File, 
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validate file
    const validationError = validateFile(file, options);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // Generate file path
    const fileName = generateFileName(file.name);
    const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    };

  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * Upload single image (legacy function for compatibility)
 */
export async function uploadImage(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<SingleUploadResult | SingleUploadError> {
  const result = await uploadFile(file, { bucket, folder });
  
  if (result.success && result.url && result.path) {
    return { url: result.url, path: result.path };
  } else {
    return { error: result.error || 'Upload failed' };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map(file => uploadFile(file, options))
  );
  
  return results;
}

/**
 * Upload multiple images (legacy function for compatibility)
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: StorageBucket,
  folder?: string
): Promise<MultipleUploadResult> {
  const results = await uploadMultipleFiles(files, { bucket, folder });
  
  const urls: string[] = [];
  const paths: string[] = [];
  const errors: string[] = [];
  
  results.forEach(result => {
    if (result.success && result.url && result.path) {
      urls.push(result.url);
      paths.push(result.path);
    } else if (result.error) {
      errors.push(result.error);
    }
  });
  
  return { urls, paths, errors };
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
}

/**
 * Delete image (legacy function for compatibility)
 */
export async function deleteImage(bucket: StorageBucket, path: string): Promise<void> {
  await deleteFile(bucket, path);
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return data.publicUrl;
}

/**
 * Compress image before upload (client-side)
 */
export function compressImage(
  file: File, 
  maxWidth: number = 1200, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create thumbnail from image
 */
export function createThumbnail(
  file: File,
  size: number = 200
): Promise<File> {
  return compressImage(file, size, 0.7);
}