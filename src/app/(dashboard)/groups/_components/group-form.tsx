'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { UserCheck, UserX, Shield } from 'lucide-react';
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
  name: '', description: '', location: '', imageUrl: '', bannerUrl: '', isPrivate: false,
};

interface GroupFormProps {
  group?: Group;
}

export function GroupForm({ group }: GroupFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isEditing = !!group;

  const [form, setForm] = useState<GroupFormData>(
    group
      ? { name: group.name, description: group.description || '', location: group.location || '', imageUrl: group.imageUrl || '', bannerUrl: group.bannerUrl || '', isPrivate: group.isPrivate }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Members/Admins management (only for editing)
  const [manageTab, setManageTab] = useState<'members' | 'admins'>('members');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [admins, setAdmins] = useState<GroupAdmin[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    if (group) {
      setLoadingMembers(true);
      Promise.all([
        api.admin.getGroupMembers(group.id),
        isSuperAdmin ? api.admin.getGroupAdmins(group.id) : Promise.resolve({ data: null, error: null }),
      ]).then(([membersResult, adminsResult]) => {
        setMembers(membersResult.data?.members || []);
        setAdmins(adminsResult.data?.admins || []);
        setLoadingMembers(false);
      });
    }
  }, [group, isSuperAdmin]);

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    const payload: Partial<Group> = {
      name: form.name, description: form.description || undefined,
      location: form.location || undefined, imageUrl: form.imageUrl || undefined,
      bannerUrl: form.bannerUrl || undefined, isPrivate: form.isPrivate,
    };
    const result = isEditing
      ? await api.admin.updateGroup(group.id, payload)
      : await api.admin.createGroup(payload);
    if (result.error) { setError(result.error); setSaving(false); return; }
    router.push('/groups');
  }

  async function handleApproveMember(userId: string) {
    if (!group) return;
    await api.admin.approveGroupMember(group.id, userId);
    setMembers(members.map(m => m.userId === userId ? { ...m, status: 'active' } : m));
  }

  async function handleRemoveMember(userId: string) {
    if (!group) return;
    await api.admin.removeGroupMember(group.id, userId);
    setMembers(members.filter(m => m.userId !== userId));
  }

  async function handleAddAdmin() {
    if (!group || !adminEmail.trim()) return;
    const usersResult = await api.admin.getUsers();
    const matchedUser = usersResult.data?.users?.find(
      (u: { email?: string }) => u.email?.toLowerCase() === adminEmail.trim().toLowerCase()
    );
    if (!matchedUser) { setError('User not found with that email'); return; }
    await api.admin.assignGroupAdmin(group.id, (matchedUser as unknown as { userId?: string; id: string }).userId || matchedUser.id);
    setAdminEmail('');
    const result = await api.admin.getGroupAdmins(group.id);
    setAdmins(result.data?.admins || []);
  }

  async function handleRemoveAdmin(userId: string) {
    if (!group) return;
    await api.admin.removeGroupAdmin(group.id, userId);
    setAdmins(admins.filter(a => a.userId !== userId));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Group' : 'Create New Group'}
        subtitle={isEditing ? group.name : 'Set up a new group'}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Groups', href: '/groups' }, { label: isEditing ? 'Edit' : 'New' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/groups')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Group' : 'Create Group'}</Button>
          </div>
        }
      />

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

      <FormCard title="Group Information" description="Name, description, and location">
        <FormField label="Name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} placeholder="e.g. Downtown Pickleball Club" />
        </FormField>
        <FormField label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={textareaClasses} rows={3} placeholder="Describe the group..." />
        </FormField>
        <FormField label="Location">
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClasses} placeholder="e.g. Miami, FL" />
        </FormField>
      </FormCard>

      <FormCard title="Images" description="Group icon and banner">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUpload label="Group Icon" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} category="groups" aspectHint="Square, 256x256 recommended" />
          <ImageUpload label="Banner Image" value={form.bannerUrl} onChange={(url) => setForm({ ...form, bannerUrl: url })} category="groups" aspectHint="Wide, 1200x400 recommended" />
        </div>
      </FormCard>

      <FormCard title="Settings" description="Privacy and access control">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isPrivate} onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange" />
          <span className="text-sm text-[var(--foreground)]">Private group (requires approval to join)</span>
        </label>
      </FormCard>

      {/* Members & Admins management (only when editing) */}
      {isEditing && (
        <FormCard title="Members & Admins" description="Manage group membership">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-dark-tertiary">
            <button onClick={() => setManageTab('members')} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${manageTab === 'members' ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-dark-secondary' : 'text-muted hover:text-[var(--foreground)]'}`}>
              Members ({members.length})
            </button>
            {isSuperAdmin && (
              <button onClick={() => setManageTab('admins')} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${manageTab === 'admins' ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-dark-secondary' : 'text-muted hover:text-[var(--foreground)]'}`}>
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
              ) : members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-border-dark">
                  <div className="flex items-center gap-3">
                    {member.userAvatarUrl ? (
                      <img src={member.userAvatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-dark-tertiary dark:text-gray-300">{member.userName?.charAt(0) || '?'}</div>
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
                        <button onClick={() => handleApproveMember(member.userId)} className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20" title="Approve"><UserCheck size={16} /></button>
                      </>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                    <button onClick={() => handleRemoveMember(member.userId)} className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" title="Remove"><UserX size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={`${inputClasses} flex-1`} placeholder="Enter user email to add as admin..." />
                <Button onClick={handleAddAdmin} disabled={!adminEmail.trim()}><Shield size={16} />Add</Button>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {admins.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted">No admins assigned</p>
                ) : admins.map((admin) => (
                  <div key={admin.userId} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-border-dark">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{admin.name || admin.email}</p>
                      <p className="text-xs text-muted">{admin.email}</p>
                    </div>
                    <button onClick={() => handleRemoveAdmin(admin.userId)} className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" title="Remove Admin"><UserX size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormCard>
      )}

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/groups')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Group' : 'Create Group'}</Button>
      </div>
    </div>
  );
}
