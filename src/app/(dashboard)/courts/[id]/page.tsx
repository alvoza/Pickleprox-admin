'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CourtForm } from '../_components/court-form';
import type { Court } from '@/types/models';

export default function EditCourtPage() {
  const params = useParams();
  const courtId = params.id as string;
  const [court, setCourt] = useState<Court | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getCourts();
      if (result.data) {
        const found = result.data.courts.find((c: Court) => c.id === courtId);
        if (found) {
          setCourt(found);
        } else {
          setError('Court not found');
        }
      } else {
        setError(result.error || 'Failed to load court');
      }
      setIsLoading(false);
    }
    load();
  }, [courtId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }
  if (!court) return null;

  return <CourtForm court={court} />;
}
