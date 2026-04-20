import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-[var(--foreground)]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export const inputClasses =
  'w-full h-11 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:placeholder:text-gray-500';

export const selectClasses = inputClasses;

export const textareaClasses =
  'w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:placeholder:text-gray-500 min-h-[100px] resize-y';
