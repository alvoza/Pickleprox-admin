'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { Users2, Plus, Pencil, Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import type { Group } from '@/types/models';

interface GroupMember {
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  status: string;
  joinedAt: string;
}

interface GroupAdmin {
  userId: string;
  email: string;
  name: string;
}

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
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Group | null>(null);
  const [form, setForm] = useState<GroupFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Members/Admins management
  const [manageGroup, setManageGroup] = useState<Group | null>(null);
  const [manageTab, setManageTab] = useState<'members' | 'admins'>('members');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [admins, setAdmins] = useState<GroupAdmin[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

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

  async function openManageModal(group: Group) {
    setManageGroup(group);
    setManageTab('members');
    setLoadingMembers(true);
    setAdminEmail('');

    const [membersResult, adminsResult] = await Promise.all([
      api.admin.getGroupMembers(group.id),
      isSuperAdmin ? api.admin.getGroupAdmins(group.id) : Promise.resolve({ data: null, error: null }),
    ]);

    setMembers(membersResult.data?.members || []);
    setAdmins(adminsResult.data?.admins || []);
    setLoadingMembers(false);
  }

  async function handleApproveMember(userId: string) {
    if (!manageGroup) return;
    await api.admin.approveGroupMember(manageGroup.id, userId);
    setMembers(members.map(m => m.userId === userId ? { ...m, status: 'active' } : m));
  }

  async function handleRemoveMember(userId: string) {
    if (!manageGroup) return;
    await api.admin.removeGroupMember(manageGroup.id, userId);
    setMembers(members.filter(m => m.userId !== userId));
  }

  async function handleAddAdmin() {
    if (!manageGroup || !adminEmail.trim()) return;
    // Search users by email to get userId
    const usersResult = await api.admin.getUsers();
    const matchedUser = usersResult.data?.users?.find(
      (u: { email?: string }) => u.email?.toLowerCase() === adminEmail.trim().toLowerCase()
    );
    if (!matchedUser) {
      setError('User not found with that email');
      return;
    }
    await api.admin.assignGroupAdmin(manageGroup.id, matchedUser.userId || (matchedUser as unknown as { id: string }).id);
    setAdminEmail('');
    const result = await api.admin.getGroupAdmins(manageGroup.id);
    setAdmins(result.data?.admins || []);
  }

  async function handleRemoveAdmin(userId: string) {
    if (!manageGroup) return;
    await api.admin.removeGroupAdmin(manageGroup.id, userId);
    setAdmins(admins.filter(a => a.userId !== userId));
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
      className: 'w-32',
      render: (group) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openManageModal(group as unknown as Group); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-dark-tertiary"
            title="Manage Members"
          >
            <Users2 size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(group as unknown as Group); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          {isSuperAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(group as unknown as Group); }}
              className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
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

      {/* Manage Members / Admins Modal */}
      <Modal
        isOpen={!!manageGroup}
        onClose={() => setManageGroup(null)}
        title={`Manage: ${manageGroup?.name || ''}`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Tab switcher */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-dark-tertiary">
            <button
              onClick={() => setManageTab('members')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                manageTab === 'members'
                  ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-dark-secondary'
                  : 'text-muted hover:text-[var(--foreground)]'
              }`}
            >
              Members ({members.length})
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setManageTab('admins')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  manageTab === 'admins'
                    ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-dark-secondary'
                    : 'text-muted hover:text-[var(--foreground)]'
                }`}
              >
                Admins ({admins.length})
              </button>
            )}
          </div>

          {loadingMembers ? (
            <div className="py-8 text-center text-sm text-muted">Loading...</div>
          ) : manageTab === 'members' ? (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {members.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">No members yet</p>
              ) : (
                members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3 dark:border-border-dark">
                    <div className="flex items-center gap-3">
                      {member.userAvatarUrl ? (
                        <img src={member.userAvatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-dark-tertiary dark:text-gray-300">
                          {member.userName?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{member.userName}</p>
                        <p className="text-xs text-muted">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.status === 'pending' ? (
                        <>
                          <Badge variant="warning">Pending</Badge>
                          <button
                            onClick={() => handleApproveMember(member.userId)}
                            className="rounded p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Approve"
                          >
                            <UserCheck size={16} />
                          </button>
                        </>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add admin form */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`${inputClasses} flex-1`}
                  placeholder="Enter user email to add as admin..."
                />
                <Button onClick={handleAddAdmin} disabled={!adminEmail.trim()}>
                  <Shield size={16} />
                  Add
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="max-h-80 space-y-2 overflow-y-auto">
                {admins.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted">No admins assigned</p>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.userId} className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3 dark:border-border-dark">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{admin.name || admin.email}</p>
                        <p className="text-xs text-muted">{admin.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(admin.userId)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove Admin"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
