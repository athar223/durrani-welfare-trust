'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  budget: string;
  expenses: string;
  beneficiaries_count: number;
  status: string;
  status_display: string;
  category_display: string;
  budget_utilization_percent: number;
}

export default function ProjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(id: number) {
    if (!confirm('Delete this project?')) return;
    try { await adminApi.projects.delete(id); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Project>[] = [
    { key: 'name', label: 'Project' },
    { key: 'category_display', label: 'Category', render: (p) => <Badge variant="primary">{p.category_display}</Badge> },
    { key: 'location', label: 'Location' },
    { key: 'budget', label: 'Budget (PKR)', render: (p) => Number(p.budget).toLocaleString() },
    { key: 'budget_utilization_percent', label: 'Utilization', render: (p) => (
      <div className="w-24">
        <div className="text-xs text-gray-500">{p.budget_utilization_percent.toFixed(0)}%</div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-dwt-500" style={{ width: `${Math.min(100, p.budget_utilization_percent)}%` }} />
        </div>
      </div>
    )},
    { key: 'beneficiaries_count', label: 'Beneficiaries' },
    {
      key: 'status', label: 'Status',
      render: (p) => <Badge variant={statusVariant(p.status)}>{p.status_display}</Badge>,
    },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (p) => (
        <div className="flex gap-1">
          <Link href={`/admin/projects/${p.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Community Projects">
      <DataTable<Project>
        fetcher={(p) => adminApi.projects.list(p)}
        columns={columns}
        searchPlaceholder="Search projects..."
        addLink="/admin/projects/new"
        addLabel="Add Project"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
