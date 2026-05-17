'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quote, Heart, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi, mediaUrl } from '@/lib/api';

export default function FounderMessagePage() {
  const [content, setContent] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getAboutSections()
      .then((r) => {
        const sections: any[] = r.data.results ?? r.data;
        const fm = sections.find((s: any) => s.section === 'founder_message');
        if (fm) {
          setContent(fm.content);
          if (fm.image) setPhoto(fm.image);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const photoSrc = photo ? mediaUrl(photo) : '/team/chairman.jpeg';
  const paragraphs = content ? content.split('\n\n').filter(Boolean) : [];

  return (
    <PublicLayout>
      <PageHeader
        title="Founder's Message"
        subtitle="A personal note from Mr. Waheed Faraz Durrani — Chairman and Founder of Durrani Welfare Trust"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: "Founder's Message" }]}
        image="/team/chairman.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Profile */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
                <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 text-center">
                  <img src={photoSrc} alt="Mr. Waheed Faraz Durrani" loading="lazy" className="w-40 h-40 mx-auto rounded-full object-cover shadow-card border-4 border-white/95" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-1">Mr. Waheed Faraz Durrani</h3>
                  <p className="text-dwt-600 font-semibold text-sm mb-3">Chairman & Founder</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Founded Durrani Welfare Trust in 2017 in Konodas, Gilgit-Baltistan, with a lifelong mission: that no child should grow up without shelter, care, and affection.
                  </p>
                </div>
              </div>

              <div className="bg-dwt-50 rounded-2xl p-5 border border-dwt-100">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-3">Key Initiatives</h4>
                <ul className="text-xs text-gray-700 space-y-2">
                  {[
                    'Founded DWT in 2017, Konodas, GB',
                    'Orphanage for 50+ girls — shelter, education & healthcare',
                    'Free 24/7 ambulance — 5,000+ patients served',
                    'Rawasia Waheed HUB — UNICEF accredited women empowerment',
                    'Ramadan rations for 3,000+ families since 2017',
                    'Recipient of the Pride of Pakistan Award',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-dwt-500 font-bold mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Message */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${85 + (i % 3) * 5}%` }} />
                  ))}
                </div>
              ) : (
                <>
                  {paragraphs.map((para, i) => {
                    if (para.startsWith('"') || para.startsWith('“')) {
                      return (
                        <div key={i} className="my-8 pl-6 border-l-4 border-dwt-500 bg-dwt-50 p-5 rounded-r-xl">
                          <p className="text-dwt-800 italic font-semibold leading-relaxed">{para}</p>
                        </div>
                      );
                    }
                    return (
                      <p key={i} className="text-gray-700 leading-relaxed mb-5">{para}</p>
                    );
                  })}
                </>
              )}

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-4">
                <img src={photoSrc} alt="Waheed Faraz Durrani" loading="lazy" className="w-14 h-14 rounded-full object-cover border-2 border-dwt-200" />
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">— Waheed Faraz Durrani</div>
                  <div className="text-sm text-gray-500">Chairman & Founder, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Support Our Mission
                </Link>
                <Link href="/about/ceo-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  Read CEO Message <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
