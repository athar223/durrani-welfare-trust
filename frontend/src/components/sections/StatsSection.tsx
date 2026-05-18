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
  { id: 1, value: '50+',    label: 'Orphan Girls in Care',         icon: 'heart',   order: 1 },
  { id: 2, value: '5,000+', label: 'Ambulance Patients Served',    icon: 'truck',   order: 2 },
  { id: 3, value: '3,000+', label: 'Families Fed in Ramadan',      icon: 'users',   order: 3 },
  { id: 4, value: '5+',     label: 'Water Wells Built',            icon: 'droplets',order: 4 },
  { id: 5, value: '200+',   label: 'Women Trained',                icon: 'award',   order: 5 },
  { id: 6, value: '1,000+', label: 'Children Received Eid Gifts',  icon: 'baby',    order: 6 },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);

  useEffect(() => {
    publicApi
      .getStatistics()
      .then((res) => {
        const data = res.data.results ?? res.data;
        if (data.length > 0) setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-gradient-to-r from-dwt-800 to-dwt-600 text-white py-16">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-dwt-200 font-bold text-sm uppercase tracking-widest">Our Impact</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-white">
            Numbers That Tell Our Story
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? HelpCircle;
            return (
              <div key={s.id} className="bg-white/10 rounded-xl p-5 text-center border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon size={22} className="text-dwt-200" />
                </div>
                <div className="font-heading font-bold text-3xl text-dwt-100">{s.value}</div>
                <div className="text-xs font-semibold text-white mt-1 leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
