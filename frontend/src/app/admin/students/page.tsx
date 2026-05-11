'use client';
import { useState } from 'react';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge, { statusVariant } from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface Student {
  id: number;
  full_name: string;
  father_name: string;
  age?: number;
  date_of_birth?: string;
  gender: string;
  education_level: string;
  education_level_display: string;
  guardian_name: string;
  guardian_contact: string;
  admission_date: string;
  is_active: boolean;
}

export default function StudentsListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(id: number) {
    if (!confirm('Delete this student?')) return;
    try {
      await adminApi.students.delete(id);
      toast.success('Student deleted');
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error('Failed to delete');
    }
  }

  const columns: Column<Student>[] = [
    { key: 'full_name', label: 'Name', render: (s) => s.full_name },
    { key: 'father_name', label: 'Father Name' },
    { key: 'education_level_display', label: 'Education' },
    { key: 'guardian_contact', label: 'Contact' },
    { key: 'admission_date', label: 'Joined' },
    {
      key: 'is_active',
      label: 'Status',
      render: (s) => (
        <Badge variant={s.is_active ? 'success' : 'muted'}>
          {s.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-32',
      render: (s) => (
        <div className="flex gap-1">
          <Link href={`/admin/students/${s.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View">
            <Eye size={16} />
          </Link>
          <Link href={`/admin/students/${s.id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit">
            <Edit size={16} />
          </Link>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Students"
      actions={
        <Link href="/admin/students/attendance" className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-dwt-600 hover:bg-dwt-50 rounded-lg">
          <Download size={14} /> Attendance
        </Link>
      }
    >
      <DataTable<Student>
        fetcher={(p) => adminApi.students.list(p)}
        columns={columns}
        searchPlaceholder="Search by name..."
        addLink="/admin/students/new"
        addLabel="Add Student"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
