'use client';
import { useState } from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Salary {
  id: number;
  employee_name: string;
  employee_type_display: string;
  month: string;
  base_salary: string;
  allowances: string;
  deductions: string;
  bonus: string;
  net_salary: string;
  status: string;
  status_display: string;
}

export default function SalariesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function markPaid(id: number) {
    try {
      await adminApi.salaries.update(id, { status: 'paid', payment_date: new Date().toISOString().slice(0,10) });
      toast.success('Marked as paid');
      setRefreshKey(k => k+1);
    } catch { toast.error('Failed'); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this record?')) return;
    try { await adminApi.salaries.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Salary>[] = [
    { key: 'employee_name', label: 'Employee' },
    { key: 'employee_type_display', label: 'Type' },
    { key: 'month', label: 'Month' },
    { key: 'base_salary', label: 'Base (PKR)', render: (s) => Number(s.base_salary).toLocaleString() },
    { key: 'net_salary', label: 'Net (PKR)', render: (s) => <span className="font-bold text-dwt-700">{Number(s.net_salary).toLocaleString()}</span> },
    {
      key: 'status', label: 'Status',
      render: (s) => <Badge variant={statusVariant(s.status)}>{s.status_display}</Badge>,
    },
    {
      key: 'actions', label: 'Actions', className: 'w-32',
      render: (s) => (
        <div className="flex gap-1">
          {s.status !== 'paid' && (
            <button onClick={() => markPaid(s.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Mark Paid">
              <CheckCircle size={16} />
            </button>
          )}
          <Link href={`/admin/salaries/${s.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Salary Records">
      <DataTable<Salary>
        fetcher={(p) => adminApi.salaries.list(p)}
        columns={columns}
        searchPlaceholder="Search by employee..."
        addLink="/admin/salaries/new"
        addLabel="Add Salary"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
