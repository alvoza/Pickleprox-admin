'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Users2,
  MapPin,
  Gamepad2,
  Trophy,
  Lightbulb,
  Bell,
  X,
  ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navigation = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Courts', href: '/courts', icon: MapPin },
      { name: 'Games & Events', href: '/games', icon: Gamepad2 },
      { name: 'Tournaments', href: '/tournaments', icon: Trophy },
      { name: 'Groups', href: '/groups', icon: Users2 },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Tips', href: '/tips', icon: Lightbulb },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
];

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border-light bg-[var(--sidebar-bg)] transition-all duration-300 dark:border-border-dark lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border-light px-4 dark:border-border-dark">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="text-lg font-bold text-[var(--foreground)]">
                Pickle<span className="text-brand-orange">Pro</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange">
              <span className="text-sm font-bold text-white">P</span>
            </Link>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-light">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          active
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'text-muted hover:bg-gray-100 hover:text-[var(--foreground)] dark:hover:bg-dark-tertiary',
                          isCollapsed && 'justify-center px-0',
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <Icon size={20} className={active ? 'text-brand-orange' : ''} />
                        {!isCollapsed && item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden border-t border-border-light p-3 dark:border-border-dark lg:block">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          >
            <ChevronLeft
              size={18}
              className={cn('transition-transform', isCollapsed && 'rotate-180')}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
