'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface DailyExpense {
  id: number;
  date: string;
  description: string;
  amount: string;
  category_display: string;
  paid_by: string;
  receipt_number: string;
}

export default function DailyExpensesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return;
    try { await adminApi.dailyExpenses.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<DailyExpense>[] = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category_display', label: 'Category', render: (e) => <Badge variant="warning">{e.category_display}</Badge> },
    { key: 'amount', label: 'Amount (PKR)', render: (e) => Number(e.amount).toLocaleString() },
    { key: 'paid_by', label: 'Paid By' },
    { key: 'receipt_number', label: 'Receipt', render: (e) => e.receipt_number || '—' },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (e) => (
        <div className="flex gap-1">
          <Link href={`/admin/daily-expenses/${e.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(e.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Daily Expenses">
      <DataTable<DailyExpense>
        fetcher={(p) => adminApi.dailyExpenses.list(p)}
        columns={columns}
        searchPlaceholder="Search..."
        addLink="/admin/daily-expenses/new"
        addLabel="Add Entry"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
