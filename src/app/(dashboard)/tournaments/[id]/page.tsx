'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TournamentForm } from '../_components/tournament-form';
import type { Tournament } from '@/types/models';

export default function EditTournamentPage() {
  const params = useParams();
  const id = params.id as string;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getTournaments();
      if (result.data) {
        const found = result.data.tournaments.find((t: Tournament) => t.id === id);
        if (found) setTournament(found);
        else setError('Tournament not found');
      } else {
        setError(result.error || 'Failed to load');
      }
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="flex items-center justify-center py-20"><p className="text-sm text-muted">{error}</p></div>;
  if (!tournament) return null;
  return <TournamentForm tournament={tournament} />;
}
