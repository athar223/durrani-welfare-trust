'use client';
import Link from 'next/link';
import { Heart, Users, GraduationCap, LogIn } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero/banner.jpeg)' }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-dwt-900/85 via-dwt-800/75 to-dwt-700/70" />
      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-dwt-400 rounded-full blur-3xl" />
      </div>

      <div className="container-page relative z-10 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-6 backdrop-blur">
              Welcome to Durrani Welfare Trust
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Serving Humanity with{' '}
              <span className="text-dwt-200">Compassion</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-xl">
              Empowering communities through education, healthcare, and welfare programs
              for women, children, and families across Pakistan.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white text-dwt-800 font-bold rounded-lg shadow-card hover:bg-dwt-50 transition-all"
              >
                <Heart size={20} /> Donate Now
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all"
              >
                <Users size={20} /> Volunteer
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/enroll"
                className="inline-flex items-center gap-2 text-white hover:text-dwt-200 transition-colors"
              >
                <GraduationCap size={18} /> Enroll a Student
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-white hover:text-dwt-200 transition-colors"
              >
                <LogIn size={18} /> Login to Management System
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="animate-slide-up hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="text-4xl font-heading font-bold text-dwt-200">500+</div>
                <div className="text-sm text-gray-200 mt-1">Students Supported</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mt-8">
                <div className="text-4xl font-heading font-bold text-dwt-200">50+</div>
                <div className="text-sm text-gray-200 mt-1">Active Volunteers</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
                <div className="text-4xl font-heading font-bold text-dwt-200">25+</div>
                <div className="text-sm text-gray-200 mt-1">Community Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mt-8">
                <div className="text-4xl font-heading font-bold text-dwt-200">10+</div>
                <div className="text-sm text-gray-200 mt-1">Years of Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-12 fill-white"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path d="M0,40 C360,80 720,0 1440,40 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
