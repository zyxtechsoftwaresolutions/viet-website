import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import RDynamicContent from '@/components/RD/RDynamicContent';
import { 
  Building, 
  Target, 
  Users, 
  BookOpen, 
  Award, 
  Lightbulb,
  FileText,
  GraduationCap,
  Settings,
  Briefcase,
  FlaskConical,
  Search
} from 'lucide-react';

const ResearchDevelopment: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle URL parameter for section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const sections = useMemo(() => [
    { id: 'about', title: 'About R & D', icon: Building },
    { id: 'director', title: 'About Director', icon: Users },
    { id: 'vision-mission', title: 'Vision and Mission', icon: Target },
    { id: 'roles-responsibilities', title: 'Roles & Responsibilities', icon: Settings },
    { id: 'committee', title: 'R&D Committee', icon: Users },
    { id: 'department-coordinators', title: 'Department Coordinators', icon: Users },
    { id: 'phd-holders', title: 'List of Ph.D Holders', icon: GraduationCap },
    { id: 'phd-pursuing', title: 'List of Pursuing (PhD)', icon: GraduationCap },
    { id: 'policy', title: 'R&D Policy', icon: FileText },
    { id: 'journals', title: 'Journals', icon: BookOpen },
    { id: 'patents', title: 'Patents', icon: Award },
    { id: 'textbooks', title: 'Text Books', icon: BookOpen },
    { id: 'consultancy', title: 'Consultancy Services', icon: Briefcase },
    { id: 'facilities', title: 'R&D Facilities', icon: Settings },
    { id: 'research-areas', title: 'Research Areas', icon: Search }
  ], []);

  const switchSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderPageNavbar backHref="/" />
      
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/campus-hero.jpg)' }}
      >
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 from-40% via-black/50 to-transparent"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full">
                Research & Development
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                Research & Development
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">
                Catalyst for Technological Breakthroughs
              </p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                Catalyst for Technological Breakthroughs and Academic Brilliance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 z-10">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Table of Contents</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => switchSection(section.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs leading-tight">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <RDynamicContent activeSection={activeSection} />
          </div>
        </div>
      </div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default ResearchDevelopment;

