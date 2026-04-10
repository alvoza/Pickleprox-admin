'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge, getStatusBadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Trash2, Eye, Gamepad2, Clock, Pencil, StopCircle } from 'lucide-react';
import { formatDate, capitalize } from '@/lib/utils';
import type { Game, GameType, GameStatus, SkillLevel } from '@/types/models';

interface AdminGame extends Game {
  itemType: 'game' | 'session';
  createdBy: { id: string; name: string };
  sessionType?: string;
  duration?: number;
}

const GAME_TYPES: GameType[] = ['singles', 'doubles', 'mixed_doubles', 'round_robin', 'open_play'];
const GAME_STATUSES: GameStatus[] = ['open', 'full', 'in_progress', 'completed', 'cancelled', 'created'];
const SKILL_LEVELS: ('all' | SkillLevel)[] = ['all', 'beginner', 'intermediate', 'advanced', 'pro'];

const ENDABLE_STATUSES: GameStatus[] = ['open', 'full', 'in_progress', 'created'];

export default function GamesPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isGroupAdmin = user?.isGroupAdmin ?? false;
  const managedGroupIds = user?.managedGroupIds || [];

  const [games, setGames] = useState<AdminGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<AdminGame | null>(null);
  const [detailGame, setDetailGame] = useState<AdminGame | null>(null);
  const [editGame, setEditGame] = useState<AdminGame | null>(null);
  const [endConfirm, setEndConfirm] = useState<AdminGame | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editMaxParticipants, setEditMaxParticipants] = useState(8);
  const [editGameType, setEditGameType] = useState<GameType>('doubles');
  const [editSkillLevel, setEditSkillLevel] = useState<'all' | SkillLevel>('all');
  const [editStatus, setEditStatus] = useState<GameStatus>('open');
  const [editCourtName, setEditCourtName] = useState('');
  const [editAddress, setEditAddress] = useState('');

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

  function openEditModal(game: AdminGame) {
    setEditGame(game);
    setEditTitle(game.title);
    setEditDescription(game.description || '');
    setEditDate(game.date);
    setEditStartTime(game.startTime || '');
    setEditEndTime(game.endTime || '');
    setEditMaxParticipants(game.maxParticipants);
    setEditGameType(game.gameType);
    setEditSkillLevel(game.skillLevel || 'all');
    setEditStatus(game.status);
    setEditCourtName(game.courtName || '');
    setEditAddress(game.address || '');
    setError('');
  }

  async function handleSaveEdit() {
    if (!editGame || !editTitle.trim()) return;
    setSaving(true);
    setError('');

    const result = await api.admin.updateGame(editGame.id, {
      title: editTitle,
      description: editDescription || undefined,
      date: editDate,
      startTime: editStartTime,
      endTime: editEndTime || undefined,
      maxParticipants: editMaxParticipants,
      gameType: editGameType,
      skillLevel: editSkillLevel,
      status: editStatus,
      courtName: editCourtName || undefined,
      address: editAddress || undefined,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEditGame(null);
    await loadGames();
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

  function getLocationDisplay(game: AdminGame): string {
    if (game.courtName) return game.courtName;
    if (typeof game.location === 'object' && game.location) {
      const loc = game.location as { courtName?: string; address?: string };
      return loc.courtName || loc.address || '';
    }
    if (typeof game.location === 'string') return game.location;
    return '';
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
            {game.description && (
              <p className="text-xs text-muted line-clamp-1">{game.description}</p>
            )}
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
      render: (game) => (
        <Badge variant="info">{capitalize(game.gameType)}</Badge>
      ),
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
        <Badge variant={getStatusBadgeVariant(game.status)}>
          {capitalize(game.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-36',
      render: (game) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDetailGame(game as AdminGame); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          {isSuperAdmin && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); openEditModal(game as AdminGame); }}
                className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
                title="Edit Game"
              >
                <Pencil size={15} />
              </button>
              {ENDABLE_STATUSES.includes((game as AdminGame).status) && (
                <button
                  onClick={(e) => { e.stopPropagation(); setEndConfirm(game as AdminGame); }}
                  className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  title="End Game"
                >
                  <StopCircle size={15} />
                </button>
              )}
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(game as AdminGame); }}
            className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  let filteredGames = games;
  if (typeFilter !== 'all') {
    filteredGames = filteredGames.filter(g => g.itemType === typeFilter);
  }
  if (filter !== 'all') {
    filteredGames = filteredGames.filter(g => g.status === filter);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Games & Sessions</h1>
        <p className="text-sm text-muted">
          {games.length} total — {games.filter(g => g.itemType === 'game').length} games, {games.filter(g => g.itemType === 'session').length} sessions
        </p>
      </div>

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
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              typeFilter === tab.value
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-dark-secondary'
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
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailGame}
        onClose={() => setDetailGame(null)}
        title={detailGame?.itemType === 'session' ? 'Session Details' : 'Game Details'}
        size="lg"
      >
        {detailGame && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted">Title</p>
                <p className="text-sm font-medium">{detailGame.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Kind</p>
                <Badge variant={detailGame.itemType === 'session' ? 'default' : 'orange'}>
                  {capitalize(detailGame.itemType)}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Status</p>
                <Badge variant={getStatusBadgeVariant(detailGame.status)}>
                  {capitalize(detailGame.status)}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Type</p>
                <p className="text-sm">{capitalize(detailGame.gameType)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Date</p>
                <p className="text-sm">{formatDate(detailGame.date)}{detailGame.startTime ? ` at ${detailGame.startTime}` : ''}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Created By</p>
                <p className="text-sm">{detailGame.createdBy?.name || 'Unknown'}</p>
              </div>
              {getLocationDisplay(detailGame) && (
                <div>
                  <p className="text-xs font-medium text-muted">Location</p>
                  <p className="text-sm">{getLocationDisplay(detailGame)}</p>
                </div>
              )}
              {detailGame.itemType === 'game' && (
                <div>
                  <p className="text-xs font-medium text-muted">Players</p>
                  <p className="text-sm">{detailGame.participantIds?.length || 0}/{detailGame.maxParticipants}</p>
                </div>
              )}
              {detailGame.duration && (
                <div>
                  <p className="text-xs font-medium text-muted">Duration</p>
                  <p className="text-sm">{detailGame.duration} min</p>
                </div>
              )}
              {detailGame.skillLevel && (
                <div>
                  <p className="text-xs font-medium text-muted">Skill Level</p>
                  <p className="text-sm">{capitalize(detailGame.skillLevel)}</p>
                </div>
              )}
            </div>
            {detailGame.description && (
              <div>
                <p className="text-xs font-medium text-muted">Description</p>
                <p className="text-sm">{detailGame.description}</p>
              </div>
            )}
            {detailGame.participants && detailGame.participants.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted mb-2">Participants</p>
                <div className="flex flex-wrap gap-2">
                  {detailGame.participants.map(p => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg border border-border-light px-3 py-1.5 text-xs dark:border-border-dark">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange/10 text-[10px] font-semibold text-brand-orange">
                        {p.name?.[0]}
                      </div>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDetailGame(null)}>
                Close
              </Button>
              {isSuperAdmin && (
                <Button onClick={() => { const g = detailGame; setDetailGame(null); openEditModal(g); }}>
                  <Pencil size={14} />
                  Edit
                </Button>
              )}
              {isSuperAdmin && ENDABLE_STATUSES.includes(detailGame.status) && (
                <Button variant="danger" onClick={() => { const g = detailGame; setDetailGame(null); setEndConfirm(g); }}>
                  <StopCircle size={14} />
                  End Game
                </Button>
              )}
              <Button variant="danger" onClick={() => { setDetailGame(null); setDeleteConfirm(detailGame); }}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Game Modal (Super Admin only) */}
      <Modal
        isOpen={!!editGame}
        onClose={() => !saving && setEditGame(null)}
        title="Edit Game"
        size="lg"
      >
        {editGame && (
          <div className="space-y-4">
            <FormField label="Title">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={textareaClasses}
                rows={2}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className={inputClasses}
                />
              </FormField>

              <FormField label="Status">
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as GameStatus)}
                  className={inputClasses}
                >
                  {GAME_STATUSES.map(s => (
                    <option key={s} value={s}>{capitalize(s)}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Start Time">
                <input
                  type="text"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 9:00 AM"
                />
              </FormField>

              <FormField label="End Time">
                <input
                  type="text"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 11:00 AM"
                />
              </FormField>

              <FormField label="Game Type">
                <select
                  value={editGameType}
                  onChange={(e) => setEditGameType(e.target.value as GameType)}
                  className={inputClasses}
                >
                  {GAME_TYPES.map(t => (
                    <option key={t} value={t}>{capitalize(t)}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Skill Level">
                <select
                  value={editSkillLevel}
                  onChange={(e) => setEditSkillLevel(e.target.value as 'all' | SkillLevel)}
                  className={inputClasses}
                >
                  {SKILL_LEVELS.map(s => (
                    <option key={s} value={s}>{capitalize(s)}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Max Participants">
                <input
                  type="number"
                  value={editMaxParticipants}
                  onChange={(e) => setEditMaxParticipants(Number(e.target.value))}
                  className={inputClasses}
                  min={2}
                  max={64}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Court Name">
                <input
                  type="text"
                  value={editCourtName}
                  onChange={(e) => setEditCourtName(e.target.value)}
                  className={inputClasses}
                  placeholder="Court name"
                />
              </FormField>

              <FormField label="Address">
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className={inputClasses}
                  placeholder="Address"
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-3 border-t border-border-light pt-4 dark:border-border-dark">
              <Button variant="secondary" onClick={() => setEditGame(null)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={!editTitle.trim() || saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* End Game Confirmation Modal (Super Admin only) */}
      <Modal
        isOpen={!!endConfirm}
        onClose={() => !saving && setEndConfirm(null)}
        title="End Game"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to end <strong className="text-[var(--foreground)]">{endConfirm?.title}</strong>?
            This will mark the game as completed and notify all participants.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEndConfirm(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleEndGame} disabled={saving}>
              {saving ? 'Ending...' : 'End Game'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={`Delete ${deleteConfirm?.itemType === 'session' ? 'Session' : 'Game'}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.title}</strong>? This will permanently remove all related data. This action cannot be undone.
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
