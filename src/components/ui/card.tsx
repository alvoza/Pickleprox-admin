import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, title, action, className, noPadding }: CardProps) {
  return (
    <div className={cn(
      'rounded-xl bg-[var(--card-bg)] shadow-[var(--card-shadow)] transition-shadow duration-200 dark:border dark:border-border-dark',
      className,
    )}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-border-dark">
          <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
          {action}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5')}>
        {children}
      </div>
    </div>
  );
}
