'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Service { id: number; slug: string; title: string; short_description: string; order: number; is_featured: boolean; is_active: boolean; }

export default function CMSServicesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(slug: string) {
    if (!confirm('Delete?')) return;
    try { await adminApi.cmsServices.delete(slug); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Service>[] = [
    { key: 'title', label: 'Service' },
    { key: 'short_description', label: 'Description' },
    { key: 'order', label: 'Order' },
    { key: 'is_featured', label: 'Featured', render: (s) => s.is_featured ? <Badge variant="success">Yes</Badge> : '—' },
    { key: 'is_active', label: 'Active', render: (s) => <Badge variant={s.is_active ? 'success' : 'muted'}>{s.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (s) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/services/${s.slug}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(s.slug)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Services">
      <DataTable<Service>
        fetcher={(p) => adminApi.cmsServices.list(p)}
        columns={columns}
        searchPlaceholder="Search services..."
        addLink="/admin/cms/services/new"
        addLabel="New Service"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
