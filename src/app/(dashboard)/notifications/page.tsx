'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Send, Users, Crown, Target } from 'lucide-react';
import { capitalize, formatDateTime } from '@/lib/utils';
import type { AdminNotification, NotificationAudience } from '@/types/models';

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
  const router = useRouter();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const result = await api.admin.getNotifications();
      if (result.data) setNotifications(result.data.notifications);
      setIsLoading(false);
    }
    load();
  }, []);

  const columns: Column<AdminNotification & Record<string, unknown>>[] = [
    {
      key: 'title', header: 'Notification',
      render: (n) => (
        <div className="max-w-sm">
          <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
          <p className="text-xs text-muted line-clamp-1 mt-0.5">{n.body}</p>
        </div>
      ),
    },
    {
      key: 'audience', header: 'Audience', sortable: true,
      render: (n) => {
        const Icon = audienceIcon(n.audience);
        return <div className="flex items-center gap-1.5"><Icon size={14} className="text-muted" /><span className="text-sm">{audienceLabel(n as AdminNotification)}</span></div>;
      },
    },
    { key: 'recipientCount', header: 'Delivered', sortable: true, render: (n) => <span className="text-sm">{n.deliveredCount}/{n.recipientCount}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (n) => <Badge variant={statusVariant(n.status)}>{capitalize(n.status)}</Badge> },
    { key: 'createdAt', header: 'Sent At', sortable: true, render: (n) => <span className="text-sm text-muted">{formatDateTime(n.createdAt)}</span> },
  ];

  const filtered = filter === 'all' ? notifications
    : filter === 'broadcast' ? notifications.filter(n => n.audience === 'all')
    : notifications.filter(n => n.audience === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.length} notifications sent`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Notifications' }]}
        actions={<Button onClick={() => router.push('/notifications/compose')}><Send size={16} />Send Notification</Button>}
      />

      <DataTable
        data={filtered as (AdminNotification & Record<string, unknown>)[]}
        columns={columns}
        searchable searchPlaceholder="Search notifications..." searchKeys={['title', 'body']}
        isLoading={isLoading} emptyMessage="No notifications sent yet"
        filterTabs={[{ label: 'All', value: 'all' }, { label: 'Broadcast', value: 'broadcast' }, { label: 'Skill Level', value: 'skill_level' }, { label: 'Premium', value: 'premium' }]}
        activeFilter={filter} onFilterChange={setFilter}
      />
    </div>
  );
}
