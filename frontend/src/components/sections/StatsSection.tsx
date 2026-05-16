import { Home, Heart, Truck, Droplets, Users, Baby } from 'lucide-react';

const stats = [
  { icon: Home,     value: '50+',    label: 'Orphan Girls in Care',       sub: 'Shelter, education & love' },
  { icon: Truck,    value: '5,000+', label: 'Ambulance Patients Served',  sub: 'All at zero cost, 24/7' },
  { icon: Heart,    value: '3,000+', label: 'Families Fed in Ramadan',    sub: 'Since 2017, every year' },
  { icon: Droplets, value: '5+',     label: 'Water Wells Built',          sub: 'Sadqa Jaria in remote areas' },
  { icon: Users,    value: '200+',   label: 'Women Trained',              sub: 'Rawasia Waheed HUB' },
  { icon: Baby,     value: '1,000+', label: 'Children Received Eid Gifts',sub: 'Clothing & essentials' },
];

export default function StatsSection() {
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
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/10 rounded-xl p-5 text-center border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon size={22} className="text-dwt-200" />
                </div>
                <div className="font-heading font-bold text-3xl text-dwt-100">{s.value}</div>
                <div className="text-xs font-semibold text-white mt-1 leading-tight">{s.label}</div>
                <div className="text-xs text-dwt-200 mt-0.5 leading-tight">{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
