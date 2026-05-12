import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';

const leaders = [
  { initials: 'WD', name: 'Mr. Waheed Faraz Durrani', role: 'Chairman & Founder', photo: '/team/chairman.jpeg' },
  { initials: 'AD', name: 'Mr. Aman Faraz Durrani', role: 'Chief Executive Officer', photo: '/team/ceo.jpeg' },
  { initials: 'AI', name: 'Mrs. Aisha Iqbal', role: 'Vice Chairperson' },
];

export default function LeadershipPreviewSection() {
  return (
    <section className="section-padding bg-gray-50">
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

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {leaders.map((l: any) => (
            <div key={l.name} className="card overflow-hidden text-center group hover:-translate-y-1 transition-transform">
              <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-8">
                {l.photo ? (
                  <img
                    src={l.photo}
                    alt={l.name}
                    className="w-28 h-28 mx-auto rounded-full object-cover shadow-card border-4 border-white/95"
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/95 text-dwt-700 flex items-center justify-center font-heading font-bold text-2xl shadow-card">
                    {l.initials}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg mb-1">{l.name}</h3>
                <p className="text-dwt-600 text-sm font-semibold">{l.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/about/team" className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700">
            View Full Team <ArrowRight size={16} />
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about/founder-message" className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700">
            Read Founder's Message <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
