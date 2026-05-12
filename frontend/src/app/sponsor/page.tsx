import Link from 'next/link';
import { GraduationCap, BookOpen, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const tiers = [
  { months: 'Monthly', amount: '2,500', tier: 'Books & Stationery', desc: 'Provide a child with all required books, notebooks, and stationery for school.', includes: ['School books', 'Notebooks & stationery', 'Uniform components', 'Monthly progress photos'] },
  { months: 'Monthly', amount: '5,000', tier: 'Full Scholarship', desc: 'Cover one child\'s complete monthly schooling costs including fees and supplies.', includes: ['Tuition fees', 'Books & stationery', 'Uniform & shoes', 'Monthly progress reports', 'Annual report card'], highlight: true },
  { months: 'Monthly', amount: '10,000', tier: 'Premium Sponsor', desc: 'Sponsor two children for full schooling, plus contribute to school improvement.', includes: ['Two children sponsored', 'All scholarship benefits', 'Personalized thank you letters', 'Invite to annual sponsor event', 'Plaque of recognition'] },
];

export default function SponsorPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Sponsor a Student"
        subtitle="Change a life. Educate a child for as little as PKR 2,500 per month"
        breadcrumb="Get Involved"
      />

      {/* Why */}
      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Why Sponsor</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">Education is the Greatest Gift</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For just PKR 2,500 per month — less than the cost of a single dinner at a restaurant —
                you can give an underprivileged child the most powerful tool they will ever have:
                <strong className="text-dwt-700"> education</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your sponsorship covers school fees, books, uniforms, and supplies. You receive
                regular updates on your sponsored student's progress, school photos, and personal
                thank-you letters.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 text-center">
                <GraduationCap className="mx-auto text-dwt-500 mb-3" size={36} />
                <div className="text-3xl font-heading font-bold">500+</div>
                <div className="text-xs text-gray-600 mt-1">Students Currently Sponsored</div>
              </div>
              <div className="card p-6 text-center mt-6">
                <BookOpen className="mx-auto text-dwt-500 mb-3" size={36} />
                <div className="text-3xl font-heading font-bold">95%</div>
                <div className="text-xs text-gray-600 mt-1">Pass Rate of Our Students</div>
              </div>
              <div className="card p-6 text-center">
                <Heart className="mx-auto text-rose-500 mb-3" size={36} />
                <div className="text-3xl font-heading font-bold">200+</div>
                <div className="text-xs text-gray-600 mt-1">Active Sponsors</div>
              </div>
              <div className="card p-6 text-center mt-6">
                <CheckCircle className="mx-auto text-dwt-500 mb-3" size={36} />
                <div className="text-3xl font-heading font-bold">100%</div>
                <div className="text-xs text-gray-600 mt-1">Sponsorship Goes to Student</div>
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="text-center mb-10">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Sponsorship Tiers</span>
            <h2 className="font-heading font-bold text-3xl mt-2">Choose Your Level of Impact</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tiers.map((t) => (
              <div key={t.amount} className={`card p-6 ${t.highlight ? 'ring-2 ring-dwt-500 lg:scale-105' : ''}`}>
                {t.highlight && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-dwt-500 text-white text-xs font-semibold rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{t.months}</div>
                  <div className="text-4xl font-heading font-bold text-dwt-700 mt-1">PKR {t.amount}</div>
                  <div className="font-heading font-bold text-lg text-dwt-600 mt-2">{t.tier}</div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{t.desc}</p>
                <ul className="space-y-2 mb-6">
                  {t.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-dwt-500 flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/donate?campaign=sponsor-student&amount=${t.amount.replace(',', '')}`}
                  className={`block text-center py-3 rounded-lg font-bold transition-all ${
                    t.highlight ? 'bg-dwt-500 text-white hover:bg-dwt-600' : 'border-2 border-dwt-500 text-dwt-500 hover:bg-dwt-50'
                  }`}
                >
                  Sponsor Now
                </Link>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-dwt-50 rounded-2xl p-8 md:p-12">
            <h2 className="font-heading font-bold text-3xl text-center text-dwt-800 mb-8">How Sponsorship Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Choose a Tier', desc: 'Select the sponsorship level that suits you.' },
                { step: '2', title: 'Submit Donation', desc: 'Make your monthly contribution online or via bank transfer.' },
                { step: '3', title: 'Receive Profile', desc: 'Get information about the child you are sponsoring.' },
                { step: '4', title: 'Stay Updated', desc: 'Receive monthly photos, progress reports, and letters.' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-dwt-500 text-white flex items-center justify-center font-heading font-bold text-lg">
                    {s.step}
                  </div>
                  <h3 className="font-heading font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/contact" className="inline-flex items-center gap-1 text-dwt-700 font-semibold hover:text-dwt-800">
                Have questions? Contact our sponsorship team <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
