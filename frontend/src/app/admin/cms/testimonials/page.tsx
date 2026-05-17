'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Testimonial { id: number; name: string; quote: string; role: string; order: number; is_active: boolean; }

export default function CMSTestimonialsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this testimonial?')) return;
    try { await adminApi.testimonials.delete(id); toast.success('Deleted'); setRefreshKey(k => k + 1); }
    catch { toast.error('Failed to delete'); }
  }

  const columns: Column<Testimonial>[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'quote', label: 'Quote', render: (t) => <span className="line-clamp-2 text-sm text-gray-600">{t.quote}</span> },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (t) => <Badge variant={t.is_active ? 'success' : 'muted'}>{t.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (t) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/testimonials/${t.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(t.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Testimonials">
      <DataTable<Testimonial>
        fetcher={(p) => adminApi.testimonials.list(p)}
        columns={columns}
        searchPlaceholder="Search testimonials..."
        addLink="/admin/cms/testimonials/new"
        addLabel="Add Testimonial"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
