'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { MapPin, Star, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Court } from '@/types/models';

export default function CourtsPage() {
  const router = useRouter();
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Court | null>(null);
  const [error, setError] = useState('');

  const loadCourts = useCallback(async () => {
    const result = await api.admin.getCourts();
    if (result.data) setCourts(result.data.courts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

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
            onClick={(e) => { e.stopPropagation(); router.push(`/courts/${court.id}`); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(court as Court); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
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
      <PageHeader
        title="Courts"
        subtitle={`${courts.length} registered courts`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Courts' },
        ]}
        actions={
          <Button onClick={() => router.push('/courts/new')}>
            <Plus size={16} />
            Add Court
          </Button>
        }
      />

      <DataTable
        data={courts as (Court & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search courts..."
        searchKeys={['name', 'location', 'address']}
        isLoading={isLoading}
        emptyMessage="No courts found"
        onRowClick={(court) => router.push(`/courts/${court.id}`)}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

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
