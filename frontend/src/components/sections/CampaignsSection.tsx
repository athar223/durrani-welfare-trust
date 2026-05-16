'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Calendar, ArrowRight } from 'lucide-react';
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

const FALLBACK_IMAGES: Record<string, string> = {
  'sponsor-an-orphan-girl':      '/gallery/orphanage-girls.jpeg',
  'build-water-well-sadqa-jaria':'/gallery/dwt-ambulance.jpeg',
  'ambulance-fund':              '/gallery/ambulance-fleet.jpeg',
  'ramadan-rations-2025':        '/gallery/food-distribution.jpeg',
};

const STATIC_CAMPAIGNS: Campaign[] = [
  { id: 1, slug: 'sponsor-an-orphan-girl',       title: 'Sponsor an Orphan Girl',     description: 'Give an orphan girl shelter, education, and healthcare. Your monthly pledge directly supports the girls at our orphanage in Konodas.',          image: null, target_amount: '500000', raised_amount: '0', end_date: null, progress_percent: 0 },
  { id: 2, slug: 'ambulance-fund',                title: 'Keep the Ambulance Running', description: 'Our 24/7 free ambulance has served 5,000+ patients. Your donation covers fuel, maintenance, and driver salaries so it never stops.',              image: null, target_amount: '300000', raised_amount: '0', end_date: null, progress_percent: 0 },
  { id: 3, slug: 'ramadan-rations-2025',          title: 'Ramadan Rations 2025',        description: 'Help us distribute complete food packages to 3,000+ deserving families across Gilgit-Baltistan during the holy month of Ramadan.',                image: null, target_amount: '600000', raised_amount: '0', end_date: null, progress_percent: 0 },
];

export default function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(STATIC_CAMPAIGNS);

  useEffect(() => {
    publicApi
      .getCampaigns()
      .then((res) => {
        const data = res.data.results || res.data;
        if (data.length > 0) setCampaigns(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Heart size={14} /> Active Campaigns
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Support a Cause</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Your donation directly funds our active programmes. Every rupee reaches the people who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.map((c) => {
            const imgSrc = c.image ? mediaUrl(c.image) : (FALLBACK_IMAGES[c.slug] ?? null);
            return (
              <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="h-52 bg-dwt-50 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-dwt-50 to-dwt-100 flex items-center justify-center">
                      <Heart size={48} className="text-dwt-300" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-2 line-clamp-2">{c.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{c.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span className="font-semibold text-dwt-600">
                        PKR {Number(c.raised_amount).toLocaleString()} raised
                      </span>
                      <span>of PKR {Number(c.target_amount).toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-dwt-400 to-dwt-600 rounded-full transition-all"
                        style={{ width: `${Math.min(c.progress_percent, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-dwt-600 font-bold mt-1.5">
                      {c.progress_percent.toFixed(0)}% funded
                    </div>
                  </div>

                  {c.end_date && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                      <Calendar size={12} /> Ends: {new Date(c.end_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}

                  <Link
                    href={`/donate?campaign=${c.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-dwt-500 text-white font-semibold rounded-xl hover:bg-dwt-600 transition-all"
                  >
                    <Heart size={16} /> Donate Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/donate" className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors">
            View All Campaigns <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
