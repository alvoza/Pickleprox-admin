import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'orange';
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  orange: 'bg-brand-orange/10 text-brand-orange',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variantClasses[variant],
      className,
    )}>
      {children}
    </span>
  );
}

export function getStatusBadgeVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'open':
    case 'created':
      return 'orange';
    case 'in_progress':
    case 'live':
      return 'success';
    case 'completed':
    case 'full':
      return 'default';
    case 'cancelled':
      return 'error';
    case 'scheduled':
      return 'info';
    default:
      return 'default';
  }
}
