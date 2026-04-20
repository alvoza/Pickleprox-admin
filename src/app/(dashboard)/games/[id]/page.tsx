'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GameForm } from '../_components/game-form';
import type { Game } from '@/types/models';

interface AdminGame extends Game {
  itemType: 'game' | 'session';
  createdBy: { id: string; name: string };
  sessionType?: string;
  duration?: number;
}

export default function EditGamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const [game, setGame] = useState<AdminGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getGames();
      if (result.data) {
        const found = (result.data.games as AdminGame[]).find(g => g.id === gameId);
        if (found) {
          setGame(found);
        } else {
          setError('Game not found');
        }
      } else {
        setError(result.error || 'Failed to load game');
      }
      setIsLoading(false);
    }
    load();
  }, [gameId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }
  if (!game) return null;

  return <GameForm game={game} isSuperAdmin={isSuperAdmin} />;
}
