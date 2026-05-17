'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Award { id: number; title: string; organization: string; year: string; order: number; is_active: boolean; }

export default function CMSAwardsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this award?')) return;
    try { await adminApi.awards.delete(id); toast.success('Deleted'); setRefreshKey(k => k + 1); }
    catch { toast.error('Failed to delete'); }
  }

  const columns: Column<Award>[] = [
    { key: 'title', label: 'Award' },
    { key: 'organization', label: 'Organisation' },
    { key: 'year', label: 'Year' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (a) => <Badge variant={a.is_active ? 'success' : 'muted'}>{a.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (a) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/awards/${a.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(a.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Awards & Recognition">
      <DataTable<Award>
        fetcher={(p) => adminApi.awards.list(p)}
        columns={columns}
        searchPlaceholder="Search awards..."
        addLink="/admin/cms/awards/new"
        addLabel="Add Award"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
