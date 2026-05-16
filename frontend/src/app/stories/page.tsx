import Link from 'next/link';
import { Quote, Heart, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const stories = [
  {
    name: 'Zainab\'s Story',
    role: 'Orphan Girl, DWT Care',
    initials: 'Z',
    program: 'Orphan Care',
    quote: 'I came to Durrani Welfare Trust when I was very small, after losing both parents. They did not just give me a room — they gave me a family. I go to school every day, I have friends here, and Aman Aapi makes sure we feel loved. I want to become a doctor one day.',
    color: 'from-rose-400 to-rose-600',
  },
  {
    name: 'Nasreen\'s Story',
    role: 'Rawasia Waheed HUB Graduate',
    initials: 'N',
    program: 'Women Empowerment',
    quote: 'I was a widow with two daughters and no income. The Rawasia Waheed HUB taught me sewing and embroidery. Within months, I was taking orders from neighbours. Today I run my own small tailoring business from home. I am no longer dependent on anyone. DWT gave me my dignity back.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Muhammad Ali\'s Story',
    role: 'Ambulance Service Beneficiary',
    initials: 'M',
    program: 'Free Ambulance Service',
    quote: 'My mother collapsed at 3 AM. We are in a remote village and have no car. I called DWT\'s ambulance helpline and they came within 25 minutes. At the hospital, the doctor said another hour would have been too late. Their ambulance service saved my mother\'s life. May Allah reward them.',
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Hina\'s Story',
    role: 'Ramadan Relief Beneficiary',
    initials: 'H',
    program: 'Ramadan Rations',
    quote: 'My husband lost his job and we had four children to feed. During Ramadan, DWT arrived with a full ration bag — flour, rice, oil, lentils, sugar. I cried with gratitude. They also gave the children Eid clothes. They did not make us feel like beggars. They treated us with honour.',
    color: 'from-amber-400 to-amber-600',
  },
  {
    name: 'Ruqaiya\'s Story',
    role: 'Orphan Girl, Education Programme',
    initials: 'R',
    program: 'Madrasa Fatima Education',
    quote: 'Before DWT, I had never been inside a classroom. Now I attend Madrasa Fatima lil Banat every day. I have learned to read, write, and memorise Quran. My teachers are kind and patient. When I grow up, I want to teach other girls just like me.',
    color: 'from-teal-400 to-teal-600',
  },
  {
    name: 'Bibi Fatima\'s Story',
    role: 'Safe Families Programme',
    initials: 'B',
    program: 'Safe Families (UNICEF)',
    quote: 'After my husband passed, I could not care for my newborn alone. DWT\'s Safe Families team supported me with nutrition, counselling, and connecting me to a foster family during the hardest weeks. They did not abandon me. Because of them, my baby and I are safe and together.',
    color: 'from-blue-400 to-blue-600',
  },
];

export default function StoriesPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Stories of Impact"
        subtitle="Real lives transformed by the support of generous donors and dedicated volunteers"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Media', href: '/gallery' }, { label: 'Stories' }]}
        image="/gallery/girls-certificates.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Every donation creates a ripple of change. Behind every program, every camp, every
              scholarship — there is a person whose life is forever changed. These are some of their stories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {stories.map((s) => (
              <article key={s.name} className="card overflow-hidden">
                <div className={`bg-gradient-to-br ${s.color} p-6 flex items-center gap-4`}>
                  <div className="w-16 h-16 rounded-full bg-white/95 text-gray-800 flex items-center justify-center font-heading font-bold text-2xl shadow">
                    {s.initials}
                  </div>
                  <div className="text-white">
                    <h3 className="font-heading font-bold text-xl">{s.name}</h3>
                    <p className="text-sm opacity-90">{s.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-0.5 bg-dwt-50 text-dwt-700 text-xs font-semibold rounded mb-3">
                    {s.program}
                  </span>
                  <Quote className="text-gray-200 mb-2" size={28} />
                  <p className="text-gray-700 leading-relaxed italic">{s.quote}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-gradient-to-br from-dwt-700 to-dwt-500 text-white rounded-2xl p-8 md:p-12 text-center">
            <Heart className="mx-auto mb-4" size={48} />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Your Donation Creates the Next Story
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Behind every story above is a donor who said "yes" when help was needed.
              Will you be part of someone's story today?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50">
                <Heart size={18} /> Donate Now
              </Link>
              <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Sponsor a Student <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
