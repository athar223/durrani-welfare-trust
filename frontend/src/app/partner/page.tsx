import Link from 'next/link';
import { Building2, Briefcase, Heart, Users, ArrowRight, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const partnershipTypes = [
  {
    icon: Building2,
    title: 'Corporate Partnership',
    desc: 'Align your CSR goals with our impact-driven programs. We provide detailed reports for your stakeholders.',
    benefits: ['Quarterly impact reports', 'Brand visibility on our platforms', 'Employee volunteer opportunities', 'Joint media campaigns', 'Tax deduction certificates'],
  },
  {
    icon: Briefcase,
    title: 'Institutional Partnership',
    desc: 'For schools, hospitals, NGOs, and government bodies seeking program collaboration.',
    benefits: ['Joint program implementation', 'Shared resources and expertise', 'Cross-referral arrangements', 'Co-branded initiatives', 'Knowledge exchange'],
  },
  {
    icon: Heart,
    title: 'Zakat & Sadqa Partnership',
    desc: 'For institutions and high-net-worth donors who wish to entrust us with sizeable Zakat or Sadqa amounts.',
    benefits: ['Sharia-compliant fund management', 'Detailed disbursement reports', 'Direct donor-beneficiary connection', 'Personal account manager', 'Annual private briefings'],
  },
  {
    icon: Users,
    title: 'Community Partnership',
    desc: 'For local mosques, community centers, and grassroots organizations seeking to extend our work.',
    benefits: ['Local program support', 'Volunteer mobilization', 'Joint events and camps', 'Resource sharing', 'Capacity building'],
  },
];

export default function PartnerPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Partner With Us"
        subtitle="Together, we can amplify our impact and create lasting positive change"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Get Involved', href: '/volunteer' }, { label: 'Partner' }]}
        image="/gallery/women-training.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl mb-4">Why Partner With DWT?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Since 2017, Durrani Welfare Trust has built a reputation for transparent operations,
              measurable impact, and dedicated execution in Gilgit-Baltistan. Partnering with us means
              investing in proven programmes that change lives — backed by detailed reporting and accountability.
            </p>
          </div>

          {/* Partnership types */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {partnershipTypes.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card p-8">
                  <div className="w-14 h-14 rounded-xl bg-dwt-50 text-dwt-500 flex items-center justify-center mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-1">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={14} className="text-dwt-500 flex-shrink-0 mt-1" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Accreditations */}
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl mb-4">Recognised & Accredited</h2>
            <p className="text-gray-600">Durrani Welfare Trust has been recognised by leading organisations for our work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
            {[
              { title: 'ISPR Pride of Pakistan Award', year: '2025', desc: 'Awarded by the Inter Services Public Relations for outstanding community welfare service.' },
              { title: 'EVE Vision Award', year: '2026', desc: 'International recognition for social entrepreneurship and women empowerment by Ms. Aman Faraz Durrani.' },
              { title: 'UNICEF Safe Families Certified', year: '2022', desc: 'Accredited under the UNICEF Safe Families Programme for our infant care and adoption services.' },
            ].map((a) => (
              <div key={a.title} className="card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-dwt-50 flex items-center justify-center">
                  <CheckCircle size={24} className="text-dwt-500" />
                </div>
                <div className="text-xs text-dwt-500 font-bold mb-1">{a.year}</div>
                <h3 className="font-heading font-bold text-base mb-2">{a.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 text-white rounded-2xl p-10 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Ready to Partner?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Reach out to our partnerships team. We will arrange a meeting to discuss how we can work together
              to create lasting impact.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50">
                Contact Partnership Team <ArrowRight size={16} />
              </Link>
              <a href="mailto:duraniwelfaretrust@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
