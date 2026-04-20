'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserForm } from '../_components/user-form';
import type { User } from '@/types/models';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getUsers();
      if (result.data) {
        const found = result.data.users.find((u: User) => u.id === userId);
        if (found) {
          setUser(found);
        } else {
          setError('User not found');
        }
      } else {
        setError(result.error || 'Failed to load user');
      }
      setIsLoading(false);
    }
    load();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }
  if (!user) return null;

  return <UserForm user={user} />;
}
