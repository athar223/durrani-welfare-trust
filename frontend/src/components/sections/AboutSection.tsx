'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { publicApi } from '@/lib/api';

interface AboutSectionData {
  id: number;
  section: string;
  title: string;
  content: string;
}

const FALLBACK_CONTENT =
  'Durrani Welfare Trust is a registered NGO founded in 2017 in Konodas, Gilgit-Baltistan by ' +
  'Mr. Waheed Faraz Durrani, who lost his own parents at the age of four months. From his ' +
  'childhood struggles emerged a lifelong dream: that no child should grow up without shelter, ' +
  'care, and affection.\n\nToday, alongside his daughter Aman Faraz Durrani, the Trust shelters over 50 ' +
  'orphan girls and serves thousands of families across Gilgit-Baltistan, continuing to expand ' +
  'its mission of humanity and welfare.';

const highlights = [
  'Orphanage for 50+ girls — shelter, education & healthcare',
  'Free 24/7 ambulance — over 5,000 patients served',
  'Women empowerment — Rawasia Waheed HUB (UNICEF accredited)',
  'Ramadan rations for 3,000+ families since 2017',
  'Pride of Pakistan Award by ISPR 2025',
];

export default function AboutSection() {
  const [content, setContent] = useState(FALLBACK_CONTENT);

  useEffect(() => {
    publicApi
      .getAboutSections()
      .then((res) => {
        const data: AboutSectionData[] = res.data.results ?? res.data;
        const about = data.find((s) => s.section === 'about');
        if (about?.content) setContent(about.content);
      })
      .catch(() => {});
  }, []);

  const paragraphs = content.split('\n\n').filter(Boolean).slice(0, 2);

  return (
    <section id="about" className="section-padding bg-white overflow-hidden">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left: Photo with stats overlay */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src="/gallery/orphanage-girls.jpeg"
                alt="Girls at Durrani Welfare Trust Orphanage"
                loading="lazy"
                className="w-full h-[480px] object-cover"
              />
              {/* Green overlay gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-dwt-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-heading font-bold text-2xl mb-1">50+ Girls in Our Care</p>
                <p className="text-sm text-gray-200">Given shelter, love, education & a brighter future</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-4 right-4 xl:-top-4 xl:-right-4 bg-dwt-500 text-white rounded-2xl p-4 shadow-card text-center">
              <div className="font-heading font-bold text-3xl leading-none">2017</div>
              <div className="text-xs mt-1 text-dwt-100">Founded</div>
            </div>

            {/* Second small photo */}
            <div className="absolute bottom-6 right-6 xl:-bottom-6 xl:-right-6 w-32 h-32 xl:w-40 xl:h-40 rounded-xl overflow-hidden shadow-card border-4 border-white hidden xl:block">
              <img src="/gallery/infant-care.jpeg" alt="Infant care" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right: Story */}
          <div>
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Heart size={14} /> Our Story
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-3 mb-5 leading-snug">
              From One Orphan's Dream to<br />
              <span className="text-dwt-600">Thousands Served</span>
            </h2>

            {paragraphs.map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-base mb-4">{para}</p>
            ))}

            <ul className="space-y-3 mb-8 mt-6">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-dwt-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                Read Our Full Story <ArrowRight size={16} />
              </Link>
              <Link href="/about/founder-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                Founder's Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
