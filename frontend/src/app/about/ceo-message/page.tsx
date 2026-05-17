'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quote, Heart, ArrowRight, Award, Shield, Star } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi, mediaUrl } from '@/lib/api';

export default function CEOMessagePage() {
  const [content, setContent] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getAboutSections()
      .then((r) => {
        const sections: any[] = r.data.results ?? r.data;
        const cm = sections.find((s: any) => s.section === 'ceo_message');
        if (cm) {
          setContent(cm.content);
          if (cm.image) setPhoto(cm.image);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const photoSrc = photo ? mediaUrl(photo) : '/team/ceo.jpeg';
  const paragraphs = content ? content.split('\n\n').filter(Boolean) : [];

  return (
    <PublicLayout>
      <PageHeader
        title="CEO's Message"
        subtitle="A message from Ms. Aman Faraz Durrani — CEO & Trustee of Durrani Welfare Trust"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: "CEO's Message" }]}
        image="/gallery/girls-certificates.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Profile column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
                <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 text-center">
                  <img src={photoSrc} alt="Ms. Aman Faraz Durrani" loading="lazy" className="w-40 h-40 mx-auto rounded-full object-cover shadow-card border-4 border-white/95" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-1">Ms. Aman Faraz Durrani</h3>
                  <p className="text-dwt-600 font-semibold text-sm mb-1">CEO & Trustee</p>
                  <p className="text-xs text-gray-500 mb-3">Konodas, Gilgit-Baltistan</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Social entrepreneur and humanitarian proudly working alongside her father to serve thousands across Gilgit-Baltistan.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-2 flex items-center gap-2">
                  <Award size={16} className="text-dwt-500" /> Awards & Recognition
                </h4>
                {[
                  { icon: Shield, label: 'Pride of Pakistan Award', sub: 'ISPR · 78th Independence Day 2025' },
                  { icon: Star,   label: 'International EVE Vision Award', sub: 'Vision of Women · 2026' },
                  { icon: Award,  label: 'UNICEF Safe Families Certified', sub: 'Safe Children Programme' },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-600 flex-shrink-0">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{a.label}</div>
                        <div className="text-xs text-gray-500">{a.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-dwt-50 rounded-2xl p-5">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-3">Our Commitments</h4>
                <ul className="text-xs text-gray-700 space-y-2">
                  {['100% transparency in fund usage', 'Direct beneficiary impact', 'Zero overhead on Zakat funds', 'Annual independent audits', 'Open-door policy for donors'].map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="text-dwt-500 font-bold">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Message column */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${80 + (i % 4) * 5}%` }} />
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

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200 mt-4">
                <img src={photoSrc} alt="Aman Faraz Durrani" loading="lazy" className="w-14 h-14 rounded-full object-cover border-2 border-dwt-200" />
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">— Aman Faraz Durrani</div>
                  <div className="text-sm text-gray-500">CEO & Trustee, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Donate Now
                </Link>
                <Link href="/about/founder-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  Founder's Message <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
