import { lazy, Suspense } from 'react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import HeroSection from '@/components/HeroSection';
import AnnouncementsNewsEventsSection from '@/components/AnnouncementsNewsEventsSection';
// Lazy load below-the-fold components for better initial load performance
const VibeAtViet = lazy(() => import('@/components/VibeAtViet'));
const PlacementExcellenceSection = lazy(() => import('@/components/PlacementExcellenceSection'));
const RankedTopSection = lazy(() => import('@/components/RankedTopSection'));
const Footer = lazy(() => import('@/components/Footer'));
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';

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
        <RankedTopSection />
        <Footer />
      </Suspense>
      <ScrollProgressIndicator />
    </div>
  );
};

export default Index;
