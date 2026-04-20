'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Badge, getStatusBadgeVariant } from '@/components/ui/badge';
import { capitalize, formatDate } from '@/lib/utils';
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

interface GameFormProps {
  game: AdminGame;
  isSuperAdmin: boolean;
}

export function GameForm({ game, isSuperAdmin }: GameFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(game.title);
  const [description, setDescription] = useState(game.description || '');
  const [date, setDate] = useState(game.date);
  const [startTime, setStartTime] = useState(game.startTime || '');
  const [endTime, setEndTime] = useState(game.endTime || '');
  const [maxParticipants, setMaxParticipants] = useState(game.maxParticipants);
  const [gameType, setGameType] = useState<GameType>(game.gameType);
  const [skillLevel, setSkillLevel] = useState<'all' | SkillLevel>(game.skillLevel || 'all');
  const [status, setStatus] = useState<GameStatus>(game.status);
  const [courtName, setCourtName] = useState(game.courtName || '');
  const [address, setAddress] = useState(game.address || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    setError('');

    const result = await api.admin.updateGame(game.id, {
      title,
      description: description || undefined,
      date,
      startTime,
      endTime: endTime || undefined,
      maxParticipants,
      gameType,
      skillLevel,
      status,
      courtName: courtName || undefined,
      address: address || undefined,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push('/games');
  }

  async function handleEndGame() {
    setSaving(true);
    setError('');
    const result = await api.admin.endGame(game.id);
    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push('/games');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={game.itemType === 'session' ? 'Session Details' : 'Game Details'}
        subtitle={game.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Games & Sessions', href: '/games' },
          { label: 'Edit' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {isSuperAdmin && ENDABLE_STATUSES.includes(game.status) && (
              <Button variant="danger" onClick={handleEndGame} disabled={saving}>
                End Game
              </Button>
            )}
            <Button variant="secondary" onClick={() => router.push('/games')}>
              Cancel
            </Button>
            {isSuperAdmin && (
              <Button onClick={handleSave} disabled={!title.trim() || saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Game info summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[var(--card-bg)] p-5 shadow-[var(--card-shadow)] dark:border dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Status:</span>
          <Badge variant={getStatusBadgeVariant(game.status)}>{capitalize(game.status)}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Kind:</span>
          <Badge variant={game.itemType === 'session' ? 'default' : 'orange'}>{capitalize(game.itemType)}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Created by:</span>
          <span className="text-sm font-medium text-[var(--foreground)]">{game.createdBy?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Players:</span>
          <span className="text-sm font-medium text-[var(--foreground)]">{game.participantIds?.length || 0}/{game.maxParticipants}</span>
        </div>
      </div>

      {/* Participants */}
      {game.participants && game.participants.length > 0 && (
        <FormCard title="Participants" description={`${game.participants.length} players`}>
          <div className="flex flex-wrap gap-2">
            {game.participants.map(p => (
              <div key={p.id} className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-border-dark">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange/10 text-[10px] font-semibold text-brand-orange">
                  {p.name?.[0]}
                </div>
                {p.name}
              </div>
            ))}
          </div>
        </FormCard>
      )}

      <FormCard title="Basic Information" description="Game title and description">
        <FormField label="Game ID">
          <input
            type="text"
            value={game.id}
            readOnly
            className={`${inputClasses} cursor-default bg-gray-50 text-muted dark:bg-dark-secondary`}
          />
        </FormField>
        <FormField label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            readOnly={!isSuperAdmin}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaClasses}
            rows={2}
            readOnly={!isSuperAdmin}
          />
        </FormField>
      </FormCard>

      <FormCard title="Schedule & Status" description="Date, time, and game status">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} readOnly={!isSuperAdmin} />
          </FormField>
          <FormField label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as GameStatus)} className={inputClasses} disabled={!isSuperAdmin}>
              {GAME_STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
            </select>
          </FormField>
          <FormField label="Start Time">
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClasses} placeholder="e.g. 9:00 AM" readOnly={!isSuperAdmin} />
          </FormField>
          <FormField label="End Time">
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClasses} placeholder="e.g. 11:00 AM" readOnly={!isSuperAdmin} />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Game Settings" description="Type, skill level, and player limits">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Game Type">
            <select value={gameType} onChange={(e) => setGameType(e.target.value as GameType)} className={inputClasses} disabled={!isSuperAdmin}>
              {GAME_TYPES.map(t => <option key={t} value={t}>{capitalize(t)}</option>)}
            </select>
          </FormField>
          <FormField label="Skill Level">
            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value as 'all' | SkillLevel)} className={inputClasses} disabled={!isSuperAdmin}>
              {SKILL_LEVELS.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
            </select>
          </FormField>
          <FormField label="Max Participants">
            <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} className={inputClasses} min={2} max={64} readOnly={!isSuperAdmin} />
          </FormField>
        </div>
      </FormCard>

      <FormCard title="Location" description="Court and address details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Court Name">
            <input type="text" value={courtName} onChange={(e) => setCourtName(e.target.value)} className={inputClasses} placeholder="Court name" readOnly={!isSuperAdmin} />
          </FormField>
          <FormField label="Address">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClasses} placeholder="Address" readOnly={!isSuperAdmin} />
          </FormField>
        </div>
      </FormCard>

      {isSuperAdmin && (
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="secondary" onClick={() => router.push('/games')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
