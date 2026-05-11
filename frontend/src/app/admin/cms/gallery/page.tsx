'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable, { Column } from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

interface Album {
  id: number;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  image_count: number;
  order: number;
  is_active: boolean;
}

export default function GalleryAlbumsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleDelete(slug: string) {
    if (!confirm('Delete this album?')) return;
    try { await adminApi.cmsGallery.delete(slug); toast.success('Deleted'); setRefreshKey(k => k+1); }
    catch { toast.error('Failed'); }
  }

  const columns: Column<Album>[] = [
    { key: 'cover_image', label: '', render: (a) => a.cover_image ? <img src={mediaUrl(a.cover_image)} alt="" className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-gray-100 rounded" /> },
    { key: 'title', label: 'Album' },
    { key: 'image_count', label: 'Photos' },
    { key: 'order', label: 'Order' },
    { key: 'is_active', label: 'Status', render: (a) => <Badge variant={a.is_active ? 'success' : 'muted'}>{a.is_active ? 'Active' : 'Hidden'}</Badge> },
    {
      key: 'actions', label: '', className: 'w-24',
      render: (a) => (
        <div className="flex gap-1">
          <Link href={`/admin/cms/gallery/${a.slug}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></Link>
          <button onClick={() => handleDelete(a.slug)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Gallery Albums">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
        Albums hold photo collections. To add individual photos to an album, use the Django admin at <a href="http://localhost:8000/django-admin/cms/galleryalbum/" target="_blank" className="underline font-semibold">/django-admin/cms/galleryalbum/</a>.
      </div>
      <DataTable<Album>
        fetcher={(p) => adminApi.cmsGallery.list(p)}
        columns={columns}
        searchPlaceholder="Search albums..."
        addLink="/admin/cms/gallery/new"
        addLabel="New Album"
        refreshKey={refreshKey}
      />
    </AdminLayout>
  );
}
