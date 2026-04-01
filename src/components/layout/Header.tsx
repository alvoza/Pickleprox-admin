'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
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
    <header className="flex h-16 items-center justify-between border-b border-border-light bg-[var(--header-bg)] px-4 dark:border-border-dark lg:px-6">
      {/* Left */}
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="lg:hidden" />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <User size={16} />
            </div>
            <span className="hidden text-[var(--foreground)] md:block">{user?.name || user?.email}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-light bg-[var(--card-bg)] py-1 shadow-lg dark:border-border-dark">
              <div className="border-b border-border-light px-4 py-3 dark:border-border-dark">
                <p className="text-sm font-medium text-[var(--foreground)]">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
                {user?.groups && user.groups.length > 0 && (
                  <p className="mt-1 text-xs text-brand-orange">{user.groups.join(', ')}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-dark-tertiary"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
