'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { TournamentMatch } from '@/types/models';

interface MatchRowProps {
  match: TournamentMatch;
  onSaveScore: (matchId: string, scoreA: number, scoreB: number) => void;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success' as const;
    case 'in_progress': return 'warning' as const;
    case 'scheduled': return 'default' as const;
    default: return 'default' as const;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    case 'scheduled': return 'Scheduled';
    default: return status;
  }
};

export function MatchRow({ match, onSaveScore }: MatchRowProps) {
  const [editing, setEditing] = useState(false);
  const [scoreA, setScoreA] = useState(match.scoreA ?? 0);
  const [scoreB, setScoreB] = useState(match.scoreB ?? 0);

  function handleSave() {
    onSaveScore(match.id, scoreA, scoreB);
    setEditing(false);
  }

  function handleCancel() {
    setScoreA(match.scoreA ?? 0);
    setScoreB(match.scoreB ?? 0);
    setEditing(false);
  }

  return (
    <div className={cn(
      'flex items-center gap-4 rounded-lg px-4 py-3 transition-colors duration-150',
      editing ? 'bg-brand-orange/5 dark:bg-brand-orange/10' : 'hover:bg-[var(--table-row-hover)]',
    )}>
      {/* Match number */}
      <span className="w-8 text-xs font-medium text-muted">#{match.matchNumber}</span>

      {/* Team A */}
      <div className="flex-1 text-right">
        <span className={cn(
          'text-sm font-medium',
          match.status === 'completed' && match.winnerId === match.teamA.id
            ? 'text-[var(--foreground)]'
            : 'text-muted',
        )}>
          {match.teamA.name}
        </span>
      </div>

      {/* Score / Entry */}
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <input
              type="number"
              min={0}
              value={scoreA}
              onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
              className="h-9 w-14 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-center text-sm font-bold text-[var(--foreground)] outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
            <span className="text-xs text-muted">vs</span>
            <input
              type="number"
              min={0}
              value={scoreB}
              onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
              className="h-9 w-14 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-center text-sm font-bold text-[var(--foreground)] outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-bold transition-colors hover:bg-gray-100 dark:bg-dark-tertiary dark:hover:bg-dark-secondary"
            title="Click to edit score"
          >
            <span className={match.status === 'completed' && match.winnerId === match.teamA.id ? 'text-green-600 dark:text-green-400' : 'text-[var(--foreground)]'}>
              {match.scoreA ?? '-'}
            </span>
            <span className="text-muted">:</span>
            <span className={match.status === 'completed' && match.winnerId === match.teamB.id ? 'text-green-600 dark:text-green-400' : 'text-[var(--foreground)]'}>
              {match.scoreB ?? '-'}
            </span>
          </button>
        )}
      </div>

      {/* Team B */}
      <div className="flex-1">
        <span className={cn(
          'text-sm font-medium',
          match.status === 'completed' && match.winnerId === match.teamB.id
            ? 'text-[var(--foreground)]'
            : 'text-muted',
        )}>
          {match.teamB.name}
        </span>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button onClick={handleSave} className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20" title="Save">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" title="Cancel">
              <X size={16} />
            </button>
          </>
        ) : (
          <Badge variant={statusVariant(match.status)}>
            {statusLabel(match.status)}
          </Badge>
        )}
      </div>
    </div>
  );
}
