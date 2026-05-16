import { Award, Shield, Star } from 'lucide-react';

const awards = [
  {
    icon: Shield,
    image: '/gallery/girls-certificates.jpeg',
    title: 'Pride of Pakistan Award',
    body: 'Awarded by ISPR (Inter Services Public Relations) during the 78th Independence Day celebrations — "Marka-e-Haq" — for outstanding humanitarian service.',
    year: '2025',
    color: 'from-green-600 to-green-700',
    badge: 'ISPR',
  },
  {
    icon: Star,
    image: '/gallery/eve-vision-award.jpeg',
    title: 'International EVE Vision Award',
    body: 'Recognised by Vision of Women & Sahiba Writing Squad as an inspiring woman leader with outstanding global achievement.',
    year: '2026',
    color: 'from-purple-600 to-purple-700',
    badge: 'International',
  },
  {
    icon: Award,
    image: '/gallery/safe-families.jpeg',
    title: 'UNICEF Safe Families Certification',
    body: 'Certified by UNICEF and the Social Welfare Department for our Safe Children and Safe Families training programmes under the Rawasia Waheed HUB.',
    year: '2024',
    color: 'from-blue-600 to-blue-700',
    badge: 'UNICEF',
  },
];

export default function AwardsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Award size={14} /> Recognition & Awards
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-3">
            Nationally & Globally Recognised
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Durrani Welfare Trust's work has earned recognition from the Pakistan Army,
            international women's organisations, and UN agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {awards.map((award) => {
            const Icon = award.icon;
            return (
              <div key={award.title} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow">
                {/* Photo */}
                <div className={`relative h-44 bg-gradient-to-br ${award.color} overflow-hidden`}>
                  <img src={award.image} alt={award.title} className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-2">
                      <Icon size={28} />
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{award.badge} · {award.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-3">{award.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{award.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
