'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GroupForm } from '../_components/group-form';
import type { Group } from '@/types/models';

export default function EditGroupPage() {
  const params = useParams();
  const id = params.id as string;
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getGroups();
      if (result.data) {
        const found = result.data.groups.find((g: Group) => g.id === id);
        if (found) setGroup(found);
        else setError('Group not found');
      } else setError(result.error || 'Failed to load');
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="flex items-center justify-center py-20"><p className="text-sm text-muted">{error}</p></div>;
  if (!group) return null;
  return <GroupForm group={group} />;
}
