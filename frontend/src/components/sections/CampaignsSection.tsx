'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Calendar } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  target_amount: string;
  raised_amount: string;
  end_date: string | null;
  progress_percent: number;
}

export default function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getCampaigns()
      .then((res) => {
        const data = res.data.results || res.data;
        setCampaigns(data.slice(0, 3));
      })
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (campaigns.length === 0) {
    return (
      <section className="section-padding bg-dwt-50">
        <div className="container-page text-center">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Donate</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            Support a Cause
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Your generous donations help us continue our mission of serving humanity. Every contribution makes a difference.
          </p>
          <Link href="/donate" className="btn-primary">
            <Heart size={18} className="mr-2" /> Donate Now
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-dwt-50">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Active Campaigns</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Donate to a Cause</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Support our active campaigns and be part of the change.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              {c.image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img src={mediaUrl(c.image)} alt={c.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl mb-2 line-clamp-2">{c.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{c.description}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Raised: PKR {Number(c.raised_amount).toLocaleString()}</span>
                    <span>Goal: PKR {Number(c.target_amount).toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dwt-500 rounded-full transition-all"
                      style={{ width: `${c.progress_percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-dwt-500 font-bold mt-1">
                    {c.progress_percent.toFixed(0)}% funded
                  </div>
                </div>

                {c.end_date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <Calendar size={12} /> Ends: {new Date(c.end_date).toLocaleDateString()}
                  </div>
                )}

                <Link
                  href={`/donate?campaign=${c.slug}`}
                  className="block w-full text-center px-4 py-2.5 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
