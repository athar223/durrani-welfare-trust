'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Volunteer {
  id: number;
  name: string;
  role_display: string;
  contact: string;
  email: string;
  status: string;
  status_display: string;
  joining_date: string;
}

export default function VolunteersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this volunteer?')) return;
    try { await adminApi.volunteers.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Volunteer>[] = [
    { key: 'name', label: 'Name' },
    { key: 'role_display', label: 'Role' },
    { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email', render: (v) => v.email || '—' },
    { key: 'joining_date', label: 'Joined' },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={statusVariant(v.status)}>{v.status_display}</Badge>,
    },
    {
      key: 'actions', label: 'Actions', className: 'w-24',
      render: (v) => (
        <div className="flex gap-1">
          <Link href={`/admin/volunteers/${v.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(v.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Volunteers">
      <DataTable<Volunteer>
        fetcher={(p) => adminApi.volunteers.list(p)}
        columns={columns}
        searchPlaceholder="Search volunteers..."
        addLink="/admin/volunteers/new"
        addLabel="Add Volunteer"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
