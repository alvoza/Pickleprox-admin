'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Users, Crown, Target } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import type { NotificationAudience, SkillLevel } from '@/types/models';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];

export default function ComposeNotificationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<NotificationAudience>('all');
  const [skillFilter, setSkillFilter] = useState<SkillLevel>('beginner');
  const [premiumFilter, setPremiumFilter] = useState('plus,pro');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSend() {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError(null);

    const audienceFilter = audience === 'skill_level' ? skillFilter
      : audience === 'premium' ? premiumFilter
      : undefined;

    const result = await api.admin.sendNotification({ title, body, audience, audienceFilter });
    setSending(false);

    if (result.error) { setError(result.error); return; }

    if (result.data) {
      setSuccessMessage(`Notification sent to ${result.data.deliveredCount} of ${result.data.recipientCount} users`);
      setTimeout(() => router.push('/notifications'), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Send Push Notification"
        subtitle="Compose and send a notification to app users"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Notifications', href: '/notifications' }, { label: 'Compose' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/notifications')}>Cancel</Button>
            <Button onClick={handleSend} disabled={!title.trim() || !body.trim() || sending}>
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        }
      />

      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{successMessage}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      <FormCard title="Message" description="Title and body of the notification">
        <FormField label="Title">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} placeholder="Notification title..." maxLength={100} />
        </FormField>
        <FormField label="Message">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className={textareaClasses} placeholder="Notification message..." rows={4} maxLength={500} />
          <p className="mt-1 text-xs text-muted">{body.length}/500 characters</p>
        </FormField>
      </FormCard>

      <FormCard title="Audience" description="Choose who receives this notification">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all' as const, label: 'All Users', icon: Users },
            { value: 'skill_level' as const, label: 'By Skill Level', icon: Target },
            { value: 'premium' as const, label: 'Premium Users', icon: Crown },
          ].map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAudience(opt.value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  audience === opt.value
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                    : 'border-[var(--input-border)] text-muted hover:border-brand-orange/50 hover:text-[var(--foreground)]'
                }`}
              >
                <Icon size={16} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {audience === 'skill_level' && (
          <FormField label="Skill Level">
            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value as SkillLevel)} className={inputClasses}>
              {SKILL_LEVELS.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
            </select>
          </FormField>
        )}

        {audience === 'premium' && (
          <FormField label="Premium Tier">
            <select value={premiumFilter} onChange={(e) => setPremiumFilter(e.target.value)} className={inputClasses}>
              <option value="plus,pro">Plus & Pro</option>
              <option value="plus">Plus Only</option>
              <option value="pro">Pro Only</option>
            </select>
          </FormField>
        )}
      </FormCard>

      {/* Preview */}
      {(title || body) && (
        <FormCard title="Preview" description="How the notification will appear">
          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-border-dark dark:bg-dark-secondary">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{title || 'Notification title'}</p>
              <p className="text-sm text-muted">{body || 'Notification message...'}</p>
            </div>
          </div>
        </FormCard>
      )}

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/notifications')}>Cancel</Button>
        <Button onClick={handleSend} disabled={!title.trim() || !body.trim() || sending}>
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>
      </div>
    </div>
  );
}
