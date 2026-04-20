import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: 'bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90 focus:ring-brand-orange/20',
  secondary: 'border border-border-light/80 bg-white text-[var(--foreground)] hover:bg-gray-50 dark:border-border-dark dark:bg-dark-secondary dark:hover:bg-dark-tertiary',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-200',
  ghost: 'text-muted hover:bg-gray-100 hover:text-[var(--foreground)] dark:hover:bg-dark-tertiary',
  outline: 'border-2 border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange/5 focus:ring-brand-orange/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
