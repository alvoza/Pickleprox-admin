'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge, getStatusBadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { Trash2, Eye, Gamepad2, Clock, Pencil, StopCircle } from 'lucide-react';
import { formatDate, capitalize } from '@/lib/utils';
import type { Game, GameStatus } from '@/types/models';

interface AdminGame extends Game {
  itemType: 'game' | 'session';
  createdBy: { id: string; name: string };
  sessionType?: string;
  duration?: number;
}

const ENDABLE_STATUSES: GameStatus[] = ['open', 'full', 'in_progress', 'created'];

export default function GamesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isGroupAdmin = user?.isGroupAdmin ?? false;
  const managedGroupIds = user?.managedGroupIds || [];

  const [games, setGames] = useState<AdminGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<AdminGame | null>(null);
  const [endConfirm, setEndConfirm] = useState<AdminGame | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadGames = useCallback(async () => {
    const groupId = isGroupAdmin && !isSuperAdmin && managedGroupIds.length > 0
      ? managedGroupIds[0]
      : undefined;
    const result = await api.admin.getGames(groupId);
    if (result.data) setGames(result.data.games as AdminGame[]);
    setIsLoading(false);
  }, [isSuperAdmin, isGroupAdmin, managedGroupIds]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteGame(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      setError('');
      await loadGames();
    }
  }

  async function handleEndGame() {
    if (!endConfirm) return;
    setSaving(true);
    setError('');
    const result = await api.admin.endGame(endConfirm.id);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      setEndConfirm(null);
      return;
    }
    setEndConfirm(null);
    await loadGames();
  }

  const columns: Column<AdminGame & Record<string, unknown>>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (game) => (
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            (game as AdminGame).itemType === 'session'
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
              : 'bg-brand-orange/10 text-brand-orange'
          }`}>
            {(game as AdminGame).itemType === 'session' ? <Clock size={14} /> : <Gamepad2 size={14} />}
          </div>
          <div>
            <p className="font-medium">{game.title}</p>
            {game.description && <p className="text-xs text-muted line-clamp-1">{game.description}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'itemType',
      header: 'Kind',
      sortable: true,
      render: (game) => (
        <Badge variant={(game as AdminGame).itemType === 'session' ? 'default' : 'orange'}>
          {capitalize((game as AdminGame).itemType)}
        </Badge>
      ),
    },
    {
      key: 'gameType',
      header: 'Type',
      sortable: true,
      render: (game) => <Badge variant="info">{capitalize(game.gameType)}</Badge>,
    },
    {
      key: 'createdBy',
      header: 'Created By',
      render: (game) => {
        const creator = (game as AdminGame).createdBy;
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange/10 text-[10px] font-semibold text-brand-orange">
              {creator?.name?.[0] || '?'}
            </div>
            <span className="text-sm">{creator?.name || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (game) => (
        <div>
          <p className="text-sm">{formatDate(game.date)}</p>
          {game.startTime && <p className="text-xs text-muted">{game.startTime}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (game) => (
        <Badge variant={getStatusBadgeVariant(game.status)}>{capitalize(game.status)}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-36',
      render: (game) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/games/${game.id}`); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="View / Edit"
          >
            <Eye size={15} />
          </button>
          {isSuperAdmin && ENDABLE_STATUSES.includes((game as AdminGame).status) && (
            <button
              onClick={(e) => { e.stopPropagation(); setEndConfirm(game as AdminGame); }}
              className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              title="End Game"
            >
              <StopCircle size={15} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(game as AdminGame); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  let filteredGames = games;
  if (typeFilter !== 'all') filteredGames = filteredGames.filter(g => g.itemType === typeFilter);
  if (filter !== 'all') filteredGames = filteredGames.filter(g => g.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Games & Sessions"
        subtitle={`${games.length} total — ${games.filter(g => g.itemType === 'game').length} games, ${games.filter(g => g.itemType === 'session').length} sessions`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Games & Sessions' },
        ]}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Type filter pills */}
      <div className="flex gap-2">
        {[
          { label: 'All', value: 'all' },
          { label: 'Games', value: 'game' },
          { label: 'Sessions', value: 'session' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              typeFilter === tab.value
                ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                : 'border-gray-200 bg-white text-muted hover:border-gray-300 hover:text-[var(--foreground)] dark:border-border-dark dark:bg-dark-tertiary dark:hover:bg-dark-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        data={filteredGames as (AdminGame & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search games & sessions..."
        searchKeys={['title', 'courtName']}
        isLoading={isLoading}
        emptyMessage="No games or sessions found"
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Open', value: 'open' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Created', value: 'created' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        onRowClick={(game) => router.push(`/games/${game.id}`)}
      />

      {/* End Game Confirmation */}
      <Modal isOpen={!!endConfirm} onClose={() => !saving && setEndConfirm(null)} title="End Game" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to end <strong className="text-[var(--foreground)]">{endConfirm?.title}</strong>? This will mark the game as completed and notify all participants.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEndConfirm(null)} disabled={saving}>Cancel</Button>
            <Button variant="danger" onClick={handleEndGame} disabled={saving}>{saving ? 'Ending...' : 'End Game'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title={`Delete ${deleteConfirm?.itemType === 'session' ? 'Session' : 'Game'}`} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
