'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Send, Users, Crown, Target } from 'lucide-react';
import { capitalize, formatDateTime } from '@/lib/utils';
import type { AdminNotification, NotificationAudience, SkillLevel } from '@/types/models';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'pro'];

const audienceLabel = (n: AdminNotification) => {
  if (n.audience === 'all') return 'All Users';
  if (n.audience === 'premium') return `Premium (${n.audienceFilter || 'all'})`;
  if (n.audience === 'skill_level') return `${capitalize(n.audienceFilter || '')} Players`;
  return capitalize(n.audience);
};

const audienceIcon = (audience: NotificationAudience) => {
  switch (audience) {
    case 'all': return Users;
    case 'skill_level': return Target;
    case 'premium': return Crown;
    default: return Users;
  }
};

const statusVariant = (status: string) => {
  switch (status) {
    case 'sent': return 'success' as const;
    case 'sending': return 'warning' as const;
    case 'failed': return 'error' as const;
    default: return 'default' as const;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [composeOpen, setComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<NotificationAudience>('all');
  const [skillFilter, setSkillFilter] = useState<SkillLevel>('beginner');
  const [premiumFilter, setPremiumFilter] = useState('plus,pro');

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const result = await api.admin.getNotifications();
    if (result.data) setNotifications(result.data.notifications);
    setIsLoading(false);
  }

  function openCompose() {
    setTitle('');
    setBody('');
    setAudience('all');
    setSkillFilter('beginner');
    setPremiumFilter('plus,pro');
    setError(null);
    setSuccessMessage(null);
    setComposeOpen(true);
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) return;

    setSending(true);
    setError(null);

    const audienceFilter = audience === 'skill_level' ? skillFilter
      : audience === 'premium' ? premiumFilter
      : undefined;

    const result = await api.admin.sendNotification({
      title,
      body,
      audience,
      audienceFilter,
    });

    setSending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setNotifications([result.data, ...notifications]);
      setSuccessMessage(`Notification sent to ${result.data.deliveredCount} of ${result.data.recipientCount} users`);
      setTimeout(() => {
        setComposeOpen(false);
        setSuccessMessage(null);
      }, 2000);
    }
  }

  const columns: Column<AdminNotification & Record<string, unknown>>[] = [
    {
      key: 'title',
      header: 'Notification',
      render: (n) => (
        <div className="max-w-sm">
          <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
          <p className="text-xs text-muted line-clamp-1 mt-0.5">{n.body}</p>
        </div>
      ),
    },
    {
      key: 'audience',
      header: 'Audience',
      sortable: true,
      render: (n) => {
        const Icon = audienceIcon(n.audience);
        return (
          <div className="flex items-center gap-1.5">
            <Icon size={14} className="text-muted" />
            <span className="text-sm">{audienceLabel(n as AdminNotification)}</span>
          </div>
        );
      },
    },
    {
      key: 'recipientCount',
      header: 'Delivered',
      sortable: true,
      render: (n) => (
        <span className="text-sm">
          {n.deliveredCount}/{n.recipientCount}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (n) => (
        <Badge variant={statusVariant(n.status)}>
          {capitalize(n.status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Sent At',
      sortable: true,
      render: (n) => (
        <span className="text-sm text-muted">{formatDateTime(n.createdAt)}</span>
      ),
    },
  ];

  const filtered = filter === 'all'
    ? notifications
    : filter === 'broadcast'
    ? notifications.filter(n => n.audience === 'all')
    : notifications.filter(n => n.audience === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-sm text-muted">{notifications.length} notifications sent</p>
        </div>
        <Button onClick={openCompose}>
          <Send size={16} />
          Send Notification
        </Button>
      </div>

      <DataTable
        data={filtered as (AdminNotification & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search notifications..."
        searchKeys={['title', 'body']}
        isLoading={isLoading}
        emptyMessage="No notifications sent yet"
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Broadcast', value: 'broadcast' },
          { label: 'Skill Level', value: 'skill_level' },
          { label: 'Premium', value: 'premium' },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Compose Notification Modal */}
      <Modal
        isOpen={composeOpen}
        onClose={() => !sending && setComposeOpen(false)}
        title="Send Push Notification"
        size="lg"
      >
        <div className="space-y-4">
          {successMessage && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <FormField label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
              placeholder="Notification title..."
              maxLength={100}
            />
          </FormField>

          <FormField label="Message">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={textareaClasses}
              placeholder="Notification message..."
              rows={3}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted">{body.length}/500 characters</p>
          </FormField>

          <FormField label="Audience">
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
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      audience === opt.value
                        ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                        : 'border-border-light text-muted hover:border-gray-300 dark:border-border-dark dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FormField>

          {audience === 'skill_level' && (
            <FormField label="Skill Level">
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value as SkillLevel)}
                className={inputClasses}
              >
                {SKILL_LEVELS.map(s => (
                  <option key={s} value={s}>{capitalize(s)}</option>
                ))}
              </select>
            </FormField>
          )}

          {audience === 'premium' && (
            <FormField label="Premium Tier">
              <select
                value={premiumFilter}
                onChange={(e) => setPremiumFilter(e.target.value)}
                className={inputClasses}
              >
                <option value="plus,pro">Plus & Pro</option>
                <option value="plus">Plus Only</option>
                <option value="pro">Pro Only</option>
              </select>
            </FormField>
          )}

          {/* Preview */}
          {(title || body) && (
            <div className="rounded-lg border border-border-light bg-gray-50 p-4 dark:border-border-dark dark:bg-dark-secondary">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Preview</p>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{title || 'Notification title'}</p>
                  <p className="text-sm text-muted">{body || 'Notification message...'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border-light pt-4 dark:border-border-dark">
            <Button variant="secondary" onClick={() => setComposeOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!title.trim() || !body.trim() || sending}>
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
