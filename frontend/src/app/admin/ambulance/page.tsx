'use client';
import Link from 'next/link';
import { Ambulance, Fuel, Wrench, MapPin, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AmbulancePage() {
  const cards = [
    { title: 'Vehicles', desc: 'Manage ambulance fleet, types, and assignments', icon: Ambulance, href: 'http://localhost:8000/ambulance/vehicles/', color: 'bg-blue-50 text-blue-600' },
    { title: 'Trip Logs', desc: 'Record patient transfers and trip details', icon: MapPin, href: 'http://localhost:8000/ambulance/trips/', color: 'bg-green-50 text-green-600' },
    { title: 'Fuel Logs', desc: 'Track fuel purchases and consumption', icon: Fuel, href: 'http://localhost:8000/ambulance/fuel/', color: 'bg-amber-50 text-amber-600' },
    { title: 'Maintenance', desc: 'Service records and upcoming maintenance', icon: Wrench, href: 'http://localhost:8000/ambulance/maintenance/', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <AdminLayout title="Ambulance Service">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> The Ambulance module uses the legacy desktop interface. Clicking a tile opens the existing dashboard in a new tab. A native web version is coming in a future update.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-soft p-6 hover:shadow-card transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={24} />
              </div>
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                {card.title}
                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
              </h3>
              <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
            </a>
          );
        })}
      </div>
    </AdminLayout>
  );
}
