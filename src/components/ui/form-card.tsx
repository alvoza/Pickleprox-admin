import { cn } from '@/lib/utils';

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormCard({ title, description, children, className }: FormCardProps) {
  return (
    <div className={cn(
      'rounded-xl bg-[var(--card-bg)] shadow-[var(--card-shadow)] dark:border dark:border-border-dark',
      className,
    )}>
      <div className="border-b border-gray-100 px-6 py-4 dark:border-border-dark">
        <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <div className="space-y-4 p-6">
        {children}
      </div>
    </div>
  );
}
