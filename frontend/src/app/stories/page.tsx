import Link from 'next/link';
import { Quote, Heart, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const stories = [
  {
    name: 'Ayesha\'s Story',
    role: 'Scholarship Recipient',
    initials: 'A',
    program: 'Education Support',
    quote: 'I lost my father at the age of 8. My mother could not afford school fees. DWT sponsored my entire education from primary to college. Today, I am pursuing my bachelor\'s degree in computer science. None of this would have been possible without their support.',
    color: 'from-rose-400 to-rose-600',
  },
  {
    name: 'Hassan\'s Story',
    role: 'Medical Camp Beneficiary',
    initials: 'H',
    program: 'Healthcare',
    quote: 'My elderly mother needed urgent eye surgery but we could not afford it. The DWT team enrolled her in their free medical camp where renowned ophthalmologists performed her surgery completely free of cost. Today, she can see again. Allah bless this organization.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Fatima\'s Story',
    role: 'Women Empowerment Graduate',
    initials: 'F',
    program: 'Skills Development',
    quote: 'I was a widow with three children, no source of income, and very few options. DWT enrolled me in their tailoring program. I learned a skill that now allows me to support my family with dignity. I am no longer dependent on anyone.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Imran\'s Story',
    role: 'Ambulance Service User',
    initials: 'I',
    program: 'Ambulance Service',
    quote: 'My father had a heart attack at 2 AM. We did not own a car and no taxi was available. DWT\'s free ambulance reached us within 20 minutes and rushed him to the hospital. The doctors said any further delay would have been fatal. They saved his life.',
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Sara\'s Story',
    role: 'Flood Relief Beneficiary',
    initials: 'S',
    program: 'Disaster Relief',
    quote: 'Our village was destroyed in the 2022 floods. We lost everything — our home, our cattle, our crops. DWT was among the first to reach us. They provided shelter, food, clean water, and helped us rebuild our home. We will never forget their kindness.',
    color: 'from-amber-400 to-amber-600',
  },
  {
    name: 'Bilal\'s Story',
    role: 'Orphan Care Beneficiary',
    initials: 'B',
    program: 'Orphan Support',
    quote: 'After my parents passed away, I had no one. DWT did not just provide me food and clothing — they gave me a family. They paid for my education, mentored me, and now I work as a volunteer with the same Trust that raised me. I want to give back what was given to me.',
    color: 'from-teal-400 to-teal-600',
  },
];

export default function StoriesPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Stories of Impact"
        subtitle="Real lives transformed by the support of generous donors and dedicated volunteers"
        breadcrumb="Media"
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
