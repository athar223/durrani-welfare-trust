import Link from 'next/link';
import { Quote, Heart, ArrowRight, Award } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

export default function CEOMessagePage() {
  return (
    <PublicLayout>
      <PageHeader
        title="CEO's Message"
        subtitle="A message from the Chief Executive Officer of Durrani Welfare Trust"
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
                    src="/team/ceo.jpeg"
                    alt="Mr. Aman Faraz Durrani"
                    className="w-40 h-40 mx-auto rounded-full object-cover shadow-card border-4 border-white/95"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-1">Mr. Aman Faraz Durrani</h3>
                  <p className="text-dwt-600 font-semibold text-sm mb-3">Chief Executive Officer</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Leads day-to-day operations and ensures all programs deliver maximum impact
                    to our beneficiaries.
                  </p>
                </div>
              </div>

              <div className="card p-5 mt-4">
                <h4 className="font-heading font-bold text-sm text-dwt-800 mb-3 flex items-center gap-2">
                  <Award size={16} className="text-dwt-500" /> Our Commitments
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✓ 100% Transparency in fund usage</li>
                  <li>✓ Quarterly audit reports</li>
                  <li>✓ Direct beneficiary support</li>
                  <li>✓ Zero administrative overhead from Zakat funds</li>
                  <li>✓ Annual independent audits</li>
                </ul>
              </div>
            </div>

            {/* Message column */}
            <div className="lg:col-span-2">
              <Quote className="text-dwt-200 mb-4" size={48} />

              <p className="text-gray-700 leading-relaxed mb-5">
                Esteemed Donors, Partners, Volunteers, and Friends,
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                It is my privilege to address you on behalf of the Durrani Welfare Trust. Each year,
                we are entrusted with the noble responsibility of channeling your support toward those
                in greatest need — and each year, you continue to inspire us with your generosity,
                trust, and commitment to building a better society.
              </p>

              <h3 className="font-heading font-bold text-xl text-dwt-800 mt-8 mb-3">A Year of Impact</h3>
              <p className="text-gray-700 leading-relaxed mb-5">
                This past year has been one of significant progress. We have expanded our educational
                support to over 500 students, conducted more than 50 medical camps benefiting thousands
                of patients, completed 25 community welfare projects, and dispatched our ambulance service
                to hundreds of emergencies — all free of cost to those who needed them.
              </p>

              <h3 className="font-heading font-bold text-xl text-dwt-800 mt-8 mb-3">Our Promise of Transparency</h3>
              <p className="text-gray-700 leading-relaxed mb-5">
                Every donation we receive is treated as a sacred trust. Through our online platform,
                you can now track our work in real time — view our active campaigns, see our financial
                reports, and witness the direct impact of your contributions. We invite scrutiny because
                we believe transparency is the foundation of trust.
              </p>

              <div className="my-8 grid sm:grid-cols-3 gap-4">
                <div className="bg-dwt-50 p-5 rounded-xl text-center">
                  <div className="text-3xl font-heading font-bold text-dwt-700">500+</div>
                  <div className="text-xs text-gray-600 mt-1">Students Educated</div>
                </div>
                <div className="bg-dwt-50 p-5 rounded-xl text-center">
                  <div className="text-3xl font-heading font-bold text-dwt-700">5,000+</div>
                  <div className="text-xs text-gray-600 mt-1">Lives Touched</div>
                </div>
                <div className="bg-dwt-50 p-5 rounded-xl text-center">
                  <div className="text-3xl font-heading font-bold text-dwt-700">25+</div>
                  <div className="text-xs text-gray-600 mt-1">Active Projects</div>
                </div>
              </div>

              <h3 className="font-heading font-bold text-xl text-dwt-800 mt-6 mb-3">Looking Ahead</h3>
              <p className="text-gray-700 leading-relaxed mb-5">
                In the coming year, we plan to launch new initiatives in vocational training for women,
                expand our healthcare reach to remote areas, and double the capacity of our scholarship
                program. None of this would be possible without your continued partnership.
              </p>

              <p className="text-gray-700 leading-relaxed mb-5">
                I extend my heartfelt gratitude to our Board of Directors, our dedicated staff, our
                tireless volunteers, and most importantly, to you — our donors and supporters. Together,
                we are not just changing lives; we are building a more compassionate, equitable, and
                hopeful society.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                May Allah bless your generosity and grant you the rewards of your good deeds, both in
                this life and the hereafter.
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div>
                  <div className="font-heading font-bold text-lg text-dwt-800 italic">— Aman Faraz Durrani</div>
                  <div className="text-sm text-gray-500">Chief Executive Officer, Durrani Welfare Trust</div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                  <Heart size={18} /> Donate Now
                </Link>
                <Link href="/about/annual-reports" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dwt-500 text-dwt-500 font-semibold rounded-lg hover:bg-dwt-50 transition-all">
                  View Annual Reports <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
