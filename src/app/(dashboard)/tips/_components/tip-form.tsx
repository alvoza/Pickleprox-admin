'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FormCard } from '@/components/ui/form-card';
import { FormField, inputClasses, textareaClasses } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { capitalize } from '@/lib/utils';
import type { Tip, TipCategory } from '@/types/models';

const CATEGORIES: TipCategory[] = ['technique', 'strategy', 'fitness', 'equipment', 'etiquette'];

interface TipFormProps {
  tip?: Tip;
}

export function TipForm({ tip }: TipFormProps) {
  const router = useRouter();
  const isEditing = !!tip;

  const [content, setContent] = useState(tip?.content || '');
  const [category, setCategory] = useState<TipCategory>(tip?.category || 'technique');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    if (isEditing) {
      await api.admin.updateTip(tip.id, { content, category });
    } else {
      await api.admin.createTip({ content, category });
    }
    router.push('/tips');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Tip' : 'Add New Tip'}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Tips', href: '/tips' }, { label: isEditing ? 'Edit' : 'New' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/tips')}>Cancel</Button>
            <Button onClick={handleSave} disabled={!content.trim() || saving}>{saving ? 'Saving...' : isEditing ? 'Update Tip' : 'Create Tip'}</Button>
          </div>
        }
      />

      <FormCard title="Tip Content" description="Write a helpful tip for pickleball players">
        <FormField label="Content">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className={textareaClasses} placeholder="Enter tip content..." rows={5} />
        </FormField>
        <FormField label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value as TipCategory)} className={inputClasses}>
            {CATEGORIES.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
        </FormField>
      </FormCard>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" onClick={() => router.push('/tips')}>Cancel</Button>
        <Button onClick={handleSave} disabled={!content.trim() || saving}>{saving ? 'Saving...' : isEditing ? 'Update Tip' : 'Create Tip'}</Button>
      </div>
    </div>
  );
}
