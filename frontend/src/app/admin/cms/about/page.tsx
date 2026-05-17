'use client';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi } from '@/lib/api';

interface AboutSection { id: number; section: string; section_display: string; title: string; is_active: boolean; }

export default function CMSAboutPage() {
  const columns: Column<AboutSection>[] = [
    { key: 'section_display', label: 'Section' },
    { key: 'title', label: 'Title' },
    { key: 'is_active', label: 'Active', render: (s) => <Badge variant={s.is_active ? 'success' : 'muted'}>{s.is_active ? 'Yes' : 'No'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-20',
      render: (s) => (
        <Link href={`/admin/cms/about/${s.section}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded inline-flex">
          <Edit size={16} />
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout title="About Sections">
      <DataTable<AboutSection>
        fetcher={() => adminApi.aboutSections.list()}
        columns={columns}
        searchPlaceholder="Search sections..."
      />
    </AdminLayout>
  );
}
