'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Expense {
  id: number;
  description: string;
  amount: string;
  date: string;
  category_display: string;
  paid_to: string;
  payment_method_display: string;
  reference_number: string;
  approved_by: string;
}

export default function ExpensesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(id: number) {
    if (!confirm('Delete this expense?')) return;
    try { await adminApi.expenses.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Expense>[] = [
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount (PKR)', render: (e) => <span className="font-bold text-rose-600">{Number(e.amount).toLocaleString()}</span> },
    { key: 'category_display', label: 'Category', render: (e) => <Badge variant="warning">{e.category_display}</Badge> },
    { key: 'paid_to', label: 'Paid To', render: (e) => e.paid_to || '—' },
    { key: 'payment_method_display', label: 'Method' },
    { key: 'date', label: 'Date' },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (e) => (
        <div className="flex gap-1">
          <Link href={`/admin/expenses/${e.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(e.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Expenses">
      <DataTable<Expense>
        fetcher={(p) => adminApi.expenses.list(p)}
        columns={columns}
        searchPlaceholder="Search expenses..."
        addLink="/admin/expenses/new"
        addLabel="Add Expense"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
