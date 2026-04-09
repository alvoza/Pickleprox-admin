'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  category: 'avatars' | 'courts' | 'tournaments' | 'gear' | 'groups';
  label?: string;
  aspectHint?: string;
}

export function ImageUpload({ value, onChange, category, label, aspectHint }: ImageUploadProps) {
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

    const result = await api.uploadFile(file, category);

    if (result.error || !result.data) {
      setError(result.error || 'Upload failed');
      setUploading(false);
      return;
    }

    onChange(result.data);
    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleRemove() {
    onChange('');
    setError(null);
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="h-32 w-32 rounded-lg border border-border-light object-cover dark:border-border-dark"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-muted transition-colors hover:border-brand-orange hover:text-brand-orange dark:border-gray-600 dark:hover:border-brand-orange"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-xs">Upload</span>
            </>
          )}
        </button>
      )}

      {aspectHint && !value && (
        <p className="mt-1 text-xs text-muted">{aspectHint}</p>
      )}

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
