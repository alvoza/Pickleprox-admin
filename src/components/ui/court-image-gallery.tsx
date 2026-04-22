'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { CourtImage } from '@/types/models';

interface CourtImageGalleryProps {
  images: CourtImage[];
  onChange: (images: CourtImage[]) => void;
}

export function CourtImageGallery({ images, onChange }: CourtImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    const result = await api.uploadFile(file, 'courts');

    if (result.error || !result.data) {
      setError(result.error || 'Upload failed');
      setUploading(false);
      return;
    }

    const newImage: CourtImage = {
      url: result.data,
      isDefault: images.length === 0,
      order: images.length,
    };

    onChange([...images, newImage]);
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleSetDefault(index: number) {
    const updated = images.map((img, i) => ({
      ...img,
      isDefault: i === index,
    }));
    onChange(updated);
  }

  function handleRemove(index: number) {
    const wasDefault = images[index].isDefault;
    const remaining = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }));

    if (wasDefault && remaining.length > 0) {
      remaining[0].isDefault = true;
    }

    onChange(remaining);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        Court Images
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="group relative">
            <img
              src={image.url}
              alt={`Court image ${index + 1}`}
              className="h-[120px] w-[120px] rounded-lg border border-border-light object-cover dark:border-border-dark"
            />

            {/* Default star toggle - top left */}
            <button
              type="button"
              onClick={() => handleSetDefault(index)}
              className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/70"
              title={image.isDefault ? 'Default image' : 'Set as default'}
            >
              <Star
                size={14}
                className={
                  image.isDefault
                    ? 'fill-brand-orange text-brand-orange'
                    : 'text-gray-300'
                }
              />
            </button>

            {/* Remove button - top right */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity hover:bg-red-600 group-hover:opacity-100"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add Image card */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-[120px] w-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-muted transition-colors hover:border-brand-orange hover:text-brand-orange dark:border-gray-600 dark:hover:border-brand-orange"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-xs">Add Image</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
