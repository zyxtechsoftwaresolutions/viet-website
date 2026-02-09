import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import HeroSection from '@/components/HeroSection';
import AnnouncementsNewsEventsSection from '@/components/AnnouncementsNewsEventsSection';
import VibeAtViet from '@/components/VibeAtViet';
import PlacementExcellenceSection from '@/components/PlacementExcellenceSection';
import RankedTopSection from '@/components/RankedTopSection';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';

const Index = () => {
  return (
    <div className="min-h-screen">
      <LeaderPageNavbar backHref="/about" />
      <HeroSection />
      <AnnouncementsNewsEventsSection />
      <VibeAtViet />
      <PlacementExcellenceSection />
      <RankedTopSection />
      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Index;
