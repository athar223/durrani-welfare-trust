'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Users, GraduationCap, Phone, ChevronDown } from 'lucide-react';
import { publicApi, mediaUrl } from '@/lib/api';

export default function HeroSection() {
  const [bgImage, setBgImage] = useState('/hero/banner.jpeg');

  useEffect(() => {
    publicApi
      .getHeroBanners()
      .then((res) => {
        const banners = res.data.results ?? res.data;
        const active = banners.find((b: any) => b.is_active) ?? banners[0];
        if (active?.background_image) {
          setBgImage(
            active.background_image.startsWith('http')
              ? active.background_image
              : mediaUrl(active.background_image)
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative text-white overflow-hidden min-h-[90vh] flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-dwt-900/92 via-dwt-900/80 to-dwt-800/60" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute top-20 right-20 w-80 h-80 border-4 border-white rounded-full" />
        <div className="absolute top-40 right-40 w-60 h-60 border-2 border-dwt-300 rounded-full" />
      </div>

      <div className="container-page relative z-10 flex-1 flex items-center py-20 md:py-28">
        <div className="grid lg:grid-cols-5 gap-12 items-center w-full">

          {/* Left: Main content */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Serving Gilgit-Baltistan Since 2017
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              <span className="text-white">Be-Saharon</span><br />
              <span className="text-white">Ka </span>
              <span className="text-dwt-200">Sahara</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-4 max-w-xl">
              Sheltering orphan girls, running free ambulance services, empowering women,
              and serving thousands of families across Gilgit-Baltistan.
            </p>
            <p className="text-sm text-dwt-200 font-semibold mb-8 italic">
              "The support of the unsupported" — Durrani Welfare Trust
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
              <Link href="/donate" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-dwt-800 font-bold rounded-lg shadow-card hover:bg-dwt-50 transition-all text-base">
                <Heart size={20} /> Donate Now
              </Link>
              <Link href="/volunteer" className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white/80 text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all text-base">
                <Users size={20} /> Volunteer
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <a href="tel:03129700108" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} className="text-dwt-300" /> 03129700108
              </a>
              <span className="text-white/20">|</span>
              <Link href="/enroll" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <GraduationCap size={16} className="text-dwt-300" /> Enroll a Student
              </Link>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="lg:col-span-2 hidden lg:grid grid-cols-2 gap-4">
            {[
              { value: '50+', label: 'Orphan Girls\nin Our Care', accent: 'from-rose-500/20 to-rose-600/10' },
              { value: '3,000+', label: 'Families Fed\nEvery Ramadan', accent: 'from-amber-500/20 to-amber-600/10' },
              { value: '5,000+', label: 'Ambulance\nPatients Served', accent: 'from-blue-500/20 to-blue-600/10' },
              { value: '9+', label: 'Years of\nDedicated Service', accent: 'from-dwt-500/30 to-dwt-600/20' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`bg-gradient-to-br ${s.accent} backdrop-blur border border-white/10 rounded-2xl p-6 ${i % 2 === 1 ? 'mt-6' : ''}`}
              >
                <div className="text-4xl font-heading font-bold text-dwt-200 mb-1">{s.value}</div>
                <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-6 animate-bounce">
        <ChevronDown size={28} className="text-white/40" />
      </div>

      {/* Wave */}
      <svg className="absolute bottom-0 left-0 w-full h-16 fill-white" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z" />
      </svg>
    </section>
  );
}
