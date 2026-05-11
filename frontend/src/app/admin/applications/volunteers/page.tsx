'use client';
import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface App {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  availability: string;
  status: string;
  status_display: string;
  submitted_at: string;
}

export default function VolunteerApplicationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewing, setViewing] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('');

  async function approve(id: number) {
    if (!confirm('Approve and add to Volunteers?')) return;
    try { await adminApi.approveVolunteerApp(id); toast.success('Approved'); setRefreshKey(k => k+1); setViewing(null); }
    catch { toast.error('Failed'); }
  }
  async function reject(id: number) {
    const notes = prompt('Rejection reason (optional):') || '';
    try { await adminApi.rejectVolunteerApp(id, notes); toast.success('Rejected'); setRefreshKey(k => k+1); setViewing(null); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<App>[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email', render: (a) => a.email || '—' },
    { key: 'availability', label: 'Availability', render: (a) => a.availability || '—' },
    { key: 'status', label: 'Status', render: (a) => <Badge variant={statusVariant(a.status)}>{a.status_display}</Badge> },
    { key: 'submitted_at', label: 'Submitted', render: (a) => new Date(a.submitted_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions', className: 'w-32',
      render: (a) => (
        <div className="flex gap-1">
          <button onClick={() => setViewing(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
          {a.status === 'pending' && (
            <>
              <button onClick={() => approve(a.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check size={16} /></button>
              <button onClick={() => reject(a.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><X size={16} /></button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Volunteer Applications">
      <div className="bg-white rounded-xl shadow-soft p-3 mb-4 flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize ${filterStatus === s ? 'bg-dwt-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      <DataTable<App>
        fetcher={(p) => adminApi.volunteerApplications.list(p)}
        columns={columns}
        searchPlaceholder="Search..."
        filterParams={filterStatus ? { status: filterStatus } : {}}
        refreshKey={refreshKey}
      />

      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl">{viewing.full_name}</h2>
              <button onClick={() => setViewing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                <Info label="Full Name" value={viewing.full_name} />
                <Info label="CNIC" value={viewing.cnic} />
                <Info label="Phone" value={viewing.phone} />
                <Info label="Email" value={viewing.email} />
                <Info label="Availability" value={viewing.availability} />
                <Info label="Status" value={viewing.status_display} />
                <Info label="Address" value={viewing.address} full />
                <Info label="Skills" value={viewing.skills} full />
                <Info label="Review Notes" value={viewing.review_notes} full />
              </dl>
              {viewing.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => approve(viewing.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                    <Check size={16} /> Approve
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
