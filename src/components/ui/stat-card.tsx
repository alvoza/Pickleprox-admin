import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: { value: number; label: string };
  color?: 'orange' | 'green' | 'yellow' | 'blue' | 'red';
}

const colorClasses = {
  orange: 'bg-brand-orange/10 text-brand-orange',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export function StatCard({ title, value, icon: Icon, change, color = 'orange' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border-light bg-[var(--card-bg)] p-5 shadow-sm dark:border-border-dark">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{value}</p>
          {change && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              change.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}>
              {change.value >= 0 ? '+' : ''}{change.value}% {change.label}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', colorClasses[color])}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
