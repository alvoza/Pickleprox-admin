'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PlayerForm } from '../_components/player-form';
import type { TournamentPlayer } from '@/types/models';

export default function EditPlayerPage() {
  const params = useParams();
  const playerId = params.id as string;
  const [player, setPlayer] = useState<TournamentPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getTournamentPlayers();
      if (result.data) {
        const found = result.data.players.find((p: TournamentPlayer) => p.id === playerId);
        if (found) {
          setPlayer(found);
        } else {
          setError('Player not found');
        }
      } else {
        setError(result.error || 'Failed to load player');
      }
      setIsLoading(false);
    }
    load();
  }, [playerId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }
  if (!player) return null;

  return <PlayerForm player={player} />;
}
