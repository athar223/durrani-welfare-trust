'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Eye, Heart, Users, Shield, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi } from '@/lib/api';

const STATIC_GOALS = [
  { num: '01', title: 'Safe Shelter for Orphans', desc: 'Maintain and expand our orphanage to shelter more girls in Gilgit-Baltistan with education, healthcare, and love.' },
  { num: '02', title: 'Free Healthcare Access', desc: 'Operate our 24/7 ambulance service and expand medical support for families who cannot afford it.' },
  { num: '03', title: 'Women Empowerment', desc: 'Equip women with sewing, embroidery, and vocational skills through the Rawasia Waheed HUB for financial independence.' },
  { num: '04', title: 'Clean Water & Infrastructure', desc: 'Continue building water wells in remote Gilgit-Baltistan communities as Sadqa Jaria.' },
  { num: '05', title: 'Food Security', desc: 'Distribute Ramadan rations, Eid clothing, and emergency relief to deserving families every year.' },
  { num: '06', title: 'Transparency & Trust', desc: 'Uphold the highest standards of accountability so every donor knows exactly how their contribution is used.' },
];

const VALUE_ICONS: Record<string, any> = { Inclusive: Heart, Responsible: Shield, Respectful: Users, Collaborative: Target };

export default function VisionMissionPage() {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [valuesRaw, setValuesRaw] = useState('');
  const [visionTitle, setVisionTitle] = useState('Our Vision');
  const [missionTitle, setMissionTitle] = useState('Our Mission');

  useEffect(() => {
    publicApi.getAboutSections()
      .then((r) => {
        const sections: any[] = r.data.results ?? r.data;
        const v = sections.find((s: any) => s.section === 'vision');
        const m = sections.find((s: any) => s.section === 'mission');
        const vals = sections.find((s: any) => s.section === 'values');
        if (v) { setVision(v.content); setVisionTitle(v.title); }
        if (m) { setMission(m.content); setMissionTitle(m.title); }
        if (vals) setValuesRaw(vals.content);
      })
      .catch(() => {});
  }, []);

  const parsedValues = valuesRaw
    ? valuesRaw.split('\n\n').filter(Boolean).map((block) => {
        const colonIdx = block.indexOf(':');
        const title = colonIdx > -1 ? block.slice(0, colonIdx).trim() : block;
        const desc = colonIdx > -1 ? block.slice(colonIdx + 1).trim() : '';
        const Icon = VALUE_ICONS[title] || Heart;
        return { title, desc, Icon };
      })
    : [
        { title: 'Inclusive', desc: 'Safe and nurturing environment built on inclusiveness for every child and family we serve.', Icon: Heart },
        { title: 'Responsible', desc: 'Guiding children toward a brighter future, instilling confidence and life skills.', Icon: Shield },
        { title: 'Respectful', desc: 'Built on respect, dignity, and compassion for every individual regardless of background.', Icon: Users },
        { title: 'Collaborative', desc: 'Working hand in hand with staff, volunteers, and community partners for the best care.', Icon: Target },
      ];

  return (
    <PublicLayout>
      <PageHeader
        title="Vision, Mission & Values"
        subtitle="The principles that guide every action we take at Durrani Welfare Trust"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Vision & Mission' }]}
        image="/gallery/women-training.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">

          {/* Vision */}
          <div className="grid md:grid-cols-5 gap-8 items-center mb-16">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-dwt-700 to-dwt-500 flex items-center justify-center shadow-card">
                <Eye size={64} className="text-white" />
              </div>
            </div>
            <div className="md:col-span-3">
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Our Vision</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4 leading-snug">{visionTitle}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{vision}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-14" />

          {/* Mission */}
          <div className="grid md:grid-cols-5 gap-8 items-center mb-16">
            <div className="md:col-span-3 order-2 md:order-1">
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4 leading-snug">{missionTitle}</h2>
              {mission.split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed text-lg mb-3">{p}</p>
              ))}
            </div>
            <div className="md:col-span-2 flex justify-center order-1 md:order-2">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-dwt-600 to-dwt-800 flex items-center justify-center shadow-card">
                <Target size={64} className="text-white" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-14" />

          {/* Strategic Goals */}
          <div className="mb-4">
            <div className="text-center mb-10">
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Strategic Goals</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-3">What We Are Building Toward</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {STATIC_GOALS.map((g) => (
                <div key={g.num} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-card hover:-translate-y-0.5 transition-all">
                  <div className="text-4xl font-heading font-bold text-dwt-100 mb-2">{g.num}</div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-dwt-800">{g.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-dwt-800 text-white">
        <div className="container-page max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-dwt-200 font-bold text-sm uppercase tracking-wider">Our Core Values</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-white">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {parsedValues.map((v) => {
              const Icon = v.Icon;
              return (
                <div key={v.title} className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-dwt-500/30 flex items-center justify-center">
                    <Icon size={28} className="text-dwt-200" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-white">{v.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/about/team" className="inline-flex items-center gap-2 text-dwt-200 font-semibold hover:text-white transition-colors">
              Meet the people behind these values <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
