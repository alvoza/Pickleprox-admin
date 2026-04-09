'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { ImageUpload } from '@/components/ui/image-upload';
import { Users2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Group } from '@/types/models';

interface GroupFormData {
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  bannerUrl: string;
  isPrivate: boolean;
}

const emptyForm: GroupFormData = {
  name: '',
  description: '',
  location: '',
  imageUrl: '',
  bannerUrl: '',
  isPrivate: false,
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Group | null>(null);
  const [form, setForm] = useState<GroupFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadGroups = useCallback(async () => {
    const result = await api.admin.getGroups();
    if (result.data) setGroups(result.data.groups);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  function openCreateModal() {
    setEditingGroup(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }

  function openEditModal(group: Group) {
    setEditingGroup(group);
    setForm({
      name: group.name,
      description: group.description || '',
      location: group.location || '',
      imageUrl: group.imageUrl || '',
      bannerUrl: group.bannerUrl || '',
      isPrivate: group.isPrivate,
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');

    const payload: Partial<Group> = {
      name: form.name,
      description: form.description || undefined,
      location: form.location || undefined,
      imageUrl: form.imageUrl || undefined,
      bannerUrl: form.bannerUrl || undefined,
      isPrivate: form.isPrivate,
    };

    if (editingGroup) {
      const result = await api.admin.updateGroup(editingGroup.id, payload);
      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await api.admin.createGroup(payload);
      if (result.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalOpen(false);
    await loadGroups();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    const result = await api.admin.deleteGroup(deleteConfirm.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleteConfirm(null);
      await loadGroups();
    }
  }

  const columns: Column<Group & Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (group) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <Users2 size={18} />
          </div>
          <div>
            <p className="font-medium">{group.name}</p>
            {group.description && (
              <p className="text-xs text-muted line-clamp-1">{group.description as string}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      render: (group) => (
        <span className="text-sm text-muted">{(group.location as string) || '-'}</span>
      ),
    },
    {
      key: 'memberCount',
      header: 'Members',
      sortable: true,
      render: (group) => (
        <Badge variant="info">{group.memberCount as number} members</Badge>
      ),
    },
    {
      key: 'isPrivate',
      header: 'Privacy',
      render: (group) => (
        <Badge variant={group.isPrivate ? 'warning' : 'success'}>
          {group.isPrivate ? 'Private' : 'Public'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      render: (group) => (
        <span className="text-sm text-muted">
          {new Date(group.createdAt as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (group) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(group as unknown as Group); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(group as unknown as Group); }}
            className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Groups</h1>
          <p className="text-sm text-muted">{groups.length} registered groups</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Create Group
        </Button>
      </div>

      <DataTable
        data={groups as (Group & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search groups..."
        searchKeys={['name', 'description']}
        isLoading={isLoading}
        emptyMessage="No groups found"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGroup ? 'Edit Group' : 'Create New Group'}
        size="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <FormField label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClasses}
              placeholder="e.g. Downtown Pickleball Club"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClasses}
              rows={3}
              placeholder="Describe the group..."
            />
          </FormField>

          <FormField label="Location">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClasses}
              placeholder="e.g. Miami, FL"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUpload
              label="Group Icon"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              category="groups"
              aspectHint="Square, 256x256 recommended"
            />
            <ImageUpload
              label="Banner Image"
              value={form.bannerUrl}
              onChange={(url) => setForm({ ...form, bannerUrl: url })}
              category="groups"
              aspectHint="Wide, 1200x400 recommended"
            />
          </div>

          <FormField label="Privacy">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
              />
              <span className="text-sm text-[var(--foreground)]">Private group</span>
            </label>
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Group"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteConfirm?.name}</strong>? This action cannot be undone.
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
