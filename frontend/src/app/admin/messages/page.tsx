'use client';
import { useState } from 'react';
import { Eye, Trash2, X, Mail, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Msg {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  submitted_at: string;
}

export default function ContactMessagesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewing, setViewing] = useState<Msg | null>(null);

  async function markRead(m: Msg) {
    if (!m.is_read) {
      try { await adminApi.contactMessages.update(m.id, { is_read: true }); setRefreshKey(k => k+1); }
      catch {}
    }
    setViewing(m);
  }

  async function markReplied(id: number) {
    try { await adminApi.contactMessages.update(id, { is_replied: true }); toast.success('Marked as replied'); setRefreshKey(k => k+1); setViewing(null); }
    catch { toast.error('Failed'); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return;
    try { await adminApi.contactMessages.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Msg>[] = [
    { key: 'name', label: 'Name', render: (m) => (
      <span className={m.is_read ? 'text-gray-700' : 'font-bold text-gray-900'}>{m.name}</span>
    )},
    { key: 'subject', label: 'Subject', render: (m) => (
      <span className={m.is_read ? 'text-gray-700' : 'font-bold text-gray-900'}>{m.subject}</span>
    )},
    { key: 'email', label: 'Email' },
    { key: 'submitted_at', label: 'Received', render: (m) => new Date(m.submitted_at).toLocaleDateString() },
    {
      key: 'status', label: 'Status',
      render: (m) => m.is_replied ? <Badge variant="success">Replied</Badge> : m.is_read ? <Badge variant="info">Read</Badge> : <Badge variant="warning">New</Badge>,
    },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (m) => (
        <div className="flex gap-1">
          <button onClick={() => markRead(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
          <button onClick={() => handleDelete(m.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Contact Messages">
      <DataTable<Msg>
        fetcher={(p) => adminApi.contactMessages.list(p)}
        columns={columns}
        searchPlaceholder="Search messages..."
        refreshKey={refreshKey}
      />

      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl">{viewing.subject}</h2>
                <p className="text-sm text-gray-500">From {viewing.name} • {new Date(viewing.submitted_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-100">
                <a href={`mailto:${viewing.email}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-dwt-50 text-dwt-700 rounded-lg text-sm hover:bg-dwt-100">
                  <Mail size={14} /> {viewing.email}
                </a>
                {viewing.phone && (
                  <a href={`tel:${viewing.phone}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-dwt-50 text-dwt-700 rounded-lg text-sm hover:bg-dwt-100">
                    <Phone size={14} /> {viewing.phone}
                  </a>
                )}
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{viewing.message}</div>
              {!viewing.is_replied && (
                <div className="pt-4 border-t border-gray-200">
                  <button onClick={() => markReplied(viewing.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600">
                    <CheckCircle size={16} /> Mark as Replied
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
