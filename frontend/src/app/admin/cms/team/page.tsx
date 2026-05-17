'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

interface TeamMember { id: number; name: string; role: string; category: string; category_display: string; order: number; is_active: boolean; photo: string | null; }

export default function CMSTeamPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this team member?')) return;
    try { await adminApi.teamMembers.delete(id); toast.success('Deleted'); setRefreshKey(k => k + 1); }
    catch { toast.error('Failed to delete'); }
  }

  const columns: Column<TeamMember>[] = [
    {
      key: 'photo', label: '', className: 'w-12',
      render: (m) => m.photo
        ? <img src={mediaUrl(m.photo)} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
        : <div className="w-10 h-10 rounded-full bg-dwt-100 flex items-center justify-center text-dwt-600 font-bold text-sm">{m.name[0]}</div>,
    },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'category_display', label: 'Category' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Active', render: (m) => <Badge variant={m.is_active ? 'success' : 'muted'}>{m.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (m) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/team/${m.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(m.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Team Members">
      <DataTable<TeamMember>
        fetcher={(p) => adminApi.teamMembers.list(p)}
        columns={columns}
        searchPlaceholder="Search team..."
        addLink="/admin/cms/team/new"
        addLabel="Add Member"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
