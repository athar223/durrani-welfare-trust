'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

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

export default function NewsSection() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getNews({ ordering: '-published_at', page_size: 3 })
      .then((res) => {
        const data = res.data.results || res.data;
        setPosts(data.slice(0, 3));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section className="section-padding bg-dwt-50">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Latest Updates</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2">News & Announcements</h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors"
          >
            View All News <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden group">
              {post.cover_image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={mediaUrl(post.cover_image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-dwt-50 text-dwt-700 rounded font-semibold">
                    {post.category_display}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {new Date(post.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-dwt-500 transition-colors">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
                <Link
                  href={`/news/${post.slug}`}
                  className="inline-flex items-center gap-1 text-dwt-500 font-semibold text-sm hover:text-dwt-700"
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
