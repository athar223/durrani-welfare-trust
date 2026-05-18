'use client';
import { useEffect, useState } from 'react';
import { Award, Shield, Star, Trophy } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

interface AwardItem {
  id: number;
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string | null;
}

const GRADIENTS = [
  'from-green-600 to-green-700',
  'from-purple-600 to-purple-700',
  'from-blue-600 to-blue-700',
  'from-dwt-600 to-dwt-800',
];
const ICONS = [Shield, Star, Award, Trophy];

export default function AwardsSection() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getAwards()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (data.length > 0) setAwards(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Award size={14} /> Recognition & Awards
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-3">
            Nationally & Globally Recognised
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Durrani Welfare Trust's work has earned recognition from the Pakistan Army,
            international women's organisations, and UN agencies.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, i) => {
              const Icon = ICONS[i % ICONS.length];
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const imgSrc = award.image
                ? (award.image.startsWith('http') ? award.image : mediaUrl(award.image))
                : null;
              return (
                <div key={award.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow">
                  <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {imgSrc && (
                      <img src={imgSrc} alt={award.title} loading="lazy" className="w-full h-full object-cover opacity-30" />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-2">
                        <Icon size={28} />
                      </div>
                      <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                        {award.organization} · {award.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-3">{award.title}</h3>
                    {award.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
