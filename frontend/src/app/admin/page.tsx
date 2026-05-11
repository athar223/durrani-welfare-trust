'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, HandHeart, Truck,
  TrendingUp, AlertCircle, Mail, Heart
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

interface Stats {
  total_students: number;
  total_staff: number;
  total_volunteers: number;
  total_drivers: number;
  total_donations: number;
  total_expenses: number;
  balance: number;
  monthly_donations: number;
  monthly_expenses: number;
  active_projects: number;
  today_daily_expenses: number;
  pending_student_applications: number;
  pending_volunteer_applications: number;
  pending_donations: number;
  unread_messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading || !stats ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* People stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Active Students', value: stats.total_students, icon: GraduationCap, color: 'bg-blue-50 text-blue-600', link: '/admin/students' },
              { label: 'Staff Members', value: stats.total_staff, icon: Users, color: 'bg-purple-50 text-purple-600', link: '/admin/staff' },
              { label: 'Active Volunteers', value: stats.total_volunteers, icon: HandHeart, color: 'bg-rose-50 text-rose-600', link: '/admin/volunteers' },
              { label: 'Drivers', value: stats.total_drivers, icon: Truck, color: 'bg-amber-50 text-amber-600', link: '/admin/drivers' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.link} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-card transition-all">
                  <div className={`w-12 h-12 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-2xl font-heading font-bold">{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                </Link>
              );
            })}
          </div>

          {/* Finance */}
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-dwt-500" />
              <h2 className="font-heading font-bold text-xl">Financial Overview</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FinanceCard label="Total Donations" value={stats.total_donations} color="text-green-600" />
              <FinanceCard label="Total Expenses" value={stats.total_expenses} color="text-red-600" />
              <FinanceCard label="Current Balance" value={stats.balance} color={stats.balance >= 0 ? 'text-dwt-700' : 'text-red-600'} />
              <FinanceCard label="Today's Daily Spend" value={stats.today_daily_expenses} color="text-amber-600" />
              <FinanceCard label="Donations This Month" value={stats.monthly_donations} color="text-green-600" />
              <FinanceCard label="Expenses This Month" value={stats.monthly_expenses} color="text-red-600" />
              <FinanceCard label="Active Projects" value={stats.active_projects} color="text-blue-600" plain />
            </div>
          </div>

          {/* Pending actions */}
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-amber-500" />
              <h2 className="font-heading font-bold text-xl">Pending Actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Student Applications', count: stats.pending_student_applications, link: '/admin/applications/students', icon: GraduationCap },
                { label: 'Volunteer Applications', count: stats.pending_volunteer_applications, link: '/admin/applications/volunteers', icon: HandHeart },
                { label: 'Donation Pledges', count: stats.pending_donations, link: '/admin/applications/donations', icon: Heart },
                { label: 'Unread Messages', count: stats.unread_messages, link: '/admin/messages', icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.link} className="block p-4 bg-gray-50 rounded-lg hover:bg-dwt-50 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={20} className="text-gray-400 group-hover:text-dwt-500" />
                      {item.count > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">{item.count}</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold">{item.label}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function FinanceCard({ label, value, color, plain }: { label: string; value: number; color: string; plain?: boolean }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-lg font-bold ${color}`}>
        {plain ? value : `PKR ${Number(value).toLocaleString()}`}
      </div>
    </div>
  );
}
