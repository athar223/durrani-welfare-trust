'use client';
import { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Staff {
  id: number;
  full_name: string;
  role_display: string;
  contact_number: string;
  email: string;
  joining_date: string;
  supervisor: string;
  base_salary: string;
  is_active: boolean;
}

export default function StaffListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this staff member?')) return;
    try { await adminApi.staff.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Staff>[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'role_display', label: 'Role' },
    { key: 'contact_number', label: 'Contact' },
    { key: 'email', label: 'Email', render: (s) => s.email || '—' },
    { key: 'supervisor', label: 'Supervisor', render: (s) => s.supervisor || '—' },
    { key: 'base_salary', label: 'Salary (PKR)', render: (s) => Number(s.base_salary).toLocaleString() },
    { key: 'joining_date', label: 'Joined' },
    {
      key: 'is_active', label: 'Status',
      render: (s) => <Badge variant={s.is_active ? 'success' : 'muted'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', label: 'Actions', className: 'w-32',
      render: (s) => (
        <div className="flex gap-1">
          <Link href={`/admin/staff/${s.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></Link>
          <Link href={`/admin/staff/${s.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Staff Members">
      <DataTable<Staff>
        fetcher={(p) => adminApi.staff.list(p)}
        columns={columns}
        searchPlaceholder="Search by name..."
        addLink="/admin/staff/new"
        addLabel="Add Staff"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
