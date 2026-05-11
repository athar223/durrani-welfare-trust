import Link from 'next/link';
import { GraduationCap, Heart, Truck, Users, HandHeart, Stethoscope, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

const services = [
  { icon: GraduationCap, title: 'Education Support', desc: 'Free education, books, and learning materials for underprivileged children.' },
  { icon: BookOpen, title: 'Student Scholarships', desc: 'Merit and need-based scholarships for talented students.' },
  { icon: Truck, title: 'Ambulance Services', desc: 'Free emergency ambulance services for the community.' },
  { icon: Users, title: 'Community Projects', desc: 'Sustainable development projects benefiting local communities.' },
  { icon: Heart, title: 'Donations & Welfare', desc: 'Distribution of essentials, food, and financial support to those in need.' },
  { icon: Stethoscope, title: 'Medical Support', desc: 'Healthcare services, medical camps, and treatment assistance.' },
  { icon: HandHeart, title: 'Volunteer Programs', desc: 'Engage with our cause and contribute your time and skills.' },
  { icon: ShieldCheck, title: 'Disaster Relief', desc: 'Emergency relief and rehabilitation during natural calamities.' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            We offer a wide range of welfare services designed to address the most pressing needs
            of our communities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="card p-6 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl bg-dwt-50 flex items-center justify-center text-dwt-500 mb-4 group-hover:bg-dwt-500 group-hover:text-white transition-all">
                  <Icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="btn-primary">
            View All Services <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
