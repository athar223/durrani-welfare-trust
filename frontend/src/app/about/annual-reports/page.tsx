import Link from 'next/link';
import { FileText, TrendingUp, Heart, Users, Phone, Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function AnnualReportsPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Annual Reports & Transparency"
        subtitle="Our commitment to open, accountable, and transparent welfare work"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Annual Reports' }]}
        image="/gallery/girls-certificates.jpeg"
      />

      {/* Impact highlights */}
      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {[
              { icon: Heart,      value: '50+',    label: 'Orphan Girls Sheltered', sub: 'Since 2017' },
              { icon: Users,      value: '5,000+', label: 'Patients Served',        sub: 'Free ambulance service' },
              { icon: TrendingUp, value: '3,000+', label: 'Families Fed',           sub: 'Annual Ramadan programme' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl shadow-soft p-6 text-center">
                  <Icon className="mx-auto text-dwt-500 mb-3" size={32} />
                  <div className="text-3xl font-heading font-bold text-dwt-700">{s.value}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{s.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed text-lg">
            Durrani Welfare Trust is committed to the highest standards of transparency.
            Our annual reports, programme updates, and financial summaries are available below
            - or you can contact us directly for any specific information.
          </p>

          {/* Notice */}
          <div className="bg-dwt-50 border border-dwt-200 rounded-2xl p-6 flex gap-4 mb-12">
            <Info size={24} className="text-dwt-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-dwt-800 mb-1">Reports In Preparation</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                As a registered NGO founded in 2017, Durrani Welfare Trust prepares annual
                programme reports documenting impact, beneficiaries served, and fund utilisation.
                Full annual reports are available upon request. Please contact us directly to
                receive the latest documentation.
              </p>
            </div>
          </div>

          {/* Reports list */}
          <h2 className="font-heading font-bold text-2xl mb-6 text-dwt-800">Programme Reports</h2>
          <div className="space-y-4 mb-12">
            {[
              { year: '2025–26', title: 'Impact Report 2025-26', highlight: 'Latest', desc: 'ISPR Pride of Pakistan Award, EVE Vision Award, 50+ orphan girls in care, 5,000+ ambulance patients, Rawasia Waheed HUB expansion.' },
              { year: '2024–25', title: 'Programme Report 2024-25', desc: 'Clean water well construction, marriage support programme, UNICEF Safe Families accreditation, food distribution to 3,000+ families.' },
              { year: '2023–24', title: 'Programme Report 2023-24', desc: 'Infant care and adoption programme formalised, ambulance fleet expanded, Ramadan distribution continued.' },
              { year: '2022–23', title: 'Programme Report 2022-23', desc: 'Rawasia Waheed HUB skills training launched, Safe Families Programme begins, orphanage education expanded.' },
              { year: '2017–22', title: 'Foundation Years 2017-2022', desc: 'Trust founded in Konodas, orphanage established, ambulance service launched, annual Ramadan programme begins.' },
            ].map((r) => (
              <div key={r.year} className="bg-white rounded-2xl shadow-soft p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-dwt-50 text-dwt-600 flex items-center justify-center flex-shrink-0">
                  <FileText size={26} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-lg">{r.title}</h3>
                    {r.highlight && (
                      <span className="px-2 py-0.5 bg-dwt-500 text-white text-xs font-semibold rounded-full">
                        {r.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.desc}</p>
                </div>
                <Link
                  href="/contact"
                  className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 border border-dwt-500 text-dwt-600 text-sm font-semibold rounded-lg hover:bg-dwt-50 transition-all"
                >
                  Request Report
                </Link>
              </div>
            ))}
          </div>

          {/* Transparency statement */}
          <div className="bg-dwt-800 text-white rounded-2xl p-8 text-center">
            <h2 className="font-heading font-bold text-2xl mb-3">Our Transparency Commitment</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-8">
              {[
                'Zero overhead on Zakat funds',
                'Direct beneficiary impact tracking',
                'Open-door policy for all donors',
              ].map((c) => (
                <div key={c} className="bg-white/10 rounded-xl p-4 text-sm font-semibold text-dwt-200">
                  {c}
                </div>
              ))}
            </div>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Have questions about our programmes or finances? We are happy to share detailed information.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Contact Us
              </Link>
              <a href="tel:03129700108" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                <Phone size={18} /> 03129700108
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
