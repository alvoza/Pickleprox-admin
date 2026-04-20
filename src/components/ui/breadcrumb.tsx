import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={14} className="text-muted-light" />}
            {isLast || !item.href ? (
              <span className={isLast ? 'font-medium text-[var(--foreground)]' : 'text-muted'}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted transition-colors duration-150 hover:text-brand-orange"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
