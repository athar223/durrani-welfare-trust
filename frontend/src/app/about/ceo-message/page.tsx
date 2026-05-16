import Link from 'next/link';
import { Quote, Heart, ArrowRight, Award, Shield, Star } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function CEOMessagePage() {
  return (
    <PublicLayout>
      <PageHeader
        title="CEO's Message"
        subtitle="A message from Ms. Aman Faraz Durrani — CEO & Trustee of Durrani Welfare Trust"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: "CEO's Message" }]}
        image="/gallery/girls-certificates.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Profile column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
                <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 text-center">
                  <img
                    src="/team/ceo.jpeg"
                    alt="Ms. Aman Faraz Durrani"
                    className="w-40 h-40 mx-auto rounded-full object-cover shadow-card border-4 border-white/95"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-1">Ms. Aman Faraz Durrani</h3>
                  <p className="text-dwt-600 font-semibold text-sm mb-1">CEO & Trustee</p>
                  <p className="text-xs text-gray-500 mb-3">Konodas, Gilgit-Baltistan</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Social entrepreneur and humanitarian who took over the Trust at age 19
                    and grew it into a nationally recognised welfare institution.
                  </p>
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-2 flex items-center gap-2">
                  <Award size={16} className="text-dwt-500" /> Awards & Recognition
                </h4>
                {[
                  { icon: Shield, label: 'Pride of Pakistan Award', sub: 'ISPR · 78th Independence Day 2025' },
                  { icon: Star,   label: 'International EVE Vision Award', sub: 'Vision of Women · 2026' },
                  { icon: Award,  label: 'UNICEF Safe Families Certified', sub: 'Safe Children Programme' },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-600 flex-shrink-0">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{a.label}</div>
                        <div className="text-xs text-gray-500">{a.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Commitments */}
              <div className="bg-dwt-50 rounded-2xl p-5">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-3">Our Commitments</h4>
                <ul className="text-xs text-gray-700 space-y-2">
                  {['100% transparency in fund usage', 'Direct beneficiary impact', 'Zero overhead on Zakat funds', 'Annual independent audits', 'Open-door policy for donors'].map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="text-dwt-500 font-bold">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Message column */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              <p className="text-gray-700 leading-relaxed mb-5">
                Assalamu Alaikum — Dear Donors, Supporters, and Friends of Durrani Welfare Trust,
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                I am Aman Faraz Durrani, a young social entrepreneur from Konodas, Gilgit-Baltistan.
                I am the CEO and Trustee of Durrani Welfare Trust — an organisation my father,
                Mr. Waheed Faraz Durrani, founded in 2017 with a single dream: that no child should
                grow up without shelter, care, and affection.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                When my father passed away, I was 19 years old. Many thought the Trust would
                close with him. Instead, I chose to carry his legacy forward — not because it was
                easy, but because his dream had become my own. Today, I lead an organisation that
                shelters over 50 orphan girls, runs free 24/7 ambulance services, empowers women
                through skills training, distributes food to thousands of families each Ramadan,
                and gives orphan girls a dignified new beginning through our marriage support programme.
              </p>

              <div className="my-8 pl-6 border-l-4 border-dwt-500 bg-dwt-50 p-5 rounded-r-xl">
                <p className="text-dwt-800 italic font-semibold leading-relaxed">
                  "At Durrani Welfare, we don't just provide shelter — we create family.
                  Every child is given not only a safe home, but also love, education, healthcare,
                  and the opportunity to grow into a confident, independent individual."
                </p>
              </div>

              <h3 className="font-heading font-bold text-xl text-dwt-800 mt-8 mb-3">Our Impact — By the Numbers</h3>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { value: '50+',    label: 'Orphan Girls in Care' },
                  { value: '5,000+', label: 'Ambulance Patients Served' },
                  { value: '3,000+', label: 'Families Fed in Ramadan' },
                ].map((s) => (
                  <div key={s.label} className="bg-dwt-50 rounded-xl p-5 text-center">
                    <div className="text-3xl font-heading font-bold text-dwt-700">{s.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <h3 className="font-heading font-bold text-xl text-dwt-800 mt-8 mb-3">Serving with Transparency</h3>
              <p className="text-gray-700 leading-relaxed mb-5">
                Every donation we receive is a sacred trust. We ensure that funds are used where
                they are needed most — directly benefiting the people we serve. We welcome scrutiny
                and believe that transparency is the foundation of lasting partnerships.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                I am grateful to every donor, volunteer, and supporter who has believed in our mission.
                Your generosity has built homes, funded education, saved lives through our ambulances,
                and given orphan girls the gift of family. Together, we are fulfilling my father's dream
                — and with your continued support, we will reach far more families in the years ahead.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8 font-medium">
                May Allah bless your generosity and accept your contributions as Sadqa Jaria.
                Thank you for being part of the DWT family.
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <img src="/team/ceo.jpeg" alt="Aman Faraz Durrani" className="w-14 h-14 rounded-full object-cover border-2 border-dwt-200" />
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">— Aman Faraz Durrani</div>
                  <div className="text-sm text-gray-500">CEO & Trustee, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Donate Now
                </Link>
                <Link href="/about/founder-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  Founder's Message <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
