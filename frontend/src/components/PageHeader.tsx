interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-dwt-800 to-dwt-500 text-white py-16 md:py-20">
      <div className="container-page text-center">
        {breadcrumb && (
          <div className="text-sm text-dwt-100 mb-2 font-semibold uppercase tracking-wider">
            {breadcrumb}
          </div>
        )}
        <h1 className="font-heading font-bold text-4xl md:text-5xl mb-3">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
