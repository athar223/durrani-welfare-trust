'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Heart, LogIn } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Enroll', href: '/enroll' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-soft">
      <div className="container-page">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-dwt-500 flex items-center justify-center text-white font-heading font-bold text-lg shadow-soft">
              DWT
            </div>
            <div>
              <div className="font-heading font-bold text-dwt-800 text-lg leading-tight">
                Durrani Welfare Trust
              </div>
              <div className="text-xs text-gray-500">Serving Humanity with Compassion</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-dwt-500 hover:bg-dwt-50 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-dwt-500 text-white text-sm font-semibold rounded-lg shadow-soft hover:bg-dwt-600 transition-all"
            >
              <Heart size={16} />
              Donate
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-dwt-500 hover:bg-dwt-50 rounded-lg transition-all"
            >
              <LogIn size={16} />
              Login
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

        {/* Mobile nav */}
        <div
          className={clsx(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileOpen ? 'max-h-screen pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-1 pt-2 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-gray-700 hover:text-dwt-500 hover:bg-dwt-50 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
              <Link
                href="/donate"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-dwt-500 text-white font-semibold rounded-lg"
              >
                <Heart size={16} /> Donate
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-dwt-500 text-dwt-500 font-semibold rounded-lg"
              >
                <LogIn size={16} /> Login to Dashboard
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
