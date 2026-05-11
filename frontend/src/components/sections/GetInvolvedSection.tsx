import Link from 'next/link';
import { Heart, Users, GraduationCap, ArrowRight } from 'lucide-react';

const cards = [
  {
    icon: Heart,
    title: 'Make a Donation',
    desc: 'Your contribution directly supports our welfare programs and helps thousands of beneficiaries.',
    href: '/donate',
    cta: 'Donate Now',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Users,
    title: 'Become a Volunteer',
    desc: 'Join our team of dedicated volunteers and contribute your time, skills, and passion.',
    href: '/volunteer',
    cta: 'Apply to Volunteer',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: GraduationCap,
    title: 'Enroll a Student',
    desc: 'Apply for our student support programs, scholarships, and educational assistance.',
    href: '/enroll',
    cta: 'Apply for Enrollment',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
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
            There are many ways to support our mission. Choose what works best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-20 h-20 mx-auto mb-5 rounded-full ${card.bg} flex items-center justify-center ${card.iconColor}`}>
                  <Icon size={40} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{card.desc}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors"
                >
                  {card.cta} <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
