'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface Photo { src: string; alt: string; }

const FALLBACK_PHOTOS: Photo[] = [
  { src: '/gallery/orphanage-girls.jpeg',    alt: 'Orphan girls at DWT' },
  { src: '/gallery/ambulance-fleet.jpeg',    alt: 'DWT ambulance fleet' },
  { src: '/gallery/women-training.jpeg',     alt: 'Women empowerment training' },
  { src: '/gallery/food-distribution.jpeg',  alt: 'Food distribution' },
  { src: '/gallery/girls-certificates.jpeg', alt: 'Girls receiving certificates' },
  { src: '/gallery/marriage-support.jpeg',   alt: 'Marriage support programme' },
];

export default function GalleryPreviewSection() {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS);

  useEffect(() => {
    publicApi
      .getGalleryAlbums()
      .then((res) => {
        const albums = res.data.results ?? res.data;
        const collected: Photo[] = [];
        for (const album of albums) {
          if (album.cover_image) {
            collected.push({
              src: album.cover_image.startsWith('http') ? album.cover_image : mediaUrl(album.cover_image),
              alt: album.title,
            });
          }
          for (const img of album.images ?? []) {
            if (img.image) {
              collected.push({
                src: img.image.startsWith('http') ? img.image : mediaUrl(img.image),
                alt: img.caption || album.title,
              });
            }
          }
          if (collected.length >= 6) break;
        }
        if (collected.length > 0) setPhotos(collected.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Images size={14} /> Photo Gallery
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2">Our Work in Pictures</h2>
            <p className="text-gray-600 mt-2 max-w-xl">
              A glimpse of the lives we touch and the communities we serve across Gilgit-Baltistan.
            </p>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors flex-shrink-0">
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <Link
              key={photo.src + i}
              href="/gallery"
              className={`relative overflow-hidden rounded-xl bg-gray-100 group ${i === 0 ? 'md:row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '1 / 1.1' : '4 / 3' }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dwt-900/0 group-hover:bg-dwt-900/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-4 py-2 rounded-full">
                  {photo.alt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
