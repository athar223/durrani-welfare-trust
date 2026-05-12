import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import StatsSection from '@/components/sections/StatsSection';
import CampaignsSection from '@/components/sections/CampaignsSection';
import NewsSection from '@/components/sections/NewsSection';
import GetInvolvedSection from '@/components/sections/GetInvolvedSection';
import CTASection from '@/components/sections/CTASection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import LeadershipPreviewSection from '@/components/sections/LeadershipPreviewSection';
import PublicLayout from '@/components/PublicLayout';

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <CampaignsSection />
      <GetInvolvedSection />
      <TestimonialsSection />
      <LeadershipPreviewSection />
      <NewsSection />
      <CTASection />
    </PublicLayout>
  );
}
