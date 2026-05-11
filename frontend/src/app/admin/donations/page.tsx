'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Donation {
  id: number;
  donor_name: string;
  contact: string;
  email: string;
  amount: string;
  date: string;
  category: string;
  category_display: string;
  payment_method_display: string;
  reference_number: string;
}

export default function DonationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this donation?')) return;
    try { await adminApi.donations.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Donation>[] = [
    { key: 'donor_name', label: 'Donor' },
    { key: 'amount', label: 'Amount (PKR)', render: (d) => <span className="font-bold text-green-600">{Number(d.amount).toLocaleString()}</span> },
    { key: 'category_display', label: 'Category', render: (d) => <Badge variant="primary">{d.category_display}</Badge> },
    { key: 'payment_method_display', label: 'Method' },
    { key: 'date', label: 'Date' },
    { key: 'reference_number', label: 'Reference', render: (d) => d.reference_number || '—' },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (d) => (
        <div className="flex gap-1">
          <Link href={`/admin/donations/${d.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(d.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Donations">
      <DataTable<Donation>
        fetcher={(p) => adminApi.donations.list(p)}
        columns={columns}
        searchPlaceholder="Search donations..."
        addLink="/admin/donations/new"
        addLabel="Add Donation"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
