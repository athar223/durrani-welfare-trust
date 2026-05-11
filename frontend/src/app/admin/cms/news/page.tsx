'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

interface NewsPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  category_display: string;
  cover_image: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
}

export default function NewsListPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(slug: string) {
    if (!confirm('Delete this post?')) return;
    try { await adminApi.cmsNews.delete(slug); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<NewsPost>[] = [
    { key: 'cover_image', label: '', render: (p) => p.cover_image ? <img src={mediaUrl(p.cover_image)} alt="" className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-gray-100 rounded" /> },
    { key: 'title', label: 'Title' },
    { key: 'category_display', label: 'Category', render: (p) => <Badge variant="primary">{p.category_display}</Badge> },
    { key: 'published_at', label: 'Published', render: (p) => new Date(p.published_at).toLocaleDateString() },
    { key: 'is_featured', label: 'Featured', render: (p) => p.is_featured ? <Badge variant="success">Yes</Badge> : '—' },
    { key: 'is_published', label: 'Status', render: (p) => <Badge variant={p.is_published ? 'success' : 'muted'}>{p.is_published ? 'Published' : 'Draft'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (p) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/news/${p.slug}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(p.slug)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="News & Posts">
      <DataTable<NewsPost>
        fetcher={(p) => adminApi.cmsNews.list(p)}
        columns={columns}
        searchPlaceholder="Search posts..."
        addLink="/admin/cms/news/new"
        addLabel="New Post"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
