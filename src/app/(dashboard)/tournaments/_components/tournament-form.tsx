'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { capitalize } from '@/lib/utils';
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
  title: '', description: '', type: 'open', imageUrl: '', date: '', endDate: '',
  startTime: '', location: '', venue: '', address: '', prizePool: '', entryFee: '',
  maxParticipants: '32', format: 'round_robin', matchType: 'doubles',
  skillLevelRequired: 'all', registrationOpen: true, groupId: '',
};

interface TournamentFormProps {
  tournament?: Tournament;
}

export function TournamentForm({ tournament }: TournamentFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isGroupAdmin = user?.isGroupAdmin ?? false;
  const managedGroupIds = user?.managedGroupIds || [];
  const isEditing = !!tournament;

  const [form, setForm] = useState<TournamentFormData>(
    tournament
      ? {
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
          groupId: (tournament as unknown as Record<string, unknown>).groupId as string || '',
        }
      : {
          ...emptyForm,
          groupId: isGroupAdmin && managedGroupIds.length > 0 ? managedGroupIds[0] : '',
        }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    if (form.groupId) (payload as Record<string, unknown>).groupId = form.groupId;

    const result = isEditing
      ? await api.admin.updateTournament(tournament.id, payload)
      : await api.admin.createTournament(payload);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push('/tournaments');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Tournament' : 'Create Tournament'}
        subtitle={isEditing ? `Editing ${tournament.title}` : 'Set up a new tournament'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tournaments', href: '/tournaments' },
          { label: isEditing ? 'Edit' : 'New' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/tournaments')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Tournament' : 'Create Tournament'}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      <FormCard title="Basic Information" description="Tournament title and description">
        <FormField label="Title">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClasses} placeholder="e.g. Spring Pro Series 2026" />
        </FormField>
        <FormField label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClasses} rows={2} placeholder="Tournament description..." />
        </FormField>
        <ImageUpload label="Tournament Image" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} category="tournaments" aspectHint="Wide banner, 1200x600 recommended" />
      </FormCard>

      <FormCard title="Tournament Settings" description="Format, type, and match configuration">
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
      </FormCard>

      <FormCard title="Schedule" description="Start and end dates">
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
      </FormCard>

      <FormCard title="Location" description="Venue and address details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Location">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClasses} placeholder="City, State" />
          </FormField>
          <FormField label="Venue">
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClasses} placeholder="Court or venue name" />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Registration & Pricing" description="Player limits, fees, and prize pool">
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
              <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange" />
              <span className="text-sm text-[var(--foreground)]">Registration open</span>
            </label>
          </FormField>
        </div>
      </FormCard>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/tournaments')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Update Tournament' : 'Create Tournament'}
        </Button>
      </div>
    </div>
  );
}
