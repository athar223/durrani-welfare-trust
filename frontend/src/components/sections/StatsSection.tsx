import { Users, GraduationCap, Heart, Activity } from 'lucide-react';

const stats = [
  { icon: GraduationCap, label: 'Students Educated', value: '500+', color: 'bg-blue-50 text-blue-600' },
  { icon: Users, label: 'Active Volunteers', value: '50+', color: 'bg-purple-50 text-purple-600' },
  { icon: Heart, label: 'Lives Touched', value: '5000+', color: 'bg-rose-50 text-rose-600' },
  { icon: Activity, label: 'Community Projects', value: '25+', color: 'bg-amber-50 text-amber-600' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-dwt-50">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-soft">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${stat.color}`}>
                  <Icon size={26} />
                </div>
                <div className="font-heading font-bold text-3xl text-dwt-800">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
