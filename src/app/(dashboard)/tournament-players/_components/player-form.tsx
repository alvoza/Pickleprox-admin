'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';
import type { TournamentPlayer, SkillLevel } from '@/types/models';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];

interface PlayerFormData {
  name: string;
  email: string;
  phone: string;
  duprRating: string;
  skillLevel: SkillLevel | '';
  notes: string;
}

interface PlayerFormProps {
  player?: TournamentPlayer;
}

export function PlayerForm({ player }: PlayerFormProps) {
  const router = useRouter();
  const isEditing = !!player;

  const [form, setForm] = useState<PlayerFormData>({
    name: player?.name || '',
    email: player?.email || '',
    phone: player?.phone || '',
    duprRating: player?.duprRating?.toString() || '',
    skillLevel: player?.skillLevel || '',
    notes: player?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');

    const payload: Partial<TournamentPlayer> = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      duprRating: form.duprRating ? parseFloat(form.duprRating) : undefined,
      skillLevel: form.skillLevel || undefined,
      notes: form.notes.trim() || undefined,
    };

    const result = isEditing
      ? await api.admin.updateTournamentPlayer(player.id, payload)
      : await api.admin.createTournamentPlayer(payload);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push('/tournament-players');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Player' : 'New Player'}
        subtitle={isEditing ? player.email || player.name : 'Add a new player to the CRM'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Players', href: '/tournament-players' },
          { label: isEditing ? 'Edit' : 'New' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/tournament-players')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Player' : 'Create Player'}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <FormCard title="Personal Information" description="Player contact details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name" className="sm:col-span-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className={inputClasses}
              required
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className={inputClasses}
            />
          </FormField>
          <FormField label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className={inputClasses}
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Pickleball Profile" description="Skill rating and level">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="DUPR Rating">
            <input
              type="number"
              step="0.01"
              min="1"
              max="8"
              value={form.duprRating}
              onChange={(e) => setForm({ ...form, duprRating: e.target.value })}
              placeholder="e.g. 3.50"
              className={inputClasses}
            />
          </FormField>
          <FormField label="Skill Level">
            <select
              value={form.skillLevel}
              onChange={(e) => setForm({ ...form, skillLevel: e.target.value as SkillLevel })}
              className={inputClasses}
            >
              <option value="">Select level</option>
              {SKILL_LEVELS.map(s => (
                <option key={s} value={s}>{capitalize(s)}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any additional notes about this player..."
            className={textareaClasses}
            rows={4}
          />
        </FormField>
      </FormCard>

      {isEditing && (
        <FormCard title="App Connection" description="Link to mobile app account">
          <div className="flex items-center gap-3">
            {player.userId ? (
              <>
                <Badge variant="orange">Connected</Badge>
                <span className="text-sm text-muted">
                  Connected to app user <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-dark-tertiary">{player.userId}</code>
                </span>
              </>
            ) : (
              <>
                <Badge variant="default">Not Connected</Badge>
                <span className="text-sm text-muted">This player is not linked to an app user account</span>
              </>
            )}
          </div>
        </FormCard>
      )}

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/tournament-players')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Update Player' : 'Create Player'}
        </Button>
      </div>
    </div>
  );
}
