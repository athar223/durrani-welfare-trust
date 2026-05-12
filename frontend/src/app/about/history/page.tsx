import { Calendar, Award, Users, Heart, Target } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

const milestones = [
  { year: '2010', icon: Heart, title: 'The Beginning', desc: 'Mr. Athar Durrani founded the Durrani Welfare Trust with a small group of like-minded volunteers, focused on supporting orphaned children in Karachi.' },
  { year: '2012', icon: Users, title: 'First Education Program', desc: 'Launched our first educational support program — sponsoring 25 underprivileged students through primary and secondary schooling.' },
  { year: '2014', icon: Award, title: 'Healthcare Initiative', desc: 'Conducted our first free medical camp in collaboration with local hospitals, providing healthcare to 1,000+ patients in a single day.' },
  { year: '2016', icon: Calendar, title: 'Ambulance Service', desc: 'Acquired our first ambulance and launched a free 24/7 emergency transport service for the community.' },
  { year: '2018', icon: Target, title: 'Expansion to Multiple Cities', desc: 'Expanded operations to Lahore, Faisalabad, and Multan with permanent offices and field teams.' },
  { year: '2020', icon: Heart, title: 'COVID-19 Response', desc: 'Distributed food packages, masks, sanitizers, and oxygen cylinders to thousands of families during the pandemic crisis.' },
  { year: '2022', icon: Users, title: '500 Students Milestone', desc: 'Crossed the milestone of supporting 500 active students with full educational sponsorships.' },
  { year: '2024', icon: Award, title: 'ISO Certification', desc: 'Achieved ISO certification for governance and financial transparency standards.' },
  { year: '2026', icon: Target, title: 'Digital Transformation', desc: 'Launched the new web platform — bringing donations, applications, and operations online for greater reach and transparency.' },
];

export default function HistoryPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Our Story"
        subtitle="A journey of compassion, dedication, and impact since 2010"
        breadcrumb="About"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-4xl">
          <div className="prose prose-lg max-w-none mb-16 text-center">
            <p className="text-xl text-gray-600 leading-relaxed">
              What began as a small group of friends helping orphaned children has grown into one of
              the most respected welfare organizations in Pakistan. This is our journey.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-dwt-200 -translate-x-1/2 md:translate-x-0" />

            {milestones.map((m, i) => {
              const Icon = m.icon;
              const isLeft = i % 2 === 0;
              return (
                <div key={m.year} className={`relative flex md:items-center mb-10 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-dwt-500 text-white flex items-center justify-center shadow-card">
                      <Icon size={20} />
                    </div>
                  </div>
                  {/* Card */}
                  <div className="ml-20 md:ml-0 md:w-1/2 md:px-8">
                    <div className="card p-6 hover:-translate-y-1 transition-transform">
                      <div className="text-2xl font-heading font-bold text-dwt-500 mb-2">{m.year}</div>
                      <h3 className="font-heading font-bold text-lg mb-2">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{m.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today */}
          <div className="mt-16 text-center bg-gradient-to-br from-dwt-50 to-dwt-100 p-10 rounded-2xl">
            <h2 className="font-heading font-bold text-3xl text-dwt-800 mb-4">Today &amp; Tomorrow</h2>
            <p className="text-gray-700 leading-relaxed text-lg max-w-2xl mx-auto mb-6">
              Today, Durrani Welfare Trust is a fully digital, transparent, and impactful organization.
              We continue to grow — not just in size, but in the depth of impact we create. Every chapter
              of our story is written with the help of donors, volunteers, and supporters like you.
            </p>
            <p className="text-dwt-700 font-heading font-bold italic">
              The next milestone? It starts with you.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
