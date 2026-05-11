'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

interface Campaign {
  id: number;
  slug: string;
  title: string;
  image: string;
  target_amount: string;
  raised_amount: string;
  progress_percent: number;
  is_featured: boolean;
  is_active: boolean;
}

export default function CampaignsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(slug: string) {
    if (!confirm('Delete this campaign?')) return;
    try { await adminApi.cmsCampaigns.delete(slug); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Campaign>[] = [
    { key: 'image', label: '', render: (c) => c.image ? <img src={mediaUrl(c.image)} alt="" className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-gray-100 rounded" /> },
    { key: 'title', label: 'Campaign' },
    { key: 'target_amount', label: 'Target', render: (c) => `PKR ${Number(c.target_amount).toLocaleString()}` },
    { key: 'raised_amount', label: 'Raised', render: (c) => <span className="font-bold text-green-600">PKR {Number(c.raised_amount).toLocaleString()}</span> },
    { key: 'progress_percent', label: 'Progress', render: (c) => (
      <div className="w-24">
        <div className="text-xs">{c.progress_percent.toFixed(0)}%</div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-dwt-500" style={{ width: `${Math.min(100, c.progress_percent)}%` }} />
        </div>
      </div>
    )},
    { key: 'is_featured', label: 'Featured', render: (c) => c.is_featured ? <Badge variant="success">Yes</Badge> : '—' },
    { key: 'is_active', label: 'Active', render: (c) => <Badge variant={c.is_active ? 'success' : 'muted'}>{c.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (c) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/campaigns/${c.slug}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(c.slug)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Donation Campaigns">
      <DataTable<Campaign>
        fetcher={(p) => adminApi.cmsCampaigns.list(p)}
        columns={columns}
        searchPlaceholder="Search campaigns..."
        addLink="/admin/cms/campaigns/new"
        addLabel="New Campaign"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
