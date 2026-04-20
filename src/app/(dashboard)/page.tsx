'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Users, UserCheck, Calendar, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types/models';

const UserGrowthChart = dynamic(
  () => import('@/components/dashboard/UserGrowthChart'),
  { ssr: false, loading: () => <div className="flex h-[300px] items-center justify-center"><LoadingSpinner /></div> }
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await api.admin.getDashboard();
      if (result.data) setStats(result.data);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading || !stats) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the PicklePro admin panel"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          icon={Users}
          color="orange"
          change={{ value: 12, label: 'vs last month' }}
        />
        <StatCard
          title="Active Today"
          value={formatNumber(stats.activeUsersToday)}
          icon={UserCheck}
          color="green"
          change={{ value: 5, label: 'vs yesterday' }}
        />
        <StatCard
          title="Events Created"
          value={formatNumber(stats.totalEvents)}
          icon={Calendar}
          color="yellow"
          change={{ value: 8, label: 'this week' }}
        />
        <StatCard
          title="Sessions Logged"
          value={formatNumber(stats.sessionsLogged)}
          icon={Clock}
          color="blue"
          change={{ value: 15, label: 'vs last month' }}
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="User Growth" className="xl:col-span-2">
          <UserGrowthChart data={stats.userGrowth} />
        </Card>

        <Card title="Recent Activity">
          <RecentActivity activities={stats.recentActivity} />
        </Card>
      </div>
    </div>
  );
}
