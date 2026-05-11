'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  background_image: string;
  order: number;
  is_active: boolean;
}

export default function HeroBannersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(id: number) {
    if (!confirm('Delete this banner?')) return;
    try { await adminApi.heroBanners.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Banner>[] = [
    { key: 'background_image', label: 'Image', render: (b) => (
      <img src={mediaUrl(b.background_image)} alt="" className="w-20 h-12 object-cover rounded" />
    )},
    { key: 'title', label: 'Title' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'order', label: 'Order' },
    {
      key: 'is_active', label: 'Status',
      render: (b) => <Badge variant={b.is_active ? 'success' : 'muted'}>{b.is_active ? 'Active' : 'Hidden'}</Badge>,
    },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (b) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/hero/${b.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(b.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Hero Banners">
      <DataTable<Banner>
        fetcher={(p) => adminApi.heroBanners.list(p)}
        columns={columns}
        searchPlaceholder="Search..."
        addLink="/admin/cms/hero/new"
        addLabel="Add Banner"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
