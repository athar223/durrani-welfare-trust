import Link from 'next/link';
import { Calendar, Award, Users, Heart, Target, Truck, Home, Star, Globe } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const milestones = [
  {
    year: '2017',
    icon: Heart,
    title: 'A Dream Becomes Reality',
    desc: 'Mr. Waheed Faraz Durrani founds Durrani Welfare Trust in Konodas, Gilgit-Baltistan. Having lost his own parents at four months old, his lifelong dream was to ensure no child grows up without shelter, care, and affection. The orphanage for girls opens its doors.',
  },
  {
    year: '2018',
    icon: Home,
    title: 'Orphanage Grows',
    desc: 'The orphanage expands to shelter more girls. Education programmes begin through Madrasa Fatima lil Banat, providing quality schooling alongside Islamic values.',
  },
  {
    year: '2019',
    icon: Truck,
    title: 'Free Ambulance Service Launched',
    desc: 'DWT launches its free 24/7 ambulance service for patients who cannot afford emergency transport in Gilgit-Baltistan. The service begins with a single ambulance and a mission to serve all at no cost.',
  },
  {
    year: '2020',
    icon: Heart,
    title: 'Ramadan Programme & Food Relief',
    desc: 'Annual Ramadan ration distribution begins, reaching hundreds of deserving families across Gilgit-Baltistan. Emergency flood relief provided to affected communities with food, tents, and bedding.',
  },
  {
    year: '2021',
    icon: Users,
    title: 'Rawasia Waheed HUB Opens',
    desc: 'The Rawasia Waheed HUB launches, providing sewing and embroidery (Silai, Kadhai) skills training for widows and destitute women to achieve financial independence.',
  },
  {
    year: '2022',
    icon: Target,
    title: 'Safe Families Programme',
    desc: 'DWT receives UNICEF accreditation for its Safe Children and Safe Families training programme under the Social Welfare Department. Marriage support programme for orphan girls begins.',
  },
  {
    year: '2023',
    icon: Calendar,
    title: 'Infant Care & Adoption',
    desc: 'Newborn care and adoption initiative formalised - providing a safe, loving environment for abandoned infants and guiding them toward caring families through proper court registration.',
  },
  {
    year: '2024',
    icon: Award,
    title: 'Expanding Services',
    desc: 'DWT constructs its 5th clean water well in a remote community. Over 3,000 families have now received Ramadan rations since 2017. Ambulance fleet serves its 4,000th patient.',
  },
  {
    year: '2025',
    icon: Star,
    title: 'Pride of Pakistan Award',
    desc: 'CEO Aman Faraz Durrani receives the prestigious Pride of Pakistan Award from ISPR during the 78th Independence Day celebrations - Marka-e-Haq - for outstanding humanitarian service.',
  },
  {
    year: '2026',
    icon: Globe,
    title: 'International Recognition & Digital Transformation',
    desc: 'Aman Faraz Durrani receives the International EVE Vision Award 2026. DWT launches its new web platform, bringing donations, applications, and operations online for greater reach and transparency.',
  },
];

export default function HistoryPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Our Story"
        subtitle="Sown in pain, nurtured with love - a journey of compassion since 2017"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Our Story' }]}
        image="/gallery/orphanage-girls.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-4xl">

          <div className="text-center mb-14">
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              The seeds of Durrani Welfare Trust were sown in pain but nurtured with love.
              Mr. Waheed Faraz Durrani lost his parents at the tender age of four months.
              From his childhood struggles emerged a lifelong dream: to ensure that no child
              grows up without shelter, care, and affection.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-dwt-200 -translate-x-1/2" />

            {milestones.map((m, i) => {
              const Icon = m.icon;
              const isRight = i % 2 === 0;
              return (
                <div key={m.year} className={`relative flex md:items-center mb-10 ${isRight ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-dwt-500 text-white flex items-center justify-center shadow-card">
                      <Icon size={20} />
                    </div>
                  </div>
                  {/* Card */}
                  <div className="ml-20 md:ml-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-card hover:-translate-y-0.5 transition-all">
                      <div className="text-2xl font-heading font-bold text-dwt-500 mb-1">{m.year}</div>
                      <h3 className="font-heading font-bold text-lg mb-2">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{m.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today */}
          <div className="mt-16 bg-gradient-to-br from-dwt-700 to-dwt-500 text-white p-10 rounded-2xl text-center">
            <h2 className="font-heading font-bold text-3xl mb-4">Today - and Tomorrow</h2>
            <p className="leading-relaxed text-lg text-gray-100 max-w-2xl mx-auto mb-6">
              Today, over 50 orphan girls call DWT home. Thousands of families receive food,
              water, and emergency care every year. And a young CEO carries forward her father's
              dream - with your support, reaching further every year.
            </p>
            <p className="font-heading font-bold italic text-dwt-200 text-lg">
              "The next milestone starts with you."
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/donate" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Support Our Work
              </Link>
              <Link href="/about" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
