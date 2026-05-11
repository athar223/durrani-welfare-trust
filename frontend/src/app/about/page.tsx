import Link from 'next/link';
import { Heart, Target, Eye, Users, GraduationCap, Stethoscope, Truck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="About Durrani Welfare Trust"
        subtitle="Serving Humanity with Compassion since our founding"
        breadcrumb="About"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="font-heading font-bold text-3xl mb-6 text-dwt-800">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Durrani Welfare Trust is a non-profit, non-political organization established with the
              vision of serving the underprivileged sections of society. Our work is rooted in the
              belief that every individual deserves access to education, healthcare, and a chance
              at a dignified life.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mt-4">
              Over the years, we have grown into a comprehensive welfare organization serving
              women, children, and families across Pakistan with a wide range of programs in
              education, medical assistance, ambulance services, and community development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card p-8">
              <div className="w-14 h-14 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-4">
                <Heart size={28} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Our Purpose</h3>
              <p className="text-gray-600 leading-relaxed">
                To uplift underprivileged women and children by providing them with the resources,
                education, and support they need to build a better future.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-4">
                <Target size={28} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver compassionate welfare services in education, healthcare, and community
                development that transform lives and strengthen society.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-4">
                <Eye size={28} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A society where every individual has equal access to education, healthcare,
                and opportunities to thrive with dignity and hope.
              </p>
            </div>
          </div>

          {/* Key Areas */}
          <h2 className="font-heading font-bold text-3xl mb-6 text-dwt-800">Our Key Focus Areas</h2>
          <div className="space-y-6 mb-16">
            {[
              { icon: GraduationCap, title: 'Education', desc: 'Free schooling, scholarships, books, and learning materials for underprivileged children of all ages.' },
              { icon: Stethoscope, title: 'Healthcare', desc: 'Medical camps, treatment assistance, and partnerships with hospitals to provide affordable care.' },
              { icon: Truck, title: 'Ambulance Services', desc: 'Free emergency ambulance services available 24/7 for our community.' },
              { icon: Users, title: 'Community Welfare', desc: 'Distribution of essentials, food drives, and welfare support for families in need.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-dwt-50 flex-shrink-0 flex items-center justify-center text-dwt-500">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-dwt-700 to-dwt-500 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Be Part of Our Mission</h2>
            <p className="text-lg text-gray-100 mb-6 max-w-2xl mx-auto">
              Whether you donate, volunteer, or spread the word, your support helps us reach
              those who need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Donate Now
              </Link>
              <Link href="/volunteer" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
