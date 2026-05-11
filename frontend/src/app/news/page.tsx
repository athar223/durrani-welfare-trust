'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

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

const categories = ['all', 'news', 'announcement', 'event', 'campaign', 'story'];

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params: any = { ordering: '-published_at' };
    if (activeCategory !== 'all') params.category = activeCategory;
    publicApi
      .getNews(params)
      .then((res) => setPosts(res.data.results || res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <PublicLayout>
      <PageHeader
        title="News & Announcements"
        subtitle="Stay updated with our latest news, events, and welfare activities"
        breadcrumb="Updates"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-page">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-dwt-500 text-white shadow-soft'
                    : 'bg-white text-gray-700 hover:bg-dwt-50'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No news posts available in this category.</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
