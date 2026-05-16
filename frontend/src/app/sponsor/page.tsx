import Link from 'next/link';
import { Heart, CheckCircle, ArrowRight, Phone } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const tiers = [
  {
    label: 'Monthly',
    amount: '5,000',
    title: 'Essentials Sponsor',
    desc: 'Provide one orphan girl with food, clothing, and daily care for a full month.',
    includes: ['Nutritious daily meals', 'Seasonal clothing', 'Basic hygiene supplies', 'Monthly impact update'],
  },
  {
    label: 'Monthly',
    amount: '10,000',
    title: 'Education Sponsor',
    desc: 'Cover a girl\'s full monthly care including schooling, books, and healthcare.',
    includes: ['All Essentials benefits', 'School fees and books', 'Medical care', 'Progress report & photos'],
    highlight: true,
  },
  {
    label: 'Monthly',
    amount: '25,000',
    title: 'Full Care Sponsor',
    desc: 'Fully sponsor one orphan girl\'s entire upbringing — shelter, education, medical, and vocational preparation.',
    includes: ['Complete shelter & care', 'Education through matriculation', 'Medical & psychological support', 'Personal sponsor-child updates', 'Annual event invitation'],
  },
];

export default function SponsorPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Sponsor an Orphan Girl"
        subtitle="Give an orphan girl the shelter, education, and love she deserves"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Get Involved', href: '/volunteer' }, { label: 'Sponsor a Girl' }]}
        image="/gallery/orphanage-girls.jpeg"
      />

      {/* Why */}
      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Why Sponsor</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">Every Girl Deserves a Future</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Durrani Welfare Trust has sheltered <strong className="text-dwt-700">over 50 orphan girls</strong> since
                2017 in Konodas, Gilgit-Baltistan. Each child who comes to us has lost her parents and, with them,
                any certainty of a safe future.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your monthly sponsorship covers her shelter, food, clothing, education, and healthcare.
                You will receive regular updates, photos, and progress reports — a direct connection to
                the life you are helping to build.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our founder, Mr. Waheed Faraz Durrani, lost his own parents at four months old.
                He built this orphanage so no child would face the same loneliness he did.
                Your sponsorship continues that dream.
              </p>
            </div>
            <div className="relative">
              <img
                src="/gallery/orphanage-girls.jpeg"
                alt="Orphan girls at Durrani Welfare Trust"
                className="rounded-2xl shadow-card object-cover w-full h-72"
              />
              <div className="absolute -bottom-4 -left-4 bg-dwt-700 text-white rounded-xl p-4 shadow-card">
                <div className="text-2xl font-heading font-bold">50+</div>
                <div className="text-xs font-semibold">Girls in Our Care</div>
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="text-center mb-10">
            <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Sponsorship Tiers</span>
            <h2 className="font-heading font-bold text-3xl mt-2">Choose Your Level of Support</h2>
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
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{t.label}</div>
                  <div className="text-4xl font-heading font-bold text-dwt-700 mt-1">PKR {t.amount}</div>
                  <div className="font-heading font-bold text-lg text-dwt-600 mt-2">{t.title}</div>
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
                  href={`/donate?campaign=sponsor-an-orphan-girl&amount=${t.amount.replace(',', '')}`}
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
          <div className="bg-dwt-50 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="font-heading font-bold text-3xl text-center text-dwt-800 mb-8">How Sponsorship Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Choose a Tier', desc: 'Select the sponsorship level that suits you.' },
                { step: '2', title: 'Make a Pledge', desc: 'Submit your donation via the form. We confirm and match you to a child.' },
                { step: '3', title: 'Receive Updates', desc: 'Get regular photos and progress reports on the girl you are sponsoring.' },
                { step: '4', title: 'Renew Monthly', desc: 'Continue your commitment each month and watch her grow.' },
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
                Have questions? Contact our team <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 text-white rounded-2xl p-10 text-center">
            <Heart className="mx-auto mb-4" size={48} />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Begin a Sponsorship Today</h2>
            <p className="text-lg mb-6 max-w-xl mx-auto text-white/90">
              One monthly commitment. One girl given a future she would not otherwise have.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate?campaign=sponsor-an-orphan-girl" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                <Heart size={18} /> Donate Now
              </Link>
              <a href="tel:03129700108" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                <Phone size={18} /> Call Us: 03129700108
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
