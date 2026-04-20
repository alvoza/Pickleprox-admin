'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDate, capitalize } from '@/lib/utils';
import type { User } from '@/types/models';

const skillBadgeVariant = (level: string) => {
  switch (level) {
    case 'pro': return 'error' as const;
    case 'advanced': return 'orange' as const;
    case 'intermediate': return 'warning' as const;
    case 'beginner': return 'info' as const;
    default: return 'default' as const;
  }
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    const result = await api.admin.getUsers();
    if (result.data) setUsers(result.data.users);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteUser(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      await loadUsers();
    }
  }

  const columns: Column<User & Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-semibold text-brand-orange">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'skillLevel',
      header: 'Skill Level',
      sortable: true,
      render: (user) => (
        <Badge variant={skillBadgeVariant(user.skillLevel)}>
          {capitalize(user.skillLevel)}
        </Badge>
      ),
    },
    {
      key: 'premiumTier',
      header: 'Plan',
      sortable: true,
      render: (user) => (
        <Badge variant={user.isPremium ? 'orange' : 'default'}>
          {capitalize(user.premiumTier)}
        </Badge>
      ),
    },
    {
      key: 'authProvider',
      header: 'Auth',
      render: (user) => (
        <span className="text-sm text-muted">{capitalize(user.authProvider)}</span>
      ),
    },
    {
      key: 'signInCount',
      header: 'Sign-ins',
      sortable: true,
      render: (user) => <span>{user.signInCount}</span>,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (user) => (
        <span className="text-sm text-muted">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (user) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/users/${user.id}`); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(user as User); }}
            className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => u.skillLevel === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle={`${users.length} total users`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users' },
        ]}
      />

      <DataTable
        data={filteredUsers as (User & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search users..."
        searchKeys={['name', 'email']}
        isLoading={isLoading}
        emptyMessage="No users found"
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Pro', value: 'pro' },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        onRowClick={(user) => router.push(`/users/${user.id}`)}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.name}</strong>? This will permanently remove the user and all their data. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
