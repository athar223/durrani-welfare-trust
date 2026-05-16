import Link from 'next/link';
import { Quote, Heart, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function FounderMessagePage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Founder's Message"
        subtitle="A personal note from Mr. Waheed Faraz Durrani - Chairman and Founder of Durrani Welfare Trust"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: "Founder's Message" }]}
        image="/team/chairman.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Profile */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
                <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 py-10 text-center">
                  <img
                    src="/team/chairman.jpeg"
                    alt="Mr. Waheed Faraz Durrani"
                    className="w-40 h-40 mx-auto rounded-full object-cover shadow-card border-4 border-white/95"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-1">Mr. Waheed Faraz Durrani</h3>
                  <p className="text-dwt-600 font-semibold text-sm mb-3">Chairman & Founder</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Founded Durrani Welfare Trust in 2017 in Konodas, Gilgit-Baltistan, with a
                    lifelong dream: that no child should grow up without shelter, care, and affection.
                  </p>
                </div>
              </div>

              <div className="bg-dwt-50 rounded-2xl p-5 border border-dwt-100">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-3">His Legacy</h4>
                <ul className="text-xs text-gray-700 space-y-2">
                  {[
                    'Founded DWT in 2017, Konodas, GB',
                    'Established orphanage for 50+ girls',
                    'Launched free 24/7 ambulance service',
                    'His daughter carries his mission forward',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-dwt-500 font-bold mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Message */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              <p className="text-lg text-gray-700 leading-relaxed mb-5">
                <strong className="text-dwt-700">Bismillah-ir-Rahman-ir-Rahim.</strong>{' '}
                In the name of Allah, the Most Gracious, the Most Merciful.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                Dear Friends, Donors, Volunteers, and Supporters,
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                The seeds of Durrani Welfare Trust were sown in pain but nurtured with love.
                I lost my own parents at the tender age of four months. From my childhood
                struggles emerged a lifelong dream: to ensure that no child grows up without
                shelter, care, and affection.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                In 2017, that dream became reality when we founded Durrani Welfare Trust in
                Konodas, Gilgit-Baltistan. Together with my daughter Aman, we laid the foundation
                of an organisation built on compassion and service to humanity - to the orphan,
                the widow, the needy, and the forgotten.
              </p>

              <div className="my-8 pl-6 border-l-4 border-dwt-500 bg-dwt-50 p-5 rounded-r-xl">
                <p className="text-dwt-800 italic font-semibold leading-relaxed">
                  "Service to humanity is service to God. Every act of kindness,
                  every helping hand extended to an orphan child - these are the
                  building blocks of a better tomorrow."
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5">
                At Durrani Welfare, we do not just provide shelter - we create family.
                Every child who comes to us is given not only a safe home, but also love,
                education, healthcare, and the opportunity to grow into a confident,
                independent individual.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                Our work is rooted in transparency and accountability. Every donation is
                treated as a sacred trust - a Sadqa Jaria, an ongoing charity - used directly
                for the benefit of our children and families. We invite you to explore our
                programmes, meet our team, and join hands with us.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                May Allah accept our humble efforts and bless those who support this noble cause.
                Thank you for being part of the DWT family.
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img src="/team/chairman.jpeg" alt="Waheed Faraz Durrani" className="w-14 h-14 rounded-full object-cover border-2 border-dwt-200" />
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">
                    — Waheed Faraz Durrani
                  </div>
                  <div className="text-sm text-gray-500">Chairman & Founder, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Support Our Mission
                </Link>
                <Link href="/about/ceo-message" className="inline-flex items-center gap-2 px-6 py-3 border border-dwt-200 text-dwt-600 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  Read CEO Message <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
