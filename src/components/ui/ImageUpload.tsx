'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Button from './Button';
import { uploadImage, uploadMultipleImages, deleteImage, compressImage, STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage';

interface ImageUploadProps {
  bucket: StorageBucket;
  path?: string;
  multiple?: boolean;
  maxFiles?: number;
  value?: string | string[];
  onChange?: (urls: string | string[]) => void;
  onPathsChange?: (paths: string | string[]) => void;
  className?: string;
  compress?: boolean;
}

export function ImageUpload({
  bucket,
  path,
  multiple = false,
  maxFiles = 5,
  value,
  onChange,
  onPathsChange,
  className = '',
  compress = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>(
    value ? (Array.isArray(value) ? value : [value]) : []
  );
  const [storagePaths, setStoragePaths] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files);

      // Check max files limit
      if (multiple && preview.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`);
        setUploading(false);
        return;
      }

      // Compress images if enabled
      const filesToUpload = compress
        ? await Promise.all(fileArray.map(file => compressImage(file)))
        : fileArray;

      if (multiple) {
        // Upload multiple images
        const result = await uploadMultipleImages(filesToUpload, bucket, path);

        if (result.errors.length > 0) {
          setError(result.errors.join(', '));
        }

        if (result.urls.length > 0) {
          const newPreview = [...preview, ...result.urls];
          const newPaths = [...storagePaths, ...result.paths];
          
          setPreview(newPreview);
          setStoragePaths(newPaths);
          
          onChange?.(newPreview);
          onPathsChange?.(newPaths);
        }
      } else {
        // Upload single image
        const result = await uploadImage(filesToUpload[0], bucket, path);

        if ('error' in result) {
          setError(result.error);
        } else {
          setPreview([result.url]);
          setStoragePaths([result.path]);
          
          onChange?.(result.url);
          onPathsChange?.(result.path);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image(s)');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [bucket, path, multiple, maxFiles, preview, storagePaths, onChange, onPathsChange, compress]);

  const handleRemove = useCallback(async (index: number) => {
    const pathToDelete = storagePaths[index];
    
    if (pathToDelete) {
      // Delete from storage
      await deleteImage(bucket, pathToDelete);
    }

    const newPreview = preview.filter((_, i) => i !== index);
    const newPaths = storagePaths.filter((_, i) => i !== index);
    
    setPreview(newPreview);
    setStoragePaths(newPaths);
    
    if (multiple) {
      onChange?.(newPreview);
      onPathsChange?.(newPaths);
    } else {
      onChange?.(newPreview[0] || '');
      onPathsChange?.(newPaths[0] || '');
    }
  }, [bucket, preview, storagePaths, multiple, onChange, onPathsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={className}>
      {/* Upload Area */}
      {(multiple || preview.length === 0) && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Upload images"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
                {multiple && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {maxFiles} images
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Preview Grid */}
      {preview.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} mt-4`}>
          {preview.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add More Button (for multiple uploads) */}
      {multiple && preview.length > 0 && preview.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-4 w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add More Images ({preview.length}/{maxFiles})
        </Button>
      )}
    </div>
  );
}
