'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
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

const columns: Column<Tournament & Record<string, unknown>>[] = [
  {
    key: 'title',
    header: 'Tournament',
    sortable: true,
    render: (t) => (
      <div>
        <p className="font-medium">{t.title}</p>
        {t.description && (
          <p className="text-xs text-muted line-clamp-1">{t.description}</p>
        )}
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (t) => (
      <Badge variant={typeBadgeVariant(t.type)}>
        {capitalize(t.type)}
      </Badge>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
    render: (t) => (
      <div>
        <p className="text-sm">{formatDate(t.date)}</p>
        {t.endDate && <p className="text-xs text-muted">to {formatDate(t.endDate)}</p>}
      </div>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    render: (t) => (
      <span className="text-sm text-muted">{t.venue || t.location}</span>
    ),
  },
  {
    key: 'prizePool',
    header: 'Prize Pool',
    sortable: true,
    render: (t) => (
      <span className="text-sm font-medium">
        {t.prizePool ? formatCurrency(t.prizePool) : '-'}
      </span>
    ),
  },
  {
    key: 'currentParticipants',
    header: 'Players',
    render: (t) => (
      <span className="text-sm">{t.currentParticipants}/{t.maxParticipants}</span>
    ),
  },
  {
    key: 'registrationOpen',
    header: 'Registration',
    render: (t) => (
      <Badge variant={t.registrationOpen ? 'success' : 'default'}>
        {t.registrationOpen ? 'Open' : 'Closed'}
      </Badge>
    ),
  },
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getTournaments();
      if (result.data) setTournaments(result.data.tournaments);
      setIsLoading(false);
    }
    load();
  }, []);

  const filtered = filter === 'all'
    ? tournaments
    : tournaments.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tournaments</h1>
        <p className="text-sm text-muted">{tournaments.length} total tournaments</p>
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
    </div>
  );
}
