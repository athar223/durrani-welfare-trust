import Link from 'next/link';
import { Quote, Heart, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function FounderMessagePage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Chairman & Founder's Message"
        subtitle="A personal note from Mr. Waheed Faraz Durrani, Founder of the Trust"
        breadcrumb="About"
      />

      <section className="section-padding bg-white">
        <div className="container-page max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Profile column */}
            <div className="lg:col-span-1">
              <div className="card overflow-hidden">
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
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Founded the Durrani Welfare Trust with a vision to serve the underprivileged
                    of Pakistan through education, healthcare, and welfare programs.
                  </p>
                </div>
              </div>

              <div className="card p-5 mt-4 bg-dwt-50 border border-dwt-100">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-2">Quick Facts</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Founded the Trust over a decade ago</li>
                  <li>• Personally led 50+ welfare campaigns</li>
                  <li>• Awarded for community service</li>
                  <li>• Active in social development since 2010</li>
                </ul>
              </div>
            </div>

            {/* Message column */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              <p className="text-lg text-gray-700 leading-relaxed mb-5">
                <strong className="text-dwt-700">Bismillah-ir-Rahman-ir-Rahim.</strong> In the name of Allah,
                the Most Gracious, the Most Merciful.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                Dear Friends, Donors, Volunteers, and Supporters,
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                It is with deep gratitude and humility that I welcome you to Durrani Welfare Trust.
                When we began this journey, our dream was simple yet profound — to bring hope, dignity,
                and opportunity to those who need it most. Today, that dream lives on in every student
                we educate, every patient we treat, every family we feed, and every life we touch.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                The challenges facing our communities are immense, but so is our collective capacity
                to make a difference. Through education, we break the cycle of poverty. Through healthcare,
                we restore lives. Through community development, we build a stronger, more compassionate
                society. None of this would be possible without the generous support of our donors,
                the tireless efforts of our volunteers, and the unwavering dedication of our team.
              </p>

              <div className="my-8 pl-6 border-l-4 border-dwt-500 bg-dwt-50 p-5 rounded-r-lg">
                <p className="text-dwt-800 italic font-semibold leading-relaxed">
                  "Service to humanity is service to God. Every act of kindness, every helping hand,
                  every moment of compassion — these are the building blocks of a better tomorrow."
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5">
                Our work is rooted in transparency and accountability. Every rupee donated is carefully
                stewarded and used directly for the benefit of our beneficiaries. We invite you to walk
                with us in this mission — whether by volunteering your time, contributing financially,
                or simply spreading awareness about our work.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                I invite you to explore our website, learn about our programs, meet our team, and join
                hands with us. Together, we can create lasting change and build a brighter future for
                the most vulnerable members of our society.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                May Allah accept our humble efforts and bless those who support this noble cause.
                Thank you for being part of our journey.
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">— Waheed Faraz Durrani</div>
                  <div className="text-sm text-gray-500">Chairman & Founder, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Support Our Mission
                </Link>
                <Link href="/about/team" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dwt-500 text-dwt-500 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  Meet the Team <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
