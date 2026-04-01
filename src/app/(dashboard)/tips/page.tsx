'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
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
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TipCategory>('technique');

  useEffect(() => {
    loadTips();
  }, []);

  async function loadTips() {
    const result = await api.admin.getTips();
    if (result.data) setTips(result.data.tips);
    setIsLoading(false);
  }

  function openCreateModal() {
    setEditingTip(null);
    setContent('');
    setCategory('technique');
    setModalOpen(true);
  }

  function openEditModal(tip: Tip) {
    setEditingTip(tip);
    setContent(tip.content);
    setCategory(tip.category);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!content.trim()) return;
    if (editingTip) {
      const result = await api.admin.updateTip(editingTip.id, { content, category });
      if (result.data) {
        setTips(tips.map(t => t.id === editingTip.id ? { ...t, content, category, updatedAt: new Date().toISOString() } : t));
      }
    } else {
      const result = await api.admin.createTip({ content, category });
      if (result.data) {
        setTips([...tips, result.data]);
      }
    }
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    await api.admin.deleteTip(id);
    setTips(tips.filter(t => t.id !== id));
    setDeleteConfirm(null);
  }

  const columns: Column<Tip & Record<string, unknown>>[] = [
    {
      key: 'content',
      header: 'Tip Content',
      render: (tip) => (
        <p className="max-w-md text-sm line-clamp-2">{tip.content}</p>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (tip) => (
        <Badge variant={categoryBadgeVariant(tip.category)}>
          {capitalize(tip.category)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (tip) => (
        <span className="text-sm text-muted">{formatDate(tip.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (tip) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(tip as Tip); }}
            className="rounded p-1.5 text-muted hover:bg-gray-100 hover:text-brand-orange dark:hover:bg-dark-tertiary"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(tip.id); }}
            className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const filtered = filter === 'all'
    ? tips
    : tips.filter(t => t.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Tips</h1>
          <p className="text-sm text-muted">{tips.length} tips</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} />
          Add Tip
        </Button>
      </div>

      <DataTable
        data={filtered as (Tip & Record<string, unknown>)[]}
        columns={columns}
        searchable
        searchPlaceholder="Search tips..."
        searchKeys={['content']}
        isLoading={isLoading}
        emptyMessage="No tips found"
        filterTabs={[
          { label: 'All', value: 'all' },
          ...CATEGORIES.map(c => ({ label: capitalize(c), value: c })),
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTip ? 'Edit Tip' : 'Add New Tip'}
      >
        <div className="space-y-4">
          <FormField label="Content">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={textareaClasses}
              placeholder="Enter tip content..."
              rows={4}
            />
          </FormField>

          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TipCategory)}
              className={inputClasses}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{capitalize(c)}</option>
              ))}
            </select>
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()}>
              {editingTip ? 'Update' : 'Create'} Tip
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Tip"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">Are you sure you want to delete this tip? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
