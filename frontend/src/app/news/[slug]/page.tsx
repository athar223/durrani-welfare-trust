'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';
import PublicLayout from '@/components/PublicLayout';

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  summary: string;
  content: string;
  cover_image: string | null;
  author: string;
  published_at: string;
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    publicApi
      .getNewsBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">Post not found</p>
          <Link href="/news" className="btn-primary">Back to News</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="bg-white">
      {post.cover_image && (
        <div className="aspect-[3/1] bg-gray-100 overflow-hidden">
          <img src={mediaUrl(post.cover_image)} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container-page max-w-4xl py-12 md:py-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-dwt-500 font-semibold mb-6 hover:text-dwt-700"
        >
          <ArrowLeft size={16} /> Back to News
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="px-3 py-1 bg-dwt-50 text-dwt-700 rounded-full font-semibold">
            {post.category_display}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} /> {post.author}
          </span>
        </div>

        <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight mb-6">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
          {post.summary}
        </p>

        <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
          {post.content}
        </div>
      </div>
    </article>
    </PublicLayout>
  );
}
