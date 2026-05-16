'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home, Baby, GraduationCap, Truck, Users, Droplets, Heart,
  Gift, TreePine, Mic, HandHeart, HelpCircle, ArrowRight,
} from 'lucide-react';
import { publicApi } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  icon: string;
  is_featured: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home, baby: Baby, 'graduation-cap': GraduationCap, ambulance: Truck,
  users: Users, droplets: Droplets, heart: Heart, gift: Gift,
  tree: TreePine, 'tree-pine': TreePine, mic: Mic, volunteer: HandHeart,
};

const PROGRAM_IMAGES: Record<string, string> = {
  'orphanage-for-girls':       '/gallery/orphanage-girls.jpeg',
  'infant-care-adoption':      '/gallery/infant-care.jpeg',
  'education-programmes':      '/gallery/madrasa-building.jpeg',
  'ambulance-services':        '/gallery/ambulance-fleet.jpeg',
  'women-empowerment':         '/gallery/women-training.jpeg',
  'clean-water-infrastructure':'/gallery/dwt-ambulance.jpeg',
  'food-distribution':         '/gallery/food-distribution.jpeg',
  'marriage-support':          '/gallery/marriage-support.jpeg',
  'plantation-drive':          '/gallery/girls-certificates.jpeg',
  'seminars-youth-empowerment':'/gallery/eve-vision-award.jpeg',
};

const STATIC_SERVICES: Service[] = [
  { id: 1, slug: 'orphanage-for-girls',        title: 'Orphanage for Girls',       short_description: 'Safe home for 50+ orphan girls with shelter, education, and healthcare in Gilgit-Baltistan.',         icon: 'home',            is_featured: true },
  { id: 2, slug: 'ambulance-services',          title: 'Free Ambulance Services',   short_description: '24/7 free emergency ambulance — over 5,000 patients served across Gilgit-Baltistan.',               icon: 'ambulance',       is_featured: true },
  { id: 3, slug: 'women-empowerment',           title: 'Women Empowerment',         short_description: 'Rawasia Waheed HUB — sewing, embroidery, and vocational training for financial independence.',        icon: 'users',           is_featured: true },
  { id: 4, slug: 'education-programmes',        title: 'Education Programmes',      short_description: 'Madrasa Fatima lil Banat providing quality Islamic and academic education to orphan girls.',           icon: 'graduation-cap',  is_featured: true },
  { id: 5, slug: 'food-distribution',           title: 'Food & Rations',            short_description: 'Annual Ramadan rations, Eid clothing, and emergency food packages for 3,000+ families.',              icon: 'heart',           is_featured: false },
  { id: 6, slug: 'clean-water-infrastructure',  title: 'Clean Water Wells',         short_description: 'Building water wells in remote Gilgit-Baltistan communities as Sadqa Jaria.',                         icon: 'droplets',        is_featured: false },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);

  useEffect(() => {
    publicApi
      .getServices()
      .then((res) => {
        const data: Service[] = res.data.results ?? res.data;
        if (data.length > 0) setServices(data);
      })
      .catch(() => {});
  }, []);

  const featured = services.filter((s) => s.is_featured);
  const display = featured.length >= 4 ? featured.slice(0, 6) : services.slice(0, 6);

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-dwt-500 font-bold text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4">Our Programmes</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            From sheltering orphan girls to free ambulances and women empowerment —
            serving the most vulnerable across Gilgit-Baltistan since 2017.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? HelpCircle;
            const photo = PROGRAM_IMAGES[service.slug];
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group block"
              >
                {/* Photo */}
                <div className="relative h-48 bg-dwt-50 overflow-hidden">
                  {photo ? (
                    <img src={photo} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-dwt-50 to-dwt-100 flex items-center justify-center">
                      <Icon size={52} className="text-dwt-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dwt-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-dwt-600">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-dwt-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                    {service.short_description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-dwt-500 text-sm font-semibold">
                    Learn More <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="inline-flex items-center gap-2 px-7 py-3.5 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all shadow-soft">
            View All Programmes <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
