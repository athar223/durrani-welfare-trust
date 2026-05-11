'use client';
import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface PD {
  id: number;
  donor_name: string;
  contact: string;
  email: string;
  amount: string;
  category: string;
  category_display: string;
  payment_method: string;
  reference_number: string;
  status: string;
  status_display: string;
  submitted_at: string;
}

export default function DonationPledgesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewing, setViewing] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('');

  async function confirm_(id: number) {
    if (!confirm('Confirm receipt and record in accounts?')) return;
    try { await adminApi.confirmDonation(id); toast.success('Confirmed'); setRefreshKey(k => k+1); setViewing(null); }
    catch { toast.error('Failed'); }
  }
  async function reject(id: number) {
    try { await adminApi.rejectDonation(id); toast.success('Rejected'); setRefreshKey(k => k+1); setViewing(null); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<PD>[] = [
    { key: 'donor_name', label: 'Donor' },
    { key: 'amount', label: 'Amount (PKR)', render: (p) => <span className="font-bold text-green-600">{Number(p.amount).toLocaleString()}</span> },
    { key: 'category_display', label: 'Category', render: (p) => <Badge variant="primary">{p.category_display}</Badge> },
    { key: 'contact', label: 'Contact', render: (p) => p.contact || '—' },
    { key: 'reference_number', label: 'Reference', render: (p) => p.reference_number || '—' },
    { key: 'status', label: 'Status', render: (p) => <Badge variant={statusVariant(p.status)}>{p.status_display}</Badge> },
    { key: 'submitted_at', label: 'Submitted', render: (p) => new Date(p.submitted_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions', className: 'w-32',
      render: (p) => (
        <div className="flex gap-1">
          <button onClick={() => setViewing(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
          {p.status === 'pending' && (
            <>
              <button onClick={() => confirm_(p.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check size={16} /></button>
              <button onClick={() => reject(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><X size={16} /></button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Donation Pledges">
      <div className="bg-white rounded-xl shadow-soft p-3 mb-4 flex gap-2 flex-wrap">
        {['', 'pending', 'confirmed', 'rejected'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize ${filterStatus === s ? 'bg-dwt-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      <DataTable<PD>
        fetcher={(p) => adminApi.publicDonations.list(p)}
        columns={columns}
        searchPlaceholder="Search pledges..."
        filterParams={filterStatus ? { status: filterStatus } : {}}
        refreshKey={refreshKey}
      />

      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl">{viewing.donor_name}</h2>
              <button onClick={() => setViewing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                <Info label="Amount" value={`PKR ${Number(viewing.amount).toLocaleString()}`} />
                <Info label="Category" value={viewing.category_display} />
                <Info label="Payment Method" value={viewing.payment_method} />
                <Info label="Reference" value={viewing.reference_number} />
                <Info label="Contact" value={viewing.contact} />
                <Info label="Email" value={viewing.email} />
                <Info label="Anonymous?" value={viewing.is_anonymous ? 'Yes' : 'No'} />
                <Info label="Status" value={viewing.status_display} />
                <Info label="Notes" value={viewing.notes} full />
              </dl>
              {viewing.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => confirm_(viewing.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                    <Check size={16} /> Confirm Donation
                  </button>
                  <button onClick={() => reject(viewing.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600">
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Info({ label, value, full }: { label: string; value: any; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-xs uppercase text-gray-500 font-semibold">{label}</dt>
      <dd className="text-gray-900 mt-0.5">{value || '—'}</dd>
    </div>
  );
}
