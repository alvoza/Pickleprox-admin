'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { capitalize, formatDate } from '@/lib/utils';
import type { Tip, TipCategory } from '@/types/models';

const categoryBadgeVariant = (cat: string) => {
  switch (cat) {
    case 'technique': return 'orange' as const;
    case 'strategy': return 'info' as const;
    case 'fitness': return 'success' as const;
    case 'equipment': return 'warning' as const;
    case 'etiquette': return 'default' as const;
    default: return 'default' as const;
  }
};

const CATEGORIES: TipCategory[] = ['technique', 'strategy', 'fitness', 'equipment', 'etiquette'];

export default function TipsPage() {
  const router = useRouter();
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { loadTips(); }, []);

  async function loadTips() {
    const result = await api.admin.getTips();
    if (result.data) setTips(result.data.tips);
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    await api.admin.deleteTip(id);
    setTips(tips.filter(t => t.id !== id));
    setDeleteConfirm(null);
  }

  const columns: Column<Tip & Record<string, unknown>>[] = [
    { key: 'content', header: 'Tip Content', render: (tip) => <p className="max-w-md text-sm line-clamp-2">{tip.content}</p> },
    { key: 'category', header: 'Category', sortable: true, render: (tip) => <Badge variant={categoryBadgeVariant(tip.category)}>{capitalize(tip.category)}</Badge> },
    { key: 'createdAt', header: 'Created', sortable: true, render: (tip) => <span className="text-sm text-muted">{formatDate(tip.createdAt)}</span> },
    {
      key: 'actions', header: '', className: 'w-24',
      render: (tip) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); router.push(`/tips/${tip.id}`); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary" title="Edit"><Pencil size={15} /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(tip.id); }} className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Delete"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const filtered = filter === 'all' ? tips : tips.filter(t => t.category === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tips"
        subtitle={`${tips.length} tips`}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Tips' }]}
        actions={<Button onClick={() => router.push('/tips/new')}><Plus size={16} />Add Tip</Button>}
      />

      <DataTable
        data={filtered as (Tip & Record<string, unknown>)[]}
        columns={columns}
        searchable searchPlaceholder="Search tips..." searchKeys={['content']}
        isLoading={isLoading} emptyMessage="No tips found"
        filterTabs={[{ label: 'All', value: 'all' }, ...CATEGORIES.map(c => ({ label: capitalize(c), value: c }))]}
        activeFilter={filter} onFilterChange={setFilter}
        onRowClick={(tip) => router.push(`/tips/${tip.id}`)}
      />

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Tip" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">Are you sure you want to delete this tip? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
