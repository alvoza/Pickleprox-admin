'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  filterTabs?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data found',
  isLoading,
  filterTabs,
  activeFilter,
  onFilterChange,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = data;
    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const val = item[key];
          return typeof val === 'string' && val.toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }
    return result;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Generate page numbers to display (up to 5)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible);
    start = Math.max(0, end - maxVisible);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl bg-[var(--card-bg)] shadow-[var(--card-shadow)] dark:border dark:border-border-dark">
        <div className="p-8">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-tertiary" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--card-bg)] shadow-[var(--card-shadow)] dark:border dark:border-border-dark">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 dark:border-border-dark sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs && (
            <div className="flex gap-1">
              {filterTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => {
                    onFilterChange?.(tab.value);
                    setPage(0);
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                    activeFilter === tab.value
                      ? 'bg-brand-orange/10 text-brand-orange shadow-sm'
                      : 'text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {searchable && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="h-10 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:placeholder:text-gray-500"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[var(--table-header-bg)] dark:border-border-dark">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted',
                    col.sortable && 'cursor-pointer select-none hover:text-[var(--foreground)]',
                    col.className,
                  )}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortKey === col.key && (
                      <span className="text-brand-orange">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-border-dark">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox size={36} className="text-muted-light" />
                    <p className="text-sm text-muted">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((item, idx) => (
                <tr
                  key={(item as Record<string, unknown>).id as string || idx}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors duration-150',
                    onRowClick && 'cursor-pointer hover:bg-[var(--table-row-hover)]',
                  )}
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-5 py-3.5 text-[var(--foreground)]', col.className)}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-border-dark">
          <p className="text-xs text-muted">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(0)} disabled={page === 0} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-dark-tertiary">
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-dark-tertiary">
              <ChevronLeft size={16} />
            </button>
            {getPageNumbers().map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-150',
                  p === page
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-dark-tertiary',
                )}
              >
                {p + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-dark-tertiary">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-dark-tertiary">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
