'use client';
import { useEffect, useState } from 'react';
import { Home, Heart, Truck, Droplets, Users, Baby, Award, Star, GraduationCap, HelpCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';

interface Stat {
  id: number;
  value: string;
  label: string;
  icon: string;
  order: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  home: Home, heart: Heart, truck: Truck, ambulance: Truck,
  droplets: Droplets, users: Users, baby: Baby, award: Award,
  star: Star, graduation: GraduationCap, 'graduation-cap': GraduationCap,
};

const FALLBACK_STATS: Stat[] = [
  { id: 1, value: '50+',    label: 'Orphan Girls in Care',      icon: 'heart',    order: 1 },
  { id: 2, value: '5,000+', label: 'Ambulance Patients Served', icon: 'ambulance', order: 2 },
  { id: 3, value: '3,000+', label: 'Families Fed in Ramadan',   icon: 'users',    order: 3 },
  { id: 4, value: '5+',     label: 'Water Wells Built',         icon: 'droplets', order: 4 },
  { id: 5, value: '200+',   label: 'Women Trained',             icon: 'award',    order: 5 },
  { id: 6, value: '9+',     label: 'Years of Service',          icon: 'star',     order: 6 },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);

  useEffect(() => {
    publicApi
      .getStatistics()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (Array.isArray(data) && data.length > 0) setStats(data.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full py-14" style={{ backgroundColor: '#0f3d22' }}>
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="font-bold text-sm uppercase tracking-widest" style={{ color: '#9cd5b4' }}>
            Our Impact
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2" style={{ color: '#ffffff' }}>
            Numbers That Tell Our Story
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? HelpCircle;
            return (
              <div
                key={s.id}
                className="rounded-xl p-3 md:p-5 text-center"
                style={{ backgroundColor: '#114a29' }}
              >
                <div
                  className="w-9 h-9 md:w-12 md:h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#155a32' }}
                >
                  <Icon size={18} style={{ color: '#9cd5b4' }} />
                </div>
                <div
                  className="font-heading font-bold text-xl md:text-3xl leading-none"
                  style={{ color: '#c5e6d2' }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs font-semibold mt-1 leading-tight"
                  style={{ color: '#9cd5b4' }}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
