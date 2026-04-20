'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, Sun, Moon, LogOut, User, Search, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-[var(--header-bg)] px-4 dark:border-border-dark lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-dark-tertiary lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search bar - desktop only */}
        <div className="relative hidden lg:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] pl-9 pr-12 text-sm text-[var(--foreground)] shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:placeholder:text-gray-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-muted dark:border-border-dark dark:bg-dark-tertiary">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-border-light/60 dark:bg-border-dark" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1.5 text-sm transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <User size={16} />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-[var(--foreground)]">{user?.name || user?.email}</p>
              {user?.groups && user.groups.length > 0 && (
                <p className="text-[11px] text-muted">{user.groups[0]}</p>
              )}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-gray-100 bg-[var(--card-bg)] py-1 shadow-[var(--dropdown-shadow)] dark:border-border-dark">
              <div className="border-b border-border-light/60 px-4 py-3 dark:border-border-dark">
                <p className="text-sm font-medium text-[var(--foreground)]">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
                {user?.groups && user.groups.length > 0 && (
                  <span className="mt-1.5 inline-flex rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
                    {user.groups.join(', ')}
                  </span>
                )}
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
