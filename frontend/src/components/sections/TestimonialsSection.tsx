import Link from 'next/link';
import { Quote, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    initials: 'A',
    name: 'Ayesha',
    role: 'Scholarship Recipient',
    program: 'Education',
    quote: 'DWT sponsored my entire education. Today, I am pursuing my degree in computer science.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    initials: 'H',
    name: 'Hassan',
    role: 'Beneficiary',
    program: 'Medical Camp',
    quote: 'The free eye surgery at DWT\'s medical camp restored my mother\'s sight.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    initials: 'F',
    name: 'Fatima',
    role: 'Trained Beneficiary',
    program: 'Skills Program',
    quote: 'I learned tailoring through DWT and now I support my three children with dignity.',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">Stories of Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            Lives Transformed
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Real stories from people whose lives were changed by the generosity of donors and dedication of volunteers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 hover:-translate-y-1 transition-transform">
              <Quote className="text-dwt-200 mb-3" size={32} />
              <p className="text-gray-700 leading-relaxed mb-5 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center font-heading font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role} • {t.program}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-dwt-500 font-bold hover:text-dwt-700 transition-colors"
          >
            Read More Impact Stories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
