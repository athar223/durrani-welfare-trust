'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, GraduationCap, Users, HandHeart, Truck, Ambulance,
  FolderKanban, Heart, Receipt, Coffee, Wallet, FileBarChart, UserCog,
  Database, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  Image as ImageIcon, Megaphone, Mail, FileText, Bell
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  href?: string;
  icon: any;
  badge?: number;
  children?: { label: string; href: string }[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'People',
      items: [
        { label: 'Students', icon: GraduationCap, children: [
          { label: 'All Students', href: '/admin/students' },
          { label: 'Add Student', href: '/admin/students/new' },
          { label: 'Attendance', href: '/admin/students/attendance' },
        ]},
        { label: 'Staff', icon: Users, children: [
          { label: 'All Staff', href: '/admin/staff' },
          { label: 'Add Staff', href: '/admin/staff/new' },
          { label: 'Attendance', href: '/admin/staff/attendance' },
        ]},
        { label: 'Volunteers', href: '/admin/volunteers', icon: HandHeart },
        { label: 'Drivers', href: '/admin/drivers', icon: Truck },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Ambulance Service', href: '/admin/ambulance', icon: Ambulance },
        { label: 'Community Projects', href: '/admin/projects', icon: FolderKanban },
      ],
    },
    {
      title: 'Finance',
      items: [
        { label: 'Donations', href: '/admin/donations', icon: Heart },
        { label: 'Expenses', href: '/admin/expenses', icon: Receipt },
        { label: 'Daily Expenses', href: '/admin/daily-expenses', icon: Coffee },
        { label: 'Salaries', href: '/admin/salaries', icon: Wallet },
      ],
    },
    {
      title: 'Public Submissions',
      items: [
        { label: 'Student Applications', href: '/admin/applications/students', icon: FileText },
        { label: 'Volunteer Applications', href: '/admin/applications/volunteers', icon: FileText },
        { label: 'Donation Pledges', href: '/admin/applications/donations', icon: FileText },
        { label: 'Contact Messages', href: '/admin/messages', icon: Mail },
      ],
    },
    {
      title: 'Website CMS',
      items: [
        { label: 'Site Settings', href: '/admin/cms/settings', icon: Settings },
        { label: 'Hero Banners', href: '/admin/cms/hero', icon: ImageIcon },
        { label: 'News & Posts', href: '/admin/cms/news', icon: Megaphone },
        { label: 'Gallery', href: '/admin/cms/gallery', icon: ImageIcon },
        { label: 'Services', href: '/admin/cms/services', icon: Bell },
        { label: 'Campaigns', href: '/admin/cms/campaigns', icon: Heart },
      ],
    },
    {
      title: 'Reports & Admin',
      items: [
        { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
        { label: 'User Management', href: '/admin/users', icon: UserCog },
        { label: 'Backup & Restore', href: '/admin/backup', icon: Database },
      ],
    },
  ];

  function toggleMenu(label: string) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-dwt-800 to-dwt-700 text-white z-40 w-64 flex flex-col transition-transform duration-300 overflow-hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white text-dwt-800 flex items-center justify-center font-heading font-bold text-base">
              DWT
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm leading-tight truncate">Durrani Welfare Trust</div>
              <div className="text-xs text-white/60">Management System</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-3">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white/40">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isActive = item.href === pathname;
                const isChildActive = item.children?.some((c) => c.href === pathname);
                const isOpen = openMenus[item.label] ?? isChildActive ?? false;

                if (hasChildren) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={clsx(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          isChildActive ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <Icon size={18} className="opacity-80" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      {isOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={clsx(
                                'block px-3 py-1.5 rounded-lg text-sm transition-all',
                                child.href === pathname
                                  ? 'bg-white/15 text-white'
                                  : 'text-white/65 hover:bg-white/10 hover:text-white'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon size={18} className="opacity-80" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold text-sm">
              {user.first_name?.[0] || user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
              </div>
              <div className="text-xs text-white/60 truncate">{user.role_display}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              {title && (
                <h1 className="font-heading font-bold text-lg text-gray-900 truncate">{title}</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-dwt-600 hover:bg-dwt-50 rounded-lg"
              >
                Public Site
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
