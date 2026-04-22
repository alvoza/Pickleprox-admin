'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { canAccessPage } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
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
  UserRound,
  CalendarDays,
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
      { name: 'Groups', href: '/groups', icon: Users2 },
    ],
  },
  {
    title: 'Tournaments',
    items: [
      { name: 'Tournaments', href: '/tournaments', icon: Trophy },
      { name: 'Players', href: '/tournament-players', icon: UserRound },
      { name: 'Calendar', href: '/calendar', icon: CalendarDays },
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
  const { user } = useAuth();
  const userGroups = user?.groups || [];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Filter navigation sections based on user permissions
  const filteredNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessPage(item.href, userGroups)),
    }))
    .filter((section) => section.items.length > 0);

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
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-100 bg-[var(--sidebar-bg)] transition-all duration-300 dark:border-border-dark lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 dark:border-b dark:border-border-dark">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icons/ppro-icon.png" alt="PicklePro" width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-bold text-[var(--foreground)]">
                Pickle<span className="text-brand-orange">Pro</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="mx-auto">
              <Image src="/icons/ppro-icon.png" alt="PicklePro" width={32} height={32} className="h-8 w-8" />
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
          {filteredNavigation.map((section, sectionIndex) => (
            <div key={section.title}>
              {sectionIndex > 0 && <div className="my-3" />}
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-light">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                          active
                            ? 'bg-brand-orange/8 text-brand-orange'
                            : 'text-muted hover:bg-gray-50 hover:text-[var(--foreground)] dark:hover:bg-dark-tertiary',
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
        <div className="hidden p-3 dark:border-t dark:border-border-dark lg:block">
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
