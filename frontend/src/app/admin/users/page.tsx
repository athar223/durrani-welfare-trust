'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  role_display: string;
  phone: string;
  is_active: boolean;
}

export default function UsersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(id: number) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try { await adminApi.users.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch (err: any) { toast.error(err.response?.data?.detail || 'Failed'); }
  }
  async function toggleActive(u: User) {
    try {
      await adminApi.users.update(u.id, { is_active: !u.is_active });
      toast.success(u.is_active ? 'Deactivated' : 'Activated');
      setRefreshKey(k => k+1);
    } catch { toast.error('Failed'); }
  }

  const columns: Column<User>[] = [
    { key: 'username', label: 'Username' },
    { key: 'first_name', label: 'Name', render: (u) => `${u.first_name} ${u.last_name}`.trim() || '—' },
    { key: 'email', label: 'Email', render: (u) => u.email || '—' },
    { key: 'phone', label: 'Phone', render: (u) => u.phone || '—' },
    { key: 'role_display', label: 'Role', render: (u) => <Badge variant={u.role === 'admin' ? 'primary' : 'muted'}>{u.role_display}</Badge> },
    {
      key: 'is_active', label: 'Status',
      render: (u) => (
        <button onClick={() => toggleActive(u)} className="cursor-pointer">
          <Badge variant={u.is_active ? 'success' : 'muted'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
        </button>
      ),
    },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (u) => (
        <div className="flex gap-1">
          <Link href={`/admin/users/${u.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(u.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="User Management">
      <DataTable<User>
        fetcher={(p) => adminApi.users.list(p)}
        columns={columns}
        searchPlaceholder="Search users..."
        searchParam="search"
        addLink="/admin/users/new"
        addLabel="Add User"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
