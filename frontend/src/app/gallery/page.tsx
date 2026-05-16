'use client';
import { useEffect, useState } from 'react';
import { X, ImageIcon } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface GalleryImage {
  id: number;
  image: string;
  caption: string;
}

interface GalleryAlbum {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  images: GalleryImage[];
  image_count: number;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .getGalleryAlbums()
      .then((res) => setAlbums(res.data.results || res.data))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <PageHeader
        title="Photo Gallery"
        subtitle="Glimpses of our welfare activities, events, and community programmes across Gilgit-Baltistan"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        image="/gallery/girls-certificates.jpeg"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-page">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && albums.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No gallery albums available yet.</p>
            </div>
          )}

          {!loading && !activeAlbum && albums.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setActiveAlbum(album)}
                  className="card overflow-hidden text-left group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {album.cover_image ? (
                      <img
                        src={mediaUrl(album.cover_image)}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-dwt-500 transition-colors">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{album.description}</p>
                    )}
                    <p className="text-xs text-dwt-500 font-semibold">{album.image_count} photos</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeAlbum && (
            <div>
              <button
                onClick={() => setActiveAlbum(null)}
                className="mb-6 inline-flex items-center gap-2 text-dwt-500 font-semibold hover:text-dwt-700"
              >
                ← Back to Albums
              </button>
              <h2 className="font-heading font-bold text-3xl mb-2">{activeAlbum.title}</h2>
              {activeAlbum.description && <p className="text-gray-600 mb-8">{activeAlbum.description}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeAlbum.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setLightbox(mediaUrl(img.image))}
                    className="aspect-square overflow-hidden rounded-lg shadow-soft hover:shadow-card group"
                  >
                    <img
                      src={mediaUrl(img.image)}
                      alt={img.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox */}
          {lightbox && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                onClick={() => setLightbox(null)}
              >
                <X size={24} />
              </button>
              <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
