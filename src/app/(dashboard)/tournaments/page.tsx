'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Plus, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
import { formatDate, formatCurrency, capitalize } from '@/lib/utils';
import type { Tournament } from '@/types/models';

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case 'pro_series': return 'error' as const;
    case 'league': return 'info' as const;
    case 'social': return 'success' as const;
    case 'open': return 'orange' as const;
    default: return 'default' as const;
  }
};

export default function TournamentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isGroupAdmin = user?.isGroupAdmin ?? false;
  const managedGroupIds = user?.managedGroupIds || [];

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<Tournament | null>(null);
  const [error, setError] = useState('');

  const loadTournaments = useCallback(async () => {
    const result = await api.admin.getTournaments();
    if (result.data) setTournaments(result.data.tournaments);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadTournaments(); }, [loadTournaments]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteTournament(deleteConfirm.id);
    if (result.error) setError(result.error);
    else { setDeleteConfirm(null); await loadTournaments(); }
  }

  const columns: Column<Tournament & Record<string, unknown>>[] = [
    {
      key: 'title', header: 'Tournament', sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          {t.imageUrl ? (
            <img src={t.imageUrl as string} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"><Trophy size={18} /></div>
          )}
          <div>
            <p className="font-medium">{t.title}</p>
            {t.description && <p className="text-xs text-muted line-clamp-1">{t.description as string}</p>}
          </div>
        </div>
      ),
    },
    { key: 'type', header: 'Type', sortable: true, render: (t) => <Badge variant={typeBadgeVariant(t.type as string)}>{capitalize(String(t.type).replace('_', ' '))}</Badge> },
    { key: 'date', header: 'Date', sortable: true, render: (t) => (<div><p className="text-sm">{formatDate(t.date as string)}</p>{t.endDate && <p className="text-xs text-muted">to {formatDate(t.endDate as string)}</p>}</div>) },
    { key: 'location', header: 'Location', render: (t) => <span className="text-sm text-muted">{(t.venue || t.location) as string || '-'}</span> },
    { key: 'prizePool', header: 'Prize', sortable: true, render: (t) => <span className="text-sm font-medium">{t.prizePool ? formatCurrency(t.prizePool as number) : '-'}</span> },
    { key: 'registrationOpen', header: 'Status', render: (t) => <Badge variant={t.registrationOpen ? 'success' : 'default'}>{t.registrationOpen ? 'Open' : 'Closed'}</Badge> },
    {
      key: 'actions', header: '', className: 'w-32',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); router.push(`/tournaments/${t.id}/manage`); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary" title="Manage"><LayoutDashboard size={15} /></button>
          <button onClick={(e) => { e.stopPropagation(); router.push(`/tournaments/${t.id}`); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary" title="Edit"><Pencil size={15} /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t as unknown as Tournament); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Delete"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tournaments"
        subtitle={`${tournaments.length} total tournaments`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Tournaments' }]}
        actions={<Button onClick={() => router.push('/tournaments/new')}><Plus size={16} />Create Tournament</Button>}
      />

      <DataTable
        data={filtered as (Tournament & Record<string, unknown>)[]}
        columns={columns}
        searchable searchPlaceholder="Search tournaments..." searchKeys={['title', 'location']}
        isLoading={isLoading} emptyMessage="No tournaments found"
        filterTabs={[{ label: 'All', value: 'all' }, { label: 'Pro Series', value: 'pro_series' }, { label: 'Social', value: 'social' }, { label: 'League', value: 'league' }, { label: 'Open', value: 'open' }]}
        activeFilter={filter} onFilterChange={setFilter}
        onRowClick={(t) => router.push(`/tournaments/${t.id}/manage`)}
      />

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Tournament" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.title}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
