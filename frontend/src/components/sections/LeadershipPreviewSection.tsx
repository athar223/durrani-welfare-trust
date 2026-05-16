import Link from 'next/link';
import { ArrowRight, Award, Shield } from 'lucide-react';

const leaders = [
  {
    initials: 'WD',
    name: 'Mr. Waheed Faraz Durrani',
    role: 'Chairman & Founder',
    bio: 'Founded DWT in 2017 in Konodas, Gilgit-Baltistan after dedicating his life to ensuring no orphan child grows up without shelter, care, and love.',
    photo: '/team/chairman.jpeg',
  },
  {
    initials: 'AD',
    name: 'Ms. Aman Faraz Durrani',
    role: 'CEO & Trustee',
    bio: 'Took the reins at age 19 and has grown DWT into a nationally recognised welfare institution — ISPR Pride of Pakistan Award 2025, EVE Vision Award 2026.',
    photo: '/team/ceo.jpeg',
    badges: ['ISPR 2025', 'EVE Vision 2026'],
  },
];

export default function LeadershipPreviewSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Award size={14} /> Leadership
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Visionary leaders guiding the Trust toward greater impact, accountability, and service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {leaders.map((l) => (
            <div key={l.name} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
              {/* Photo banner */}
              <div className="relative bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 flex flex-col items-center">
                {l.photo ? (
                  <img
                    src={l.photo}
                    alt={l.name}
                    className="w-28 h-28 rounded-full object-cover shadow-card border-4 border-white/90"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/95 text-dwt-700 flex items-center justify-center font-heading font-bold text-3xl shadow-card">
                    {l.initials}
                  </div>
                )}
                {l.badges && (
                  <div className="flex gap-2 mt-3">
                    {l.badges.map((b) => (
                      <span key={b} className="text-xs bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full font-semibold">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 text-center">
                <h3 className="font-heading font-bold text-xl mb-1">{l.name}</h3>
                <p className="text-dwt-600 text-sm font-semibold mb-3">{l.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{l.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about/team" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
            View Full Team <ArrowRight size={16} />
          </Link>
          <Link href="/about/founder-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
            <Shield size={16} /> Founder's Message
          </Link>
        </div>
      </div>
    </section>
  );
}
