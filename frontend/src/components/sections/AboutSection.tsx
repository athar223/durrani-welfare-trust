import { Target, Eye, Heart } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">About Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Durrani Welfare Trust is a non-profit organization committed to creating positive change
            in our communities through sustainable welfare programs, quality education, and accessible healthcare services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <Heart size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Our Purpose</h3>
            <p className="text-gray-600 leading-relaxed">
              To uplift underprivileged women and children by providing them with the resources,
              education, and support they need to build a better future.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <Target size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To deliver compassionate welfare services in education, healthcare, and community
              development that transform lives and strengthen society.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <Eye size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A society where every individual has equal access to education, healthcare,
              and opportunities to thrive with dignity and hope.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
