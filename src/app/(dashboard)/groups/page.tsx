'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/contexts/AuthContext';
import { Users2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Group } from '@/types/models';

export default function GroupsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Group | null>(null);
  const [error, setError] = useState('');

  const loadGroups = useCallback(async () => {
    const result = await api.admin.getGroups();
    if (result.data) setGroups(result.data.groups);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteGroup(deleteConfirm.id);
    if (result.error) setError(result.error);
    else { setDeleteConfirm(null); await loadGroups(); }
  }

  const columns: Column<Group & Record<string, unknown>>[] = [
    {
      key: 'name', header: 'Name', sortable: true,
      render: (group) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"><Users2 size={18} /></div>
          <div>
            <p className="font-medium">{group.name}</p>
            {group.description && <p className="text-xs text-muted line-clamp-1">{group.description as string}</p>}
          </div>
        </div>
      ),
    },
    { key: 'location', header: 'Location', sortable: true, render: (group) => <span className="text-sm text-muted">{(group.location as string) || '-'}</span> },
    { key: 'memberCount', header: 'Members', sortable: true, render: (group) => <Badge variant="info">{group.memberCount as number} members</Badge> },
    { key: 'isPrivate', header: 'Privacy', render: (group) => <Badge variant={group.isPrivate ? 'warning' : 'success'}>{group.isPrivate ? 'Private' : 'Public'}</Badge> },
    { key: 'createdAt', header: 'Created', sortable: true, render: (group) => <span className="text-sm text-muted">{new Date(group.createdAt as string).toLocaleDateString()}</span> },
    {
      key: 'actions', header: '', className: 'w-24',
      render: (group) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); router.push(`/groups/${group.id}`); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary" title="Edit"><Pencil size={15} /></button>
          {isSuperAdmin && (
            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(group as unknown as Group); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Delete"><Trash2 size={15} /></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Groups"
        subtitle={`${groups.length} registered groups`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Groups' }]}
        actions={<Button onClick={() => router.push('/groups/new')}><Plus size={16} />Create Group</Button>}
      />

      <DataTable
        data={groups as (Group & Record<string, unknown>)[]}
        columns={columns}
        searchable searchPlaceholder="Search groups..." searchKeys={['name', 'description']}
        isLoading={isLoading} emptyMessage="No groups found"
        onRowClick={(group) => router.push(`/groups/${group.id}`)}
      />

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Group" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
