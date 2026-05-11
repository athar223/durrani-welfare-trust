import Link from 'next/link';
import { GraduationCap, Heart, Truck, Users, HandHeart, Stethoscope, BookOpen, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const services = [
  {
    icon: GraduationCap,
    title: 'Education Support',
    desc: 'We provide free education, books, and learning materials for underprivileged children, ensuring no child is left behind due to financial constraints.',
    features: ['Free schooling', 'Books & uniforms', 'Tuition support', 'Special needs education'],
  },
  {
    icon: BookOpen,
    title: 'Student Scholarships',
    desc: 'Merit-based and need-based scholarships for talented students pursuing higher education in various fields.',
    features: ['School-level scholarships', 'College scholarships', 'University funding', 'Merit awards'],
  },
  {
    icon: Truck,
    title: 'Ambulance Services',
    desc: 'Free emergency ambulance services available round-the-clock to serve the community in critical times.',
    features: ['24/7 availability', 'Trained drivers', 'Emergency response', 'Hospital transfers'],
  },
  {
    icon: Users,
    title: 'Community Projects',
    desc: 'Sustainable development projects designed to uplift entire communities and create lasting positive change.',
    features: ['Water sanitation', 'Skill development', 'Livelihood programs', 'Infrastructure'],
  },
  {
    icon: Heart,
    title: 'Donations & Welfare',
    desc: 'Distribution of essentials, food packages, and financial support for families in distress.',
    features: ['Food packages', 'Cash assistance', 'Clothing drives', 'Ramadan/Eid distributions'],
  },
  {
    icon: Stethoscope,
    title: 'Medical Support',
    desc: 'Healthcare services, free medical camps, and treatment assistance for those who cannot afford care.',
    features: ['Free medical camps', 'Treatment funding', 'Medicine support', 'Specialist consultations'],
  },
  {
    icon: HandHeart,
    title: 'Volunteer Programs',
    desc: 'Engage with our cause and contribute your time, skills, and passion to make a difference.',
    features: ['Field work', 'Teaching', 'Medical assistance', 'Fundraising'],
  },
  {
    icon: ShieldCheck,
    title: 'Disaster Relief',
    desc: 'Emergency relief operations and rehabilitation support during natural calamities and crises.',
    features: ['Emergency aid', 'Rehabilitation', 'Shelter support', 'Long-term recovery'],
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive welfare programs designed to serve the community"
        breadcrumb="What We Do"
      />

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="card p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-dwt-50 flex items-center justify-center text-dwt-500 flex-shrink-0">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                    {service.features.map((feat) => (
                      <li key={feat} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-dwt-500" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
