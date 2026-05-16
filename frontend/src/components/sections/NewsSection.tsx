'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

const NEWS_FALLBACK: Record<string, string> = {
  'pride-of-pakistan-award-ispr-2025': '/gallery/girls-certificates.jpeg',
  'eve-vision-award-2026':             '/gallery/eve-vision-award.jpeg',
  'qurbani-drive-eid-ul-adha':         '/gallery/qurbani-distribution.jpeg',
  'ramadan-ration-distribution':       '/gallery/food-distribution.jpeg',
  'new-beginning-marriage-support':    '/gallery/marriage-support.jpeg',
};

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  summary: string;
  cover_image: string | null;
  author: string;
  published_at: string;
}

const STATIC_NEWS: NewsPost[] = [
  { id: 1, slug: 'pride-of-pakistan-award-ispr-2025', title: 'DWT CEO Receives ISPR Pride of Pakistan Award 2025',    category: 'news',         category_display: 'News',         summary: 'Ms. Aman Faraz Durrani was honoured with the prestigious ISPR Pride of Pakistan Award for outstanding welfare service to orphan girls and families in Gilgit-Baltistan.', cover_image: null, author: 'DWT Communications', published_at: '2025-08-14' },
  { id: 2, slug: 'eve-vision-award-2026',              title: 'International EVE Vision Award 2026',                   category: 'news',         category_display: 'News',         summary: 'Durrani Welfare Trust CEO Ms. Aman Faraz Durrani received the International EVE Vision Award for excellence in social entrepreneurship and women empowerment.',            cover_image: null, author: 'DWT Communications', published_at: '2026-01-15' },
  { id: 3, slug: 'ramadan-ration-distribution',        title: 'Ramadan 2025 Ration Drive Reaches 3,000+ Families',    category: 'announcement', category_display: 'Announcement', summary: 'Durrani Welfare Trust distributed Ramadan food packages to over 3,000 families across Gilgit-Baltistan. Distribution teams reached remote villages in the region.',      cover_image: null, author: 'DWT Field Team',     published_at: '2025-04-10' },
];

export default function NewsSection() {
  const [posts, setPosts] = useState<NewsPost[]>(STATIC_NEWS);

  useEffect(() => {
    publicApi
      .getNews({ ordering: '-published_at', page_size: 3 })
      .then((res) => {
        const data = res.data.results || res.data;
        if (data.length > 0) setPosts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <div>
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Newspaper size={14} /> Latest Updates
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2">News & Announcements</h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors flex-shrink-0">
            View All News <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const imgSrc = post.cover_image ? mediaUrl(post.cover_image) : (NEWS_FALLBACK[post.slug] ?? null);
            return (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-dwt-50 flex items-center justify-center">
                      <Newspaper size={36} className="text-dwt-300" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="px-2.5 py-1 bg-dwt-50 text-dwt-700 rounded-full font-semibold">
                      {post.category_display}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.published_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-dwt-600 transition-colors leading-snug">
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.summary}</p>
                  <Link href={`/news/${post.slug}`} className="inline-flex items-center gap-1 text-dwt-500 font-semibold text-sm hover:text-dwt-700">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
