import Link from 'next/link';
import { Target, Eye, Heart, Compass, Award, Users, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const values = [
  { icon: Heart, title: 'Compassion', desc: 'We approach every life with empathy, kindness, and unwavering care.' },
  { icon: Award, title: 'Integrity', desc: 'We act with honesty and uphold the highest ethical standards in every decision.' },
  { icon: Compass, title: 'Transparency', desc: 'Every donation is accountable; every action is open to scrutiny.' },
  { icon: Users, title: 'Service', desc: 'We exist to serve, prioritizing the needs of beneficiaries above all else.' },
  { icon: Target, title: 'Excellence', desc: 'We continually strive for the highest quality in all our programs.' },
  { icon: Eye, title: 'Innovation', desc: 'We embrace new ideas and modern tools to maximize our impact.' },
];

export default function VisionMissionPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Vision, Mission & Values"
        subtitle="The principles that guide every action we take"
        breadcrumb="About"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          {/* Vision */}
          <div className="grid md:grid-cols-3 gap-8 items-center mb-16">
            <div className="md:col-span-1">
              <div className="w-24 h-24 mx-auto md:mx-0 rounded-full bg-dwt-50 text-dwt-500 flex items-center justify-center">
                <Eye size={48} />
              </div>
            </div>
            <div className="md:col-span-2 text-center md:text-left">
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Our Vision</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">A Society Where Every Life Has Dignity</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                A society where every individual — regardless of background, gender, or financial status —
                has equal access to education, healthcare, and opportunities to thrive with dignity and hope.
                We envision a Pakistan where no child is denied schooling, no family is left without medical care,
                and no community is forgotten in times of crisis.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-16" />

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-8 items-center mb-16">
            <div className="md:col-span-2 text-center md:text-left order-2 md:order-1">
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">Compassionate Service That Transforms Lives</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                To deliver compassionate welfare services in education, healthcare, and community development
                that uplift the underprivileged, empower women and children, and strengthen the fabric of society.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We achieve this through transparent financial stewardship, dedicated volunteers, evidence-based programs,
                and partnerships with communities, donors, and like-minded organizations.
              </p>
            </div>
            <div className="md:col-span-1 order-1 md:order-2">
              <div className="w-24 h-24 mx-auto md:ml-auto md:mr-0 rounded-full bg-dwt-50 text-dwt-500 flex items-center justify-center">
                <Target size={48} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-16" />

          {/* Strategic Goals */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl text-center mb-3">Strategic Goals</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Our long-term commitments that drive our annual planning and program prioritization.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { num: '01', title: 'Educational Equity', desc: 'Provide free quality education to 1,000+ underprivileged students annually.' },
                { num: '02', title: 'Healthcare Access', desc: 'Operate free medical camps and ambulance services in underserved areas.' },
                { num: '03', title: 'Women Empowerment', desc: 'Equip women with skills, education, and resources for financial independence.' },
                { num: '04', title: 'Community Development', desc: 'Invest in sustainable infrastructure and welfare projects nationwide.' },
                { num: '05', title: 'Disaster Preparedness', desc: 'Maintain rapid response capacity for natural disasters and emergencies.' },
                { num: '06', title: 'Transparency & Trust', desc: 'Set the standard for accountability through open reporting and audits.' },
              ].map((g) => (
                <div key={g.num} className="card p-6 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl font-heading font-bold text-dwt-200 mb-2">{g.num}</div>
                  <h3 className="font-heading font-bold text-lg mb-2">{g.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-page max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Our Core Values</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2">What We Stand For</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              These six values shape our culture, decisions, and the way we serve.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-dwt-50 text-dwt-500 flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/about/team" className="inline-flex items-center gap-2 text-dwt-500 font-semibold hover:text-dwt-700">
              Meet the people behind these values <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
