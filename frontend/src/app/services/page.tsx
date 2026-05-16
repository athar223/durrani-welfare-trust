'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home, Baby, GraduationCap, Truck, Users, Droplets, Heart,
  Gift, TreePine, Mic, HandHeart, HelpCircle, ArrowRight,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';
import { publicApi } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: string;
  is_featured: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home,
  baby: Baby,
  'graduation-cap': GraduationCap,
  ambulance: Truck,
  users: Users,
  droplets: Droplets,
  heart: Heart,
  gift: Gift,
  tree: TreePine,
  'tree-pine': TreePine,
  mic: Mic,
  volunteer: HandHeart,
};

function ServiceIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? HelpCircle;
  return <Icon size={size} />;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getServices()
      .then((res) => {
        const data: Service[] = res.data.results ?? res.data;
        setServices(data);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <PageHeader
        title="Our Services"
        subtitle="From sheltering orphan girls to free ambulance services — serving Gilgit-Baltistan since 2017"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        image="/gallery/madrasa-building.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-8 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-100 rounded mb-2 w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-full" />
                      <div className="h-4 bg-gray-100 rounded w-5/6 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div key={service.id} className="card p-8 flex flex-col">
                  <div className="flex items-start gap-4 mb-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-dwt-50 flex items-center justify-center text-dwt-500 flex-shrink-0">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.short_description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {service.is_featured && (
                      <span className="inline-block px-2 py-0.5 bg-dwt-50 text-dwt-600 text-xs font-semibold rounded-full border border-dwt-200">
                        Featured Programme
                      </span>
                    )}
                    <Link href={`/services/${service.slug}`} className="ml-auto inline-flex items-center gap-1 text-dwt-500 font-semibold text-sm hover:text-dwt-700 transition-colors">
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-gradient-to-r from-dwt-700 to-dwt-500 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Support Our Work</h2>
            <p className="text-lg text-gray-100 mb-6 max-w-2xl mx-auto">
              Every donation, every volunteer hour, every share helps us serve more families
              across Gilgit-Baltistan. Contact us at{' '}
              <a href="tel:03129700108" className="font-bold text-white underline">03129700108</a>.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="px-6 py-3 bg-white text-dwt-800 font-bold rounded-lg hover:bg-dwt-50 transition-all">
                Donate Now
              </Link>
              <Link href="/volunteer" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-dwt-800 transition-all">
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
