import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb { label: string; href?: string }

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string | Crumb[];
  image?: string;
}

export default function PageHeader({ title, subtitle, breadcrumb, image }: PageHeaderProps) {
  const crumbs: Crumb[] = typeof breadcrumb === 'string'
    ? [{ label: 'Home', href: '/' }, { label: breadcrumb }]
    : breadcrumb ?? [];

  return (
    <section className="relative text-white overflow-hidden py-16 md:py-24">
      {/* Background */}
      {image ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          <div className="absolute inset-0 bg-dwt-900/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-dwt-900 via-dwt-800 to-dwt-600" />
      )}

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container-page relative z-10">
        {/* Breadcrumb */}
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-dwt-200 mb-5 flex-wrap">
            <Home size={12} />
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-white/30" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-white transition-colors">{c.label}</Link>
                ) : (
                  <span className="text-white font-semibold">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-heading font-bold text-4xl md:text-5xl leading-tight mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Bottom wave */}
      <svg className="absolute bottom-0 left-0 w-full h-8 fill-white" viewBox="0 0 1440 32" preserveAspectRatio="none">
        <path d="M0,16 C360,32 720,0 1440,16 L1440,32 L0,32 Z" />
      </svg>
    </section>
  );
}
