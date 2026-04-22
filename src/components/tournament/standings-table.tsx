'use client';

import { cn } from '@/lib/utils';
import type { TournamentStanding } from '@/types/models';

interface StandingsTableProps {
  standings: TournamentStanding[];
  qualifyCount?: number;
}

export function StandingsTable({ standings, qualifyCount }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-[var(--table-header-bg)] dark:border-border-dark">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted w-12">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Team</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-12">P</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-12">W</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-12">L</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-16">Pts+</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-16">Pts-</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-16">Diff</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted w-16">Win%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-border-dark">
          {standings.map((s) => {
            const qualifies = qualifyCount ? s.position <= qualifyCount : false;
            return (
              <tr
                key={s.teamId}
                className={cn(
                  'transition-colors duration-150',
                  qualifies && 'bg-green-50/50 dark:bg-green-900/10',
                )}
              >
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    s.position <= 3
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'text-muted',
                  )}>
                    {s.position}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{s.teamName}</td>
                <td className="px-4 py-3 text-center text-muted">{s.played}</td>
                <td className="px-4 py-3 text-center font-medium text-green-600 dark:text-green-400">{s.won}</td>
                <td className="px-4 py-3 text-center font-medium text-red-500 dark:text-red-400">{s.lost}</td>
                <td className="px-4 py-3 text-center text-muted">{s.pointsFor}</td>
                <td className="px-4 py-3 text-center text-muted">{s.pointsAgainst}</td>
                <td className={cn(
                  'px-4 py-3 text-center font-medium',
                  s.pointDiff > 0 ? 'text-green-600 dark:text-green-400' : s.pointDiff < 0 ? 'text-red-500 dark:text-red-400' : 'text-muted',
                )}>
                  {s.pointDiff > 0 ? '+' : ''}{s.pointDiff}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-[var(--foreground)]">
                  {(s.winPct * 100).toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {qualifyCount && (
        <div className="border-t border-gray-100 px-4 py-2 dark:border-border-dark">
          <p className="text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1.5" />
            Top {qualifyCount} qualify for playoffs
          </p>
        </div>
      )}
    </div>
  );
}
