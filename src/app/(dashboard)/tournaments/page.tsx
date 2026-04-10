'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDate, formatCurrency, capitalize } from '@/lib/utils';
import type { Tournament } from '@/types/models';

const TOURNAMENT_TYPES = ['pro_series', 'social', 'league', 'open'] as const;
const FORMATS = ['single_elimination', 'double_elimination', 'round_robin', 'swiss'] as const;
const MATCH_TYPES = ['singles', 'doubles'] as const;
const SKILL_LEVELS = ['all', 'beginner', 'intermediate', 'advanced', 'pro'] as const;

interface TournamentFormData {
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  date: string;
  endDate: string;
  startTime: string;
  location: string;
  venue: string;
  address: string;
  prizePool: string;
  entryFee: string;
  maxParticipants: string;
  format: string;
  matchType: string;
  skillLevelRequired: string;
  registrationOpen: boolean;
  groupId: string;
}

const emptyForm: TournamentFormData = {
  title: '',
  description: '',
  type: 'open',
  imageUrl: '',
  date: '',
  endDate: '',
  startTime: '',
  location: '',
  venue: '',
  address: '',
  prizePool: '',
  entryFee: '',
  maxParticipants: '32',
  format: 'round_robin',
  matchType: 'doubles',
  skillLevelRequired: 'all',
  registrationOpen: true,
  groupId: '',
};

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
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isGroupAdmin = user?.isGroupAdmin ?? false;
  const managedGroupIds = user?.managedGroupIds || [];

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Tournament | null>(null);
  const [form, setForm] = useState<TournamentFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTournaments = useCallback(async () => {
    // Group admins only see their group's tournaments
    const groupId = isGroupAdmin && !isSuperAdmin && managedGroupIds.length > 0
      ? managedGroupIds[0]
      : undefined;
    const result = await api.admin.getTournaments(groupId);
    if (result.data) setTournaments(result.data.tournaments);
    setIsLoading(false);
  }, [isSuperAdmin, isGroupAdmin, managedGroupIds]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  function openCreateModal() {
    setEditingTournament(null);
    setForm({
      ...emptyForm,
      groupId: isGroupAdmin && managedGroupIds.length > 0 ? managedGroupIds[0] : '',
    });
    setError('');
    setModalOpen(true);
  }

  function openEditModal(tournament: Tournament) {
    setEditingTournament(tournament);
    setForm({
      title: tournament.title,
      description: tournament.description || '',
      type: tournament.type,
      imageUrl: tournament.imageUrl || '',
      date: tournament.date,
      endDate: tournament.endDate || '',
      startTime: tournament.startTime || '',
      location: tournament.location || '',
      venue: tournament.venue || '',
      address: tournament.address || '',
      prizePool: tournament.prizePool ? String(tournament.prizePool) : '',
      entryFee: tournament.entryFee ? String(tournament.entryFee) : '',
      maxParticipants: String(tournament.maxParticipants),
      format: tournament.format,
      matchType: tournament.matchType || 'doubles',
      skillLevelRequired: tournament.skillLevelRequired || 'all',
      registrationOpen: tournament.registrationOpen,
      groupId: (tournament as Record<string, unknown>).groupId as string || '',
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.date) {
      setError('Title and date are required');
      return;
    }
    setSaving(true);
    setError('');

    const payload: Partial<Tournament> & { groupId?: string } = {
      title: form.title,
      description: form.description || undefined,
      type: form.type as Tournament['type'],
      imageUrl: form.imageUrl || undefined,
      date: form.date,
      endDate: form.endDate || undefined,
      startTime: form.startTime || undefined,
      location: form.location || undefined,
      venue: form.venue || undefined,
      address: form.address || undefined,
      prizePool: form.prizePool ? Number(form.prizePool) : undefined,
      entryFee: form.entryFee ? Number(form.entryFee) : undefined,
      maxParticipants: Number(form.maxParticipants) || 32,
      format: form.format as Tournament['format'],
      matchType: form.matchType as Tournament['matchType'],
      skillLevelRequired: form.skillLevelRequired as Tournament['skillLevelRequired'],
      registrationOpen: form.registrationOpen,
    };

    if (form.groupId) {
      (payload as Record<string, unknown>).groupId = form.groupId;
    }

    if (editingTournament) {
      const result = await api.admin.updateTournament(editingTournament.id, payload);
      if (result.error) { setError(result.error); setSaving(false); return; }
    } else {
      const result = await api.admin.createTournament(payload);
      if (result.error) { setError(result.error); setSaving(false); return; }
    }

    setSaving(false);
    setModalOpen(false);
    await loadTournaments();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteTournament(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      await loadTournaments();
    }
  }

  const columns: Column<Tournament & Record<string, unknown>>[] = [
    {
      key: 'title',
      header: 'Tournament',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          {t.imageUrl ? (
            <img src={t.imageUrl as string} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
              <Trophy size={18} />
            </div>
          )}
          <div>
            <p className="font-medium">{t.title}</p>
            {t.description && <p className="text-xs text-muted line-clamp-1">{t.description as string}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (t) => (
        <Badge variant={typeBadgeVariant(t.type as string)}>
          {capitalize(String(t.type).replace('_', ' '))}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (t) => (
        <div>
          <p className="text-sm">{formatDate(t.date as string)}</p>
          {t.endDate && <p className="text-xs text-muted">to {formatDate(t.endDate as string)}</p>}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (t) => (
        <span className="text-sm text-muted">{(t.venue || t.location) as string || '-'}</span>
      ),
    },
    {
      key: 'prizePool',
      header: 'Prize',
      sortable: true,
      render: (t) => (
        <span className="text-sm font-medium">
          {t.prizePool ? formatCurrency(t.prizePool as number) : '-'}
        </span>
      ),
    },
    {
      key: 'registrationOpen',
      header: 'Status',
      render: (t) => (
        <Badge variant={t.registrationOpen ? 'success' : 'default'}>
          {t.registrationOpen ? 'Open' : 'Closed'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(t as unknown as Tournament); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(t as unknown as Tournament); }}
            className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filtered = filter === 'all'
    ? tournaments
    : tournaments.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Tournaments</h1>
          <p className="text-sm text-muted">{tournaments.length} total tournaments</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Create Tournament
        </Button>
      </div>

      <DataTable
        data={filtered as (Tournament & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search tournaments..."
        searchKeys={['title', 'location']}
        isLoading={isLoading}
        emptyMessage="No tournaments found"
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Pro Series', value: 'pro_series' },
          { label: 'Social', value: 'social' },
          { label: 'League', value: 'league' },
          { label: 'Open', value: 'open' },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTournament ? 'Edit Tournament' : 'Create Tournament'}
        size="lg"
      >
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <FormField label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClasses}
              placeholder="e.g. Spring Pro Series 2026"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClasses}
              rows={2}
              placeholder="Tournament description..."
            />
          </FormField>

          <ImageUpload
            label="Tournament Image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            category="tournaments"
            aspectHint="Wide banner, 1200x600 recommended"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClasses}>
                {TOURNAMENT_TYPES.map(t => <option key={t} value={t}>{capitalize(t.replace('_', ' '))}</option>)}
              </select>
            </FormField>
            <FormField label="Format">
              <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={inputClasses}>
                {FORMATS.map(f => <option key={f} value={f}>{capitalize(f.replace(/_/g, ' '))}</option>)}
              </select>
            </FormField>
            <FormField label="Match Type">
              <select value={form.matchType} onChange={(e) => setForm({ ...form, matchType: e.target.value })} className={inputClasses}>
                {MATCH_TYPES.map(m => <option key={m} value={m}>{capitalize(m)}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Start Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClasses} />
            </FormField>
            <FormField label="End Date">
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClasses} />
            </FormField>
            <FormField label="Start Time">
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className={inputClasses} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Location">
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClasses} placeholder="City, State" />
            </FormField>
            <FormField label="Venue">
              <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClasses} placeholder="Court or venue name" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Prize Pool ($)">
              <input type="number" value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: e.target.value })} className={inputClasses} placeholder="0" />
            </FormField>
            <FormField label="Entry Fee ($)">
              <input type="number" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} className={inputClasses} placeholder="0" />
            </FormField>
            <FormField label="Max Players">
              <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} className={inputClasses} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Skill Level">
              <select value={form.skillLevelRequired} onChange={(e) => setForm({ ...form, skillLevelRequired: e.target.value })} className={inputClasses}>
                {SKILL_LEVELS.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
              </select>
            </FormField>
            <FormField label="Registration">
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.registrationOpen}
                  onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                />
                <span className="text-sm text-[var(--foreground)]">Registration open</span>
              </label>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-light pt-4 dark:border-border-dark">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingTournament ? 'Update Tournament' : 'Create Tournament'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Tournament"
        size="sm"
      >
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
