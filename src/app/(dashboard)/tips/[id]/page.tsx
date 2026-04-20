'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TipForm } from '../_components/tip-form';
import type { Tip } from '@/types/models';

export default function EditTipPage() {
  const params = useParams();
  const id = params.id as string;
  const [tip, setTip] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getTips();
      if (result.data) {
        const found = result.data.tips.find((t: Tip) => t.id === id);
        if (found) setTip(found);
        else setError('Tip not found');
      } else setError(result.error || 'Failed to load');
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="flex items-center justify-center py-20"><p className="text-sm text-muted">{error}</p></div>;
  if (!tip) return null;
  return <TipForm tip={tip} />;
}
