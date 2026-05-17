'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Statistic { id: number; value: string; label: string; icon: string; order: number; is_active: boolean; }

export default function CMSStatsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this statistic?')) return;
    try { await adminApi.statistics.delete(id); toast.success('Deleted'); setRefreshKey(k => k + 1); }
    catch { toast.error('Failed to delete'); }
  }

  const columns: Column<Statistic>[] = [
    { key: 'value', label: 'Value', render: (s) => <span className="font-bold text-dwt-600">{s.value}</span> },
    { key: 'label', label: 'Label' },
    { key: 'icon', label: 'Icon' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (s) => <Badge variant={s.is_active ? 'success' : 'muted'}>{s.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (s) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/stats/${s.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Statistics">
      <DataTable<Statistic>
        fetcher={(p) => adminApi.statistics.list(p)}
        columns={columns}
        searchPlaceholder="Search statistics..."
        addLink="/admin/cms/stats/new"
        addLabel="Add Statistic"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
