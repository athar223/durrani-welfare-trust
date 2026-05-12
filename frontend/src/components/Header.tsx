'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Heart, LogIn, ChevronDown, Phone, Mail } from 'lucide-react';
import clsx from 'clsx';

interface NavLink {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
}

const nav: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    children: [
      { label: 'About Us', href: '/about', desc: 'Who we are and what we stand for' },
      { label: 'Our Story', href: '/about/history', desc: 'Years of service to the community' },
      { label: 'Vision & Mission', href: '/about/vision-mission', desc: 'Our purpose and direction' },
      { label: "Founder's Message", href: '/about/founder-message', desc: 'A word from our founder' },
      { label: 'Chairman / CEO Message', href: '/about/ceo-message', desc: 'Leadership address' },
      { label: 'Leadership & Team', href: '/about/team', desc: 'Meet our dedicated team' },
      { label: 'Annual Reports', href: '/about/annual-reports', desc: 'Transparency in numbers' },
    ],
  },
  {
    label: 'Programs',
    children: [
      { label: 'All Programs', href: '/services', desc: 'Browse all our welfare programs' },
      { label: 'Education Support', href: '/services#education', desc: 'Schooling, scholarships, books' },
      { label: 'Healthcare', href: '/services#healthcare', desc: 'Medical camps, treatment aid' },
      { label: 'Ambulance Service', href: '/services#ambulance', desc: 'Free 24/7 emergency transport' },
      { label: 'Community Projects', href: '/services#community', desc: 'Sustainable development' },
      { label: 'Disaster Relief', href: '/services#relief', desc: 'Emergency response & rehabilitation' },
    ],
  },
  {
    label: 'Get Involved',
    children: [
      { label: 'Donate Now', href: '/donate', desc: 'Support our mission financially' },
      { label: 'Become a Volunteer', href: '/volunteer', desc: 'Give your time and skills' },
      { label: 'Sponsor a Student', href: '/sponsor', desc: 'Educate a child for a year' },
      { label: 'Student Enrollment', href: '/enroll', desc: 'Apply for educational support' },
      { label: 'Partner With Us', href: '/partner', desc: 'Corporate & institutional partnerships' },
    ],
  },
  {
    label: 'Media',
    children: [
      { label: 'News & Updates', href: '/news', desc: 'Latest activities and announcements' },
      { label: 'Photo Gallery', href: '/gallery', desc: 'Glimpses of our work' },
      { label: 'Stories of Impact', href: '/stories', desc: 'Lives transformed' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      {/* Top bar */}
      <div className="hidden md:block bg-dwt-800 text-white text-xs">
        <div className="container-page flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={12} /> +92 300 1234567
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={12} /> info@duraniwelfaretrust.org
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about/annual-reports" className="hover:text-dwt-200">
              Annual Reports
            </Link>
            <Link href="/contact" className="hover:text-dwt-200">
              Office Locations
            </Link>
            <Link href="/admin/login" className="hover:text-dwt-200">
              Staff Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-page">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Durrani Welfare Trust"
              className="w-14 h-14 rounded-full object-cover shadow-soft"
            />
            <div>
              <div className="font-heading font-bold text-dwt-800 text-lg leading-tight">
                Durrani Welfare Trust
              </div>
              <div className="text-xs text-gray-500">Serving Humanity with Compassion</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-dwt-500 hover:bg-dwt-50 rounded-lg transition-all">
                    {item.label}
                    <ChevronDown size={14} className={clsx('transition-transform', openDropdown === item.label && 'rotate-180')} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="w-80 bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-3 hover:bg-dwt-50 group transition-all border-b border-gray-50 last:border-b-0"
                          >
                            <div className="font-semibold text-sm text-gray-900 group-hover:text-dwt-600">
                              {child.label}
                            </div>
                            {child.desc && (
                              <div className="text-xs text-gray-500 mt-0.5">{child.desc}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-dwt-500 hover:bg-dwt-50 rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-dwt-500 text-white text-sm font-semibold rounded-lg shadow-soft hover:bg-dwt-600 transition-all"
            >
              <Heart size={16} />
              Donate Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="container-page py-4">
            {nav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-dwt-50 rounded-lg"
                  >
                    {item.label}
                    <ChevronDown size={16} className={clsx('transition-transform', mobileSubmenu === item.label && 'rotate-180')} />
                  </button>
                  {mobileSubmenu === item.label && (
                    <div className="ml-4 pl-4 border-l border-dwt-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-dwt-500 hover:bg-dwt-50 rounded-lg"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-dwt-50 rounded-lg"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/donate"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-dwt-500 text-white font-semibold rounded-lg"
              >
                <Heart size={16} /> Donate Now
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-dwt-500 text-dwt-500 font-semibold rounded-lg"
              >
                <LogIn size={16} /> Staff Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
