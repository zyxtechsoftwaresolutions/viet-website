import { lazy, Suspense } from 'react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import HeroSection from '@/components/HeroSection';
import AnnouncementsNewsEventsSection from '@/components/AnnouncementsNewsEventsSection';
// Lazy load below-the-fold components for better initial load performance
const VibeAtViet = lazy(() => import('@/components/VibeAtViet'));
const PlacementExcellenceSection = lazy(() => import('@/components/PlacementExcellenceSection'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen">
      <LeaderPageNavbar backHref="/about" />
      <HeroSection />
      <AnnouncementsNewsEventsSection />
      {/* Lazy load components below the fold */}
      <Suspense fallback={null}>
        <VibeAtViet />
        <PlacementExcellenceSection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
