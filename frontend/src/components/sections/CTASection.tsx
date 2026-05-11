import Link from 'next/link';
import { Heart, Users } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-dwt-700 to-dwt-500 text-white">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Together, We Can Make a Difference
            </h2>
            <p className="text-lg text-gray-100 leading-relaxed">
              Join hands with us in our mission to serve humanity. Every donation, every
              volunteer hour, every act of kindness counts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-dwt-800 font-bold rounded-lg shadow-card hover:bg-dwt-50 transition-all"
            >
              <Heart size={20} /> Donate Today
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all"
            >
              <Users size={20} /> Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
