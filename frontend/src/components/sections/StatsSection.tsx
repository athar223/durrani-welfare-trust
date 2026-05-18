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
  { id: 1, value: '50+',    label: 'Orphan Girls in Care',         icon: 'heart',    order: 1 },
  { id: 2, value: '5,000+', label: 'Ambulance Patients Served',    icon: 'ambulance', order: 2 },
  { id: 3, value: '3,000+', label: 'Families Fed in Ramadan',      icon: 'users',    order: 3 },
  { id: 4, value: '5+',     label: 'Water Wells Built',            icon: 'droplets', order: 4 },
  { id: 5, value: '200+',   label: 'Women Trained',                icon: 'award',    order: 5 },
  { id: 6, value: '9+',     label: 'Years of Service',             icon: 'star',     order: 6 },
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
    <section className="bg-dwt-800 text-white py-14">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-dwt-300 font-bold text-sm uppercase tracking-widest">Our Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-white">
            Numbers That Tell Our Story
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {stats.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? HelpCircle;
            return (
              <div key={s.id} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Icon size={20} className="text-dwt-200" />
                </div>
                <div className="font-heading font-bold text-2xl md:text-3xl text-dwt-100 leading-none">{s.value}</div>
                <div className="text-xs font-semibold text-dwt-200 mt-1 leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
