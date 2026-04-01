import { UserPlus, Gamepad2, Trophy, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import type { ActivityItem } from '@/types/models';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const iconMap = {
  user_signup: UserPlus,
  game_created: Gamepad2,
  tournament_created: Trophy,
  session_logged: Clock,
};

const colorMap = {
  user_signup: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  game_created: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  tournament_created: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  session_logged: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-3">
      {activities.map(activity => {
        const Icon = iconMap[activity.type];
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`rounded-lg p-2 ${colorMap[activity.type]}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--foreground)]">{activity.description}</p>
              <p className="text-xs text-muted">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
