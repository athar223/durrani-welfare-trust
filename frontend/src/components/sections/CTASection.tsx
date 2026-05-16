import Link from 'next/link';
import { Heart, Users, Phone, GraduationCap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/gallery/food-distribution.jpeg)' }}
      />
      <div className="absolute inset-0 bg-dwt-900/88" />

      <div className="container-page relative z-10 text-white text-center">
        <span className="text-dwt-200 font-bold text-sm uppercase tracking-widest">Take Action</span>
        <h2 className="font-heading font-bold text-4xl md:text-5xl mt-3 mb-5 leading-snug">
          Every Act of Kindness<br />
          <span className="text-dwt-200">Changes a Life</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of donors and volunteers who support Durrani Welfare Trust in serving
          orphan girls, needy families, and underprivileged communities across Gilgit-Baltistan.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link href="/donate" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dwt-800 font-bold rounded-lg shadow-card hover:bg-dwt-50 transition-all text-base">
            <Heart size={20} /> Donate Now
          </Link>
          <Link href="/volunteer" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all text-base">
            <Users size={20} /> Volunteer
          </Link>
          <Link href="/enroll" className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-semibold rounded-lg hover:border-white transition-all text-base">
            <GraduationCap size={20} /> Enroll a Student
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <a href="tel:03129700108" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={16} className="text-dwt-300" /> 03129700108
          </a>
          <span className="text-white/20">|</span>
          <span>Konodas, Gilgit-Baltistan, Pakistan</span>
        </div>
      </div>
    </section>
  );
}
