'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Driver {
  id: number;
  name: string;
  contact: string;
  email: string;
  license_number: string;
  license_expiry: string;
  vehicle_assigned: string;
  shift_display: string;
  joining_date: string;
  base_salary: string;
  is_active: boolean;
}

export default function DriversPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this driver?')) return;
    try { await adminApi.drivers.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Driver>[] = [
    { key: 'name', label: 'Name' },
    { key: 'contact', label: 'Contact' },
    { key: 'license_number', label: 'License' },
    { key: 'vehicle_assigned', label: 'Vehicle', render: (d) => d.vehicle_assigned || '—' },
    { key: 'shift_display', label: 'Shift' },
    { key: 'base_salary', label: 'Salary (PKR)', render: (d) => Number(d.base_salary).toLocaleString() },
    {
      key: 'is_active', label: 'Status',
      render: (d) => <Badge variant={d.is_active ? 'success' : 'muted'}>{d.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', label: 'Actions', className: 'w-24',
      render: (d) => (
        <div className="flex gap-1">
          <Link href={`/admin/drivers/${d.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(d.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Drivers">
      <DataTable<Driver>
        fetcher={(p) => adminApi.drivers.list(p)}
        columns={columns}
        searchPlaceholder="Search drivers..."
        addLink="/admin/drivers/new"
        addLabel="Add Driver"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
