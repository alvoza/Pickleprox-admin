'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import type { TournamentPlayer } from '@/types/models';

const skillBadgeVariant = (level: string) => {
  switch (level) {
    case 'pro': return 'error' as const;
    case 'advanced': return 'orange' as const;
    case 'intermediate': return 'warning' as const;
    case 'beginner': return 'info' as const;
    default: return 'default' as const;
  }
};

export default function TournamentPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<TournamentPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<TournamentPlayer | null>(null);
  const [error, setError] = useState('');

  const loadPlayers = useCallback(async () => {
    const result = await api.admin.getTournamentPlayers();
    if (result.data) setPlayers(result.data.players);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteTournamentPlayer(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      await loadPlayers();
    }
  }

  const columns: Column<TournamentPlayer & Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (player) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-semibold text-brand-orange">
            {player.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{player.name}</p>
            {player.email && <p className="text-xs text-muted">{player.email}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (player) => (
        <span className="text-sm text-muted">{player.email || '—'}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (player) => (
        <span className="text-sm text-muted">{player.phone || '—'}</span>
      ),
    },
    {
      key: 'duprRating',
      header: 'DUPR Rating',
      sortable: true,
      render: (player) => (
        <span className="text-sm font-medium">{player.duprRating?.toFixed(2) ?? '—'}</span>
      ),
    },
    {
      key: 'skillLevel',
      header: 'Skill Level',
      sortable: true,
      render: (player) => player.skillLevel ? (
        <Badge variant={skillBadgeVariant(player.skillLevel)}>
          {capitalize(player.skillLevel)}
        </Badge>
      ) : (
        <span className="text-sm text-muted">—</span>
      ),
    },
    {
      key: 'tournamentsPlayed',
      header: 'Tournaments Played',
      sortable: true,
      render: (player) => <span>{player.tournamentsPlayed}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (player) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/tournament-players/${player.id}`); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(player as TournamentPlayer); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filteredPlayers = filter === 'all'
    ? players
    : players.filter(p => p.skillLevel === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Players"
        subtitle={`${players.length} total players`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Players' },
        ]}
        actions={
          <Button onClick={() => router.push('/tournament-players/new')}>
            <Plus size={16} className="mr-1.5" />
            Add Player
          </Button>
        }
      />

      <DataTable
        data={filteredPlayers as (TournamentPlayer & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search players..."
        searchKeys={['name', 'email']}
        isLoading={isLoading}
        emptyMessage="No players found"
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Pro', value: 'pro' },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        onRowClick={(player) => router.push(`/tournament-players/${player.id}`)}
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
        title="Delete Player"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.name}</strong>? This will permanently remove the player record. This action cannot be undone.
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
