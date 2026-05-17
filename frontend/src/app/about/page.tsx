'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Eye, Home, Truck, Users, GraduationCap, History, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi } from '@/lib/api';

interface AboutSectionData {
  section: string;
  title: string;
  content: string;
}


const STATIC_ABOUT = {
  title: 'About Durrani Welfare Trust',
  content:
    'Durrani Welfare Trust is a registered NGO founded in 2017 in Konodas by Waheed Faraz Durrani. ' +
    'Having lost his own parents at just four months old, he turned his childhood struggles into a ' +
    'lifelong mission: ensuring that no child grows up without shelter, care, education, and affection.\n\n' +
    'Today, alongside his daughter Aman Faraz Durrani, the Trust continues to serve humanity across ' +
    'Gilgit-Baltistan, providing hope and support to thousands of deserving families.',
};

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSectionData[]>([]);

  useEffect(() => {
    publicApi
      .getAboutSections()
      .then((res) => {
        const data: AboutSectionData[] = res.data.results ?? res.data;
        setSections(data);
      })
      .catch(() => setSections([]));
  }, []);

  const aboutSection = sections.find((s) => s.section === 'about');
  const missionSection = sections.find((s) => s.section === 'mission');
  const visionSection = sections.find((s) => s.section === 'vision');
  const valuesSection = sections.find((s) => s.section === 'values');

  const storyContent = aboutSection?.content ?? STATIC_ABOUT.content;

  return (
    <PublicLayout>
      <PageHeader
        title="About Durrani Welfare Trust"
        subtitle="Be-Saharon Ka Sahara — The support of the unsupported"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        image="/gallery/orphanage-girls.jpeg"
      />

      {/* Sub-pages navigation */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="container-page max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: History,      label: 'Our History',     href: '/about/history' },
              { icon: Eye,          label: 'Vision & Mission', href: '/about/vision-mission' },
              { icon: Users,        label: 'Our Team',         href: '/about/team' },
              { icon: MessageSquare, label: "Founder's Message", href: '/about/founder-message' },
              { icon: FileText,     label: 'Annual Reports',   href: '/about/annual-reports' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-soft hover:shadow-card hover:text-dwt-600 transition-all text-center group"
                >
                  <Icon size={24} className="text-dwt-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-dwt-600">{item.label}</span>
                  <ArrowRight size={14} className="text-dwt-300 group-hover:text-dwt-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="mb-12">
            <h2 className="font-heading font-bold text-3xl mb-6 text-dwt-800">Our Story</h2>
            {storyContent.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-lg mt-4">
                {para}
              </p>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {missionSection && (
              <div className="card p-8">
                <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500 mb-4">
                  <Target size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{missionSection.title}</h3>
                <p className="text-gray-600 leading-relaxed">{missionSection.content}</p>
              </div>
            )}
            {visionSection && (
              <div className="card p-8">
                <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500 mb-4">
                  <Eye size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{visionSection.title}</h3>
                <p className="text-gray-600 leading-relaxed">{visionSection.content}</p>
              </div>
            )}
            {!missionSection && (
              <div className="card p-8">
                <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500 mb-4">
                  <Target size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To protect and nurture orphaned children, newborns, widows, and underprivileged families
                  by providing shelter, quality education, healthcare, ambulance services, and skill
                  development — promoting dignity through collective compassion.
                </p>
              </div>
            )}
            {!visionSection && (
              <div className="card p-8">
                <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500 mb-4">
                  <Eye size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A Pakistan where every child grows up with love, security, and the opportunity to build
                  a bright future — regardless of whether they have parents or not.
                </p>
              </div>
            )}
          </div>

          {valuesSection && (
            <div className="mb-16">
              <h2 className="font-heading font-bold text-3xl mb-6 text-dwt-800">{valuesSection.title}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {valuesSection.content.split('\n\n').filter(Boolean).map((block, i) => {
                  const [heading, ...rest] = block.split(':');
                  return (
                    <div key={i} className="card p-6">
                      <h4 className="font-heading font-bold text-dwt-700 mb-2">{heading.trim()}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{rest.join(':').trim()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <h2 className="font-heading font-bold text-3xl mb-6 text-dwt-800">Our Key Programmes</h2>
          <div className="space-y-6 mb-16">
            {[
              { icon: Home, title: 'Orphanage for Girls', desc: 'Safe home for 50+ orphan girls with shelter, education, healthcare, and a loving family environment in Gilgit-Baltistan.' },
              { icon: GraduationCap, title: 'Education', desc: 'Toddler Programme, Pre-School, and Primary education through Madrasa Fatima lil Banat and partner schools.' },
              { icon: Truck, title: 'Free Ambulance Services', desc: '24/7 free emergency ambulance — over 5,000 patients served. Call: 03129700108.' },
              { icon: Users, title: 'Women Empowerment', desc: 'Rawasia Waheed HUB — sewing, embroidery training, and Safe Families Programme (UNICEF accredited).' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-dwt-700 to-dwt-500 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Be Part of Our Mission</h2>
            <p className="text-lg text-gray-100 mb-6 max-w-2xl mx-auto">
              Whether you donate, volunteer, or spread the word, your support helps us reach
              those who need it most. Contact: <a href="tel:03129700108" className="font-bold underline">03129700108</a>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Donate Now
              </Link>
              <Link href="/volunteer" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
