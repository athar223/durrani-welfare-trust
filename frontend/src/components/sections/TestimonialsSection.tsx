import { Quote } from 'lucide-react';

const testimonials = [
  {
    initials: 'Z',
    name: 'Zainab',
    role: 'Orphan Girl — Resident since 2019',
    program: 'Orphanage Programme',
    quote:
      'I lost my parents when I was 6. DWT became my family. I have food, a bed, education, and people who love me. I am now studying in Grade 7 and dream of becoming a doctor.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    initials: 'N',
    name: 'Nasreen',
    role: 'Rawasia Waheed HUB Graduate',
    program: 'Women Empowerment',
    quote:
      'I was a widow with three children and no income. DWT taught me sewing and embroidery. Now I run my own tailoring business from home and support my family with dignity.',
    color: 'bg-dwt-100 text-dwt-700',
  },
  {
    initials: 'M',
    name: 'Muhammad Ali',
    role: 'Family Beneficiary',
    program: 'Ambulance Service',
    quote:
      'My mother had a heart attack at midnight. We could not afford the ambulance. DWT sent their ambulance within minutes at absolutely no cost. They saved her life.',
    color: 'bg-blue-100 text-blue-700',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-dwt-800 text-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-200 font-bold text-sm uppercase tracking-wider">Stories of Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4 text-white">
            Lives Transformed
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Real stories from the families and individuals whose lives have been changed
            by the generosity of our donors and the dedication of our team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all">
              <Quote className="text-dwt-300 mb-4" size={32} />
              <p className="text-gray-200 leading-relaxed mb-6 italic text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center font-heading font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                  <div className="text-xs text-dwt-300 font-semibold">{t.program}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
