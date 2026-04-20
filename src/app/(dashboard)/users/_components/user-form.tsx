'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { capitalize, formatDate } from '@/lib/utils';
import type { User, SkillLevel, PremiumTier } from '@/types/models';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];
const PREMIUM_TIERS: PremiumTier[] = ['free', 'plus', 'pro'];

interface UserFormData {
  firstName: string;
  lastName: string;
  name: string;
  skillLevel: SkillLevel;
  isPremium: boolean;
  premiumTier: PremiumTier;
}

interface UserFormProps {
  user: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<UserFormData>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: user.name || '',
    skillLevel: user.skillLevel,
    isPremium: user.isPremium,
    premiumTier: user.premiumTier,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');

    const result = await api.admin.updateUser(user.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      name: form.name || `${form.firstName} ${form.lastName}`.trim(),
      skillLevel: form.skillLevel,
      isPremium: form.isPremium,
      premiumTier: form.premiumTier,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push('/users');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        subtitle={user.email}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users', href: '/users' },
          { label: 'Edit' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/users')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Update User'}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* User info summary */}
      <div className="flex items-center gap-4 rounded-xl bg-[var(--card-bg)] dark:border dark:border-border-dark p-5 shadow-[var(--card-shadow)] dark:border-border-dark">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-lg font-bold text-brand-orange">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-[var(--foreground)]">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-center">
            <p className="text-xs text-muted">Joined</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{formatDate(user.createdAt)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted">Sign-ins</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{user.signInCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted">Auth</p>
            <Badge variant="default">{capitalize(user.authProvider)}</Badge>
          </div>
        </div>
      </div>

      <FormCard title="Personal Information" description="Name and display preferences">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First Name">
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={inputClasses}
            />
          </FormField>
          <FormField label="Last Name">
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputClasses}
            />
          </FormField>
        </div>
        <FormField label="Display Name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClasses}
          />
        </FormField>
      </FormCard>

      <FormCard title="Account Settings" description="Skill level and subscription tier">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Skill Level">
            <select
              value={form.skillLevel}
              onChange={(e) => setForm({ ...form, skillLevel: e.target.value as SkillLevel })}
              className={inputClasses}
            >
              {SKILL_LEVELS.map(s => (
                <option key={s} value={s}>{capitalize(s)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Premium Tier">
            <select
              value={form.premiumTier}
              onChange={(e) => {
                const tier = e.target.value as PremiumTier;
                setForm({ ...form, premiumTier: tier, isPremium: tier !== 'free' });
              }}
              className={inputClasses}
            >
              {PREMIUM_TIERS.map(t => (
                <option key={t} value={t}>{capitalize(t)}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormCard>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/users')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Update User'}
        </Button>
      </div>
    </div>
  );
}
