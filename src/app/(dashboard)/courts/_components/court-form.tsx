'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { CourtImageGallery } from '@/components/ui/court-image-gallery';
import type { Court, CourtImage } from '@/types/models';

const AMENITY_OPTIONS = [
  'Lights', 'Water Fountain', 'Restrooms', 'Parking',
  'Pro Shop', 'Bleachers', 'Cafe', 'Lockers',
];

interface CourtFormData {
  name: string;
  address: string;
  location: string;
  numberOfCourts: number;
  amenities: string[];
  hoursOpen: string;
  rating: number;
  imageUrl: string;
  images: CourtImage[];
  latitude: string;
  longitude: string;
}

const emptyForm: CourtFormData = {
  name: '', address: '', location: '', numberOfCourts: 1,
  amenities: [], hoursOpen: '', rating: 0, imageUrl: '',
  images: [], latitude: '', longitude: '',
};

interface CourtFormProps {
  court?: Court;
}

export function CourtForm({ court }: CourtFormProps) {
  const router = useRouter();
  const isEditing = !!court;

  const [form, setForm] = useState<CourtFormData>(
    court
      ? {
          name: court.name,
          address: court.address,
          location: court.location,
          numberOfCourts: court.numberOfCourts,
          amenities: court.amenities || [],
          hoursOpen: court.hoursOpen,
          rating: court.rating,
          imageUrl: court.imageUrl || '',
          images: court.images || (court.imageUrl?.startsWith('http') ? [{ url: court.imageUrl, isDefault: true, order: 0 }] : []),
          latitude: court.coordinates?.latitude?.toString() || '',
          longitude: court.coordinates?.longitude?.toString() || '',
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggleAmenity(amenity: string) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.address.trim()) {
      setError('Name and address are required');
      return;
    }
    setSaving(true);
    setError('');

    const defaultImg = form.images.find(i => i.isDefault) || form.images[0];
    const payload: Partial<Court> = {
      name: form.name,
      address: form.address,
      location: form.location,
      numberOfCourts: form.numberOfCourts,
      amenities: form.amenities,
      hoursOpen: form.hoursOpen,
      rating: form.rating,
      images: form.images,
      imageUrl: defaultImg?.url || '',
      ...(form.latitude && form.longitude ? {
        coordinates: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
      } : {}),
    };

    const result = isEditing
      ? await api.admin.updateCourt(court.id, payload)
      : await api.admin.createCourt(payload);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push('/courts');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Court' : 'Add New Court'}
        subtitle={isEditing ? `Editing ${court.name}` : 'Create a new court location'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Courts', href: '/courts' },
          { label: isEditing ? 'Edit' : 'New' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/courts')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Court' : 'Create Court'}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <FormCard title="Basic Information" description="Court name, location, and address details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Court Name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClasses}
              placeholder="e.g. Sunset Park Courts"
            />
          </FormField>
          <FormField label="Location Label">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClasses}
              placeholder="e.g. Miami, FL"
            />
          </FormField>
        </div>
        <FormField label="Address">
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={inputClasses}
            placeholder="Full street address"
          />
        </FormField>
      </FormCard>

      <FormCard title="Court Details" description="Number of courts, rating, and operating hours">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Number of Courts">
            <input
              type="number"
              min={1}
              value={form.numberOfCourts}
              onChange={(e) => setForm({ ...form, numberOfCourts: parseInt(e.target.value) || 1 })}
              className={inputClasses}
            />
          </FormField>
          <FormField label="Rating (0-5)">
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
              className={inputClasses}
            />
          </FormField>
          <FormField label="Hours Open">
            <input
              value={form.hoursOpen}
              onChange={(e) => setForm({ ...form, hoursOpen: e.target.value })}
              className={inputClasses}
              placeholder="e.g. 6:00 AM - 10:00 PM"
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Location Coordinates" description="GPS coordinates for map placement">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Latitude">
            <input
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className={inputClasses}
              placeholder="e.g. 25.7617"
            />
          </FormField>
          <FormField label="Longitude">
            <input
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className={inputClasses}
              placeholder="e.g. -80.1918"
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Images" description="Upload and manage court photos">
        <CourtImageGallery
          images={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />
      </FormCard>

      <FormCard title="Amenities" description="Select available amenities at this court">
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map(amenity => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                form.amenities.includes(amenity)
                  ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                  : 'border-[var(--input-border)] text-muted hover:border-brand-orange/50 hover:text-[var(--foreground)]'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </FormCard>

      {/* Bottom save bar */}
      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/courts')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Update Court' : 'Create Court'}
        </Button>
      </div>
    </div>
  );
}
