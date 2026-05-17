import Link from 'next/link';
import { Heart, Users, GraduationCap, ArrowRight } from 'lucide-react';

const cards = [
  {
    icon: Heart,
    title: 'Make a Donation',
    desc: 'Every rupee goes directly to orphan girls, ambulance fuel, Ramadan rations, or water wells. Choose a cause that speaks to your heart.',
    href: '/donate',
    cta: 'Donate Now',
    image: '/gallery/food-distribution.jpeg',
    color: 'from-rose-600/80 to-rose-800/80',
  },
  {
    icon: Users,
    title: 'Become a Volunteer',
    desc: 'Join our growing community of change-makers. Give your time, skills, and passion to serve orphan girls and underprivileged families.',
    href: '/volunteer',
    cta: 'Apply to Volunteer',
    image: '/gallery/women-training.jpeg',
    color: 'from-dwt-600/80 to-dwt-800/80',
  },
  {
    icon: GraduationCap,
    title: 'Enroll a Child',
    desc: 'Know an orphan girl who needs shelter, education, and care? Our admission process is simple and transparent. Contact us today.',
    href: '/enroll',
    cta: 'Apply for Enrollment',
    image: '/gallery/madrasa-building.jpeg',
    color: 'from-blue-600/80 to-blue-800/80',
  },
];

export default function GetInvolvedSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Get Involved</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            How You Can Help
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Whether you donate, volunteer, or enroll a child - your action creates a real, lasting difference
            in the lives of orphan girls and underprivileged families across Gilgit-Baltistan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="relative rounded-2xl overflow-hidden group shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 h-80">
                {/* Background photo */}
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.color}`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{card.title}</h3>
                  <p className="text-sm text-white/90 leading-relaxed mb-4 line-clamp-3">{card.desc}</p>
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-white font-bold text-sm hover:gap-3 transition-all"
                  >
                    {card.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
