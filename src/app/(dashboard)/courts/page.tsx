'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { MapPin, Star, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Court } from '@/types/models';

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
  latitude: string;
  longitude: string;
}

const emptyForm: CourtFormData = {
  name: '', address: '', location: '', numberOfCourts: 1,
  amenities: [], hoursOpen: '', rating: 0, imageUrl: '',
  latitude: '', longitude: '',
};

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Court | null>(null);
  const [form, setForm] = useState<CourtFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourts = useCallback(async () => {
    const result = await api.admin.getCourts();
    if (result.data) setCourts(result.data.courts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  function openCreateModal() {
    setEditingCourt(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }

  function openEditModal(court: Court) {
    setEditingCourt(court);
    setForm({
      name: court.name,
      address: court.address,
      location: court.location,
      numberOfCourts: court.numberOfCourts,
      amenities: court.amenities || [],
      hoursOpen: court.hoursOpen,
      rating: court.rating,
      imageUrl: court.imageUrl || '',
      latitude: court.coordinates?.latitude?.toString() || '',
      longitude: court.coordinates?.longitude?.toString() || '',
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.address.trim()) {
      setError('Name and address are required');
      return;
    }
    setSaving(true);
    setError('');

    const payload: Partial<Court> = {
      name: form.name,
      address: form.address,
      location: form.location,
      numberOfCourts: form.numberOfCourts,
      amenities: form.amenities,
      hoursOpen: form.hoursOpen,
      rating: form.rating,
      imageUrl: form.imageUrl,
      ...(form.latitude && form.longitude ? {
        coordinates: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
      } : {}),
    };

    if (editingCourt) {
      const result = await api.admin.updateCourt(editingCourt.id, payload);
      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await api.admin.createCourt(payload);
      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalOpen(false);
    await loadCourts();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteCourt(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      await loadCourts();
    }
  }

  function toggleAmenity(amenity: string) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  const columns: Column<Court & Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Court Name',
      sortable: true,
      render: (court) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <MapPin size={18} />
          </div>
          <div>
            <p className="font-medium">{court.name}</p>
            <p className="text-xs text-muted">{court.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (court) => (
        <span className="text-sm text-muted">{court.address}</span>
      ),
    },
    {
      key: 'numberOfCourts',
      header: 'Courts',
      sortable: true,
      render: (court) => (
        <Badge variant="info">{court.numberOfCourts} courts</Badge>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (court) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-medium">{court.rating}</span>
          <span className="text-xs text-muted">({court.reviewCount})</span>
        </div>
      ),
    },
    {
      key: 'hoursOpen',
      header: 'Hours',
      render: (court) => (
        <span className="text-sm text-muted">{court.hoursOpen}</span>
      ),
    },
    {
      key: 'amenities',
      header: 'Amenities',
      render: (court) => (
        <div className="flex flex-wrap gap-1">
          {(court.amenities as string[]).slice(0, 3).map(a => (
            <Badge key={a} variant="default">{a}</Badge>
          ))}
          {(court.amenities as string[]).length > 3 && (
            <Badge variant="default">+{(court.amenities as string[]).length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (court) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(court as Court); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(court as Court); }}
            className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Courts</h1>
          <p className="text-sm text-muted">{courts.length} registered courts</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Add Court
        </Button>
      </div>

      <DataTable
        data={courts as (Court & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search courts..."
        searchKeys={['name', 'location', 'address']}
        isLoading={isLoading}
        emptyMessage="No courts found"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourt ? 'Edit Court' : 'Add New Court'}
        size="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

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

          <FormField label="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                      : 'border-border-light text-muted hover:border-gray-300 dark:border-border-dark dark:hover:border-gray-600'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingCourt ? 'Update Court' : 'Create Court'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Court"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
