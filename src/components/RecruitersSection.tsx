import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp } from 'lucide-react';
import { recruitersAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const RecruitersSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Default recruiters as fallback
  const defaultRecruiters = [
    {
      name: 'Tech Mahindra',
      logo: '/RECRUITERS/Tech_Mahindra.png',
      description: 'Leading IT services and digital transformation company'
    },
    {
      name: 'TCS',
      logo: '/RECRUITERS/tcs.png',
      description: 'Tata Consultancy Services - Global IT services leader'
    },
    {
      name: 'HCL',
      logo: '/RECRUITERS/hcl-img.png',
      description: 'HCL Technologies - Next-generation technology company'
    },
    {
      name: 'Byju\'s',
      logo: '/RECRUITERS/byjus-img.png',
      description: 'India\'s leading ed-tech platform'
    },
    {
      name: 'Novel Paints',
      logo: '/RECRUITERS/novel-img.png',
      description: 'Innovative paint and coating solutions'
    },
    {
      name: 'Smart Brains',
      logo: '/RECRUITERS/smart-brains-img.png',
      description: 'Technology and innovation solutions provider'
    }
  ];

  const [recruiters, setRecruiters] = useState(defaultRecruiters);

  // Fetch recruiters from API
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const data = await recruitersAPI.getAll();
        if (data && data.length > 0) {
          const mappedRecruiters = data.map((recruiter: any) => ({
            name: recruiter.name,
            logo: recruiter.logo.startsWith('/') ? `${API_BASE_URL}${recruiter.logo}` : recruiter.logo,
            description: recruiter.description || ''
          }));
          setRecruiters(mappedRecruiters);
        }
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        // Keep default recruiters on error
      }
    };

    fetchRecruiters();
  }, []);

  // Duplicate the recruiters array for seamless scrolling
  const duplicatedRecruiters = [...recruiters, ...recruiters];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.5; // pixels per frame

    const animate = () => {
      if (!isHovered) {
        scrollPosition += scrollSpeed;
        const maxScroll = scrollContainer.scrollWidth / 2; // Half because we duplicated the content
        
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Top Recruiters
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading companies trust VIET graduates for their expertise, innovation, and professional excellence
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">Partner Companies</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Placement Rate</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">₹8.5L</h3>
            <p className="text-gray-600">Highest Package</p>
          </div>
        </motion.div>

        {/* Auto-scrolling Recruiters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {duplicatedRecruiters.map((recruiter, index) => (
              <motion.div
                key={`${recruiter.name}-${index}`}
                className="flex-shrink-0 w-64 h-40 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-6 border border-gray-100 hover:border-blue-200"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-20 h-20 mb-4 flex items-center justify-center">
                  <img
                    src={recruiter.logo}
                    alt={recruiter.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {recruiter.name}
                </h4>
                <p className="text-sm text-gray-600 text-center leading-tight">
                  {recruiter.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default RecruitersSection;
