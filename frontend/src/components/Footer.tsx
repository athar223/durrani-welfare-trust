'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { publicApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await publicApi.subscribeNewsletter(email);
      toast.success('Subscribed! Thank you.');
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not subscribe');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-dwt-800 text-white pt-16 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="Durrani Welfare Trust"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="font-heading font-bold text-lg">Durrani Welfare Trust</div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              A non-profit organization dedicated to serving humanity through education,
              healthcare, and community development programs.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-white transition-colors">News & Events</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/donate" className="text-gray-300 hover:text-white transition-colors">Make a Donation</Link></li>
              <li><Link href="/volunteer" className="text-gray-300 hover:text-white transition-colors">Become a Volunteer</Link></li>
              <li><Link href="/enroll" className="text-gray-300 hover:text-white transition-colors">Student Enrollment</Link></li>
              <li><Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">Staff Login</Link></li>
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Stay Connected</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-2 rounded-lg bg-white text-dwt-800 hover:bg-gray-100 transition-all disabled:opacity-50"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 flex-shrink-0" />
                <span>info@duraniwelfaretrust.org</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 flex-shrink-0" />
                <span>Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>&copy; {new Date().getFullYear()} Durrani Welfare Trust. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
