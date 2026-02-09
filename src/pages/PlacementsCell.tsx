import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  ChevronRight,
  User,
  Building,
  Calendar,
  Target,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Briefcase,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const PlacementsCell: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dean');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Gallery images data (placeholder - you can add actual images later)
  const galleryImages = [
    { src: "/GALLERY/placement-1.jpg", alt: "Placement Gallery 1" },
    { src: "/GALLERY/placement-2.jpg", alt: "Placement Gallery 2" },
    { src: "/GALLERY/placement-3.jpg", alt: "Placement Gallery 3" },
  ];

  const openImageModal = (imageSrc: string) => {
    const imageIndex = galleryImages.findIndex(img => img.src === imageSrc);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
    setIsModalOpen(false);
  };

  const goToPreviousImage = () => {
    const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex].src);
  };

  const goToNextImage = () => {
    const nextIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex].src);
  };

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

  // Keyboard navigation for gallery modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          goToPreviousImage();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex]);

  const sections = [
    { id: 'dean', title: 'Dean', icon: User },
    { id: 'objective', title: 'Objective', icon: Target },
    { id: 'about', title: 'About T&P', icon: Building },
    { id: 'placement-team', title: 'Placement Team', icon: Users },
    { id: 'trainers', title: 'Trainers', icon: GraduationCap },
    { id: 'placement-summary', title: 'Placement Summary', icon: FileText },
    { id: 'current-openings', title: 'Current Openings', icon: Briefcase },
    { id: 'internships', title: 'Internships', icon: Calendar },
    { id: 'gallery', title: 'Gallery', icon: ImageIcon },
    { id: 'contact', title: 'Contact T&P', icon: Phone },
  ];

  const switchSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Placement Summary Data - 2024-2025 (with company logos)
  const placementSummary2024 = [
    { sno: 1, company: 'Rinex Technologies', ctc: '10 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 2, company: 'Intellipaat Software Solutions Private Limited', ctc: '9 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 3, company: 'WPG holding Limited', ctc: '7.2 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 4, company: 'Ocean link sea services', ctc: '7 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 5, company: 'Infocepts Technologies', ctc: '7 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 6, company: 'Emipro Technologies Private Limited', ctc: '7 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 7, company: 'Keeves Technologies Private Limited', ctc: '6.4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 8, company: 'TensorGo Software Private Limited', ctc: '6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 9, company: 'Capsitech IT Services Private Ltd', ctc: '6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 10, company: 'Nuvoco Vistas Corporation Limited', ctc: '6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 11, company: 'Bavis Technologies Private Limited (BavisTech)', ctc: '6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 12, company: 'MGH Infra', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 13, company: 'Birla White, a unit of UltraTech Cement Limited', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 14, company: '24/7 ai', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 15, company: 'Gritty Tech', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 16, company: 'Scope T&M Private Limited', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 17, company: 'Sobha Projects & Trade Pvt. Ltd', ctc: '5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 18, company: 'Manikaran Power Limited (MPL)', ctc: '4.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 19, company: 'Archelos', ctc: '4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 20, company: 'Park Controls and Communications Private Limited (PCC)', ctc: '3.8 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 21, company: 'Ceyone Marketing Private Limited', ctc: '3.6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 22, company: 'BSCPL Infrastructure Limited', ctc: '3.6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 23, company: 'NISSI Engineering Solution Private Limited', ctc: '3.6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 24, company: 'Control Print Limited', ctc: '3.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 25, company: 'Nicco Engineering Services Limited (NESL)', ctc: '3.3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 26, company: 'Caliber', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 27, company: 'Steel Strips & Wheels Ltd', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 28, company: 'Development Bank (DBS) of Singapore Limited', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 29, company: 'Renault Nissan', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 30, company: 'Tilicho Labs', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 31, company: 'Collebra technologies', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 32, company: 'AXISCADES Technologies', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 33, company: 'Schneider Electrics', ctc: '3 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 34, company: 'Breaks India (Diploma)', ctc: '2.9 Lakhs', course: 'Diploma', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 35, company: 'Tech Vision', ctc: '2.8 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 36, company: 'Sutherland', ctc: '2.8 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 38, company: 'Siechem Technologies', ctc: '2.6 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 39, company: 'Wind care India Ltd', ctc: '2.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 40, company: 'Clari5', ctc: '2.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 41, company: 'Tech wizzen', ctc: '2.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 42, company: 'Daikin', ctc: '2.5 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 43, company: 'AXILE INDIA PVT LMT', ctc: '2.4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 44, company: 'Tech sameen', ctc: '2.4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 45, company: 'Synnnova Gears', ctc: '2.4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 46, company: 'Yazaki India Private Limited', ctc: '2.4 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 47, company: 'Polman Instruments', ctc: '2.32 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 48, company: 'TVS SFL (Diploma)', ctc: '2.28 Lakhs', course: 'Diploma', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 49, company: 'TVS SFL', ctc: '2.28 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 50, company: 'Roter Lehmann', ctc: '2.22 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 51, company: 'Yokohama Tyres', ctc: '2 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 52, company: 'Q spiders', ctc: '1.2 Lakhs (Stipend)', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
    { sno: 53, company: 'Kodnest', ctc: '1.2 Lakhs (Stipend)', course: 'B.Tech', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0, logo: null },
  ];

  const placementSummary2019 = [
    { sno: 1, company: 'AARADHYA CLOUD SOLUTIONS PVT LTD', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 5, mba: 0, total: 5 },
    { sno: 2, company: 'ANT RECRUITMENT', ctc: '2.1 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 26, ece: 0, cse: 0, mba: 0, total: 26 },
    { sno: 3, company: 'ANU DIGITAL SOLUTIONS', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 24, ece: 0, cse: 0, mba: 0, total: 24 },
    { sno: 4, company: 'BYJUS', ctc: '4 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 6, cse: 11, mba: 0, total: 17 },
    { sno: 5, company: 'INFOSYS', ctc: '4 Lakhs', course: 'MBA', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 1, total: 1 },
    { sno: 6, company: 'MECHTURBO', ctc: '1.4 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 50, ece: 0, cse: 0, mba: 0, total: 50 },
    { sno: 7, company: 'ROBOGEN', ctc: '1.9 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 5, mba: 0, total: 5 },
    { sno: 8, company: 'ROBOGEN', ctc: '1.4 Lakhs', course: 'MBA', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 4, total: 4 },
    { sno: 9, company: 'S INNOVATIONS', ctc: '1.4 Lakhs', course: 'B.TECH', ame: 0, eee: 17, mech: 0, ece: 0, cse: 1, mba: 0, total: 18 },
    { sno: 10, company: 'SYNCTRA SOLUTIONS', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 20, mba: 0, total: 20 },
    { sno: 11, company: 'VASANT CHEMICALS PVT LTD', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 1, ece: 0, cse: 0, mba: 0, total: 1 },
    { sno: 12, company: 'WNS', ctc: '2.1 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 8, cse: 0, mba: 0, total: 8 },
  ];

  const placementSummary2018 = [
    { sno: 1, company: 'AARADHYA CLOUD SOLUTIONS PVT LTD', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 5, mba: 0, total: 5 },
    { sno: 2, company: 'ANT RECRUITMENT', ctc: '2.1 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 26, ece: 0, cse: 0, mba: 0, total: 26 },
    { sno: 3, company: 'ANU DIGITAL SOLUTIONS', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 24, ece: 0, cse: 0, mba: 0, total: 24 },
    { sno: 4, company: 'BYJUS', ctc: '4 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 6, cse: 11, mba: 0, total: 17 },
    { sno: 5, company: 'INFOSYS', ctc: '4 Lakhs', course: 'MBA', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0 },
    { sno: 6, company: 'MECHTURBO', ctc: '1.4 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 50, ece: 0, cse: 0, mba: 0, total: 50 },
    { sno: 7, company: 'ROBOGEN', ctc: '1.9 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 5, mba: 0, total: 5 },
    { sno: 8, company: 'ROBOGEN', ctc: '1.4 Lakhs', course: 'MBA', ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0 },
    { sno: 9, company: 'S INNOVATIONS', ctc: '1.4 Lakhs', course: 'B.TECH', ame: 0, eee: 17, mech: 0, ece: 0, cse: 1, mba: 0, total: 18 },
    { sno: 10, company: 'SYNCTRA SOLUTIONS', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 20, mba: 0, total: 20 },
    { sno: 11, company: 'VASANT CHEMICALS PVT LTD', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 1, ece: 0, cse: 0, mba: 0, total: 1 },
    { sno: 12, company: 'WNS', ctc: '2.1 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 8, cse: 0, mba: 0, total: 8 },
    { sno: 13, company: 'SAMRTBRAINS ENGINEERS & TECHNOLOGIES', ctc: '2.2 Lakhs', course: 'B.Tech', ame: 0, eee: 20, mech: 2, ece: 9, cse: 1, mba: 0, total: 32 },
    { sno: 14, company: 'SHREE LOGISTICS', ctc: '2.9 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 10, ece: 0, cse: 0, mba: 0, total: 10 },
    { sno: 15, company: 'SMART SELECT', ctc: '1.8 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 5, ece: 0, cse: 0, mba: 0, total: 5 },
    { sno: 16, company: 'SYNCTRA SOLUTIONS', ctc: '1.8 Lakhs', course: 'B.Tech', ame: 3, eee: 5, mech: 11, ece: 1, cse: 4, mba: 0, total: 18 },
    { sno: 17, company: 'TALENT PRO FOUNDATION', ctc: '1.4 Lakhs', course: 'B.Tech', ame: 1, eee: 3, mech: 11, ece: 0, cse: 0, mba: 0, total: 15 },
    { sno: 18, company: 'WNS', ctc: '2.1 Lakhs', course: 'B.Tech', ame: 0, eee: 0, mech: 3, ece: 0, cse: 5, mba: 0, total: 8 },
  ];

  const placementSummary2017 = [
    { sno: 1, company: 'AKTINOS', ctc: '2.3 Lakhs', course: 'B.TECH', ame: 2, eee: 1, mech: 0, ece: 5, cse: 0, mba: 0, total: 8 },
    { sno: 2, company: 'AZICO BIOPHORE', ctc: '4.5 Lakhs', course: 'B.TECH', ame: 0, eee: 3, mech: 0, ece: 0, cse: 0, mba: 0, total: 3 },
    { sno: 3, company: 'CURATIO', ctc: '2.2 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 1, mba: 0, total: 1 },
    { sno: 4, company: 'HIROTOIND TECHNOLOGIES', ctc: '2.1 Lakhs', course: 'B.TECH', ame: 13, eee: 0, mech: 21, ece: 0, cse: 0, mba: 0, total: 34 },
    { sno: 5, company: 'KRS PHARMACEUTICALS', ctc: '2.2 Lakhs', course: 'B.TECH', ame: 1, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 1 },
    { sno: 6, company: 'MECHTURBO', ctc: '1.4 Lakhs', course: 'B.TECH', ame: 0, eee: 63, mech: 0, ece: 0, cse: 0, mba: 0, total: 63 },
    { sno: 7, company: 'MILLENNIUM TECH', ctc: '2.4 Lakhs', course: 'B.TECH', ame: 0, eee: 0, mech: 0, ece: 0, cse: 15, mba: 0, total: 15 },
    { sno: 8, company: 'S INNOVATIONS', ctc: '1.4 Lakhs', course: 'MBA', ame: 0, eee: 18, mech: 0, ece: 0, cse: 0, mba: 0, total: 18 },
    { sno: 9, company: 'STAGE PRODUCTIONS', ctc: '1.8 Lakhs', course: 'B.TECH', ame: 17, eee: 22, mech: 0, ece: 3, cse: 0, mba: 0, total: 42 },
    { sno: 10, company: 'VASANT CHEMICALS PVT LTD', ctc: '3.1 Lakhs', course: 'B.TECH', ame: 0, eee: 2, mech: 0, ece: 0, cse: 20, mba: 0, total: 2 },
  ];

  const renderPlacementTable = (data: any[], year: string, showLogos: boolean = false) => {
    const totals = data.reduce((acc, row) => ({
      ame: acc.ame + (row.ame || 0),
      eee: acc.eee + (row.eee || 0),
      mech: acc.mech + (row.mech || 0),
      ece: acc.ece + (row.ece || 0),
      cse: acc.cse + (row.cse || 0),
      mba: acc.mba + (row.mba || 0),
      total: acc.total + (row.total || 0),
    }), { ame: 0, eee: 0, mech: 0, ece: 0, cse: 0, mba: 0, total: 0 });

    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">{year}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-slate-900 to-blue-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white">SL No</th>
                {showLogos && <th className="px-4 py-3 text-center text-xs font-semibold text-white">Logo</th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-white">Company Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white">CTC p.a.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white">Course</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">AME</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">EEE</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">MECH</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">ECE</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">CSE</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">MBA</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white">Total Selected</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{row.sno}</td>
                  {showLogos && (
                    <td className="px-4 py-3 text-center">
                      {row.logo ? (
                        <img 
                          src={row.logo} 
                          alt={row.company}
                          className="w-12 h-12 object-contain mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mx-auto">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-700">{row.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.ctc}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.course}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.ame || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.eee || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.mech || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.ece || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.cse || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{row.mba || 0}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">{row.total || 0}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td colSpan={showLogos ? 5 : 4} className="px-4 py-3 text-sm text-gray-900">Total Selected candidates</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.ame}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.eee}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.mech}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.ece}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.cse}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.mba}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dean':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Dean-Career Development Cell (CDC)</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">VARMA DENDUKURI</h3>
                    <p className="text-lg text-gray-600 mb-4">Dean (CDC)</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Email ID:</strong> tpo@viet.edu.in</p>
                      <p><strong>Phone:</strong> +91 8886888445</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4">DEAN'S MESSAGE</h4>
                  <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p>
                      At the outset I extend my warm welcome to you all who will be joining our institution in the coming semester. 
                      The college also welcomes you to four years of enriching experience that you are going to cherish all your life. 
                      You must keep in mind that the achievement and reputation of the college rests on your shoulders.
                    </p>
                    <p>
                      I hope you will contribute towards the achievement though your whole hearted co-operation with the teachers 
                      and college authorities in maintaining academic sanctity, preserving discipline, sincerity, integrity by virtue 
                      of your inherent talent and preseverence by your traditionality, so that your institute will achieve its mission and vision.
                    </p>
                    <p>
                      The VIET – Placement Team looks after the interests of the students and the recruiting organisations by acting as 
                      channel of communication between them. The department was established Since VIET inception. Since then, more than 80% 
                      students have been placed through campus placements. A database of recruiting organisations is available with the 
                      department, which is continuously updated. It is our consistent endeavour at VIET to identity the evolving engineering 
                      imperatives of industry and pursue a multidisciplinary approach to harness and channelize the latent potential of our 
                      budding engineers and Managers.
                    </p>
                    <p>
                      Students of the earlier batches have carved out a niche for themselves as assets to their organisations. This fact 
                      is reinforced by enthusiastic response from the corporate world in the form of placements. Various placement committees 
                      have been constituted for the placement of all the professional courses of the college. These placement committees involves 
                      final year student representatives from all disciplines of Under-Graduate Courses as well as Post-Graduate Courses. 
                      Placement activities in the form of Summer Internships, Summer Training, Mid-Semester Projects, Life skills and Business 
                      Skills Development Programs and Technology specific Programs are available for students to hone their skills.
                    </p>
                    <p>
                      Career Guidance and Personality Development Seminars, Workshops and Guest Lectures are organized regularly to improve the 
                      performance of students in the job market. I feel confident that this pool of engineers will be another feather in the 
                      illustrious crown of VIET. At the end, I wish you all a bright prospect through interaction with your experienced teachers 
                      so as to enable you to imprint a hallmark in your career. I wish you all the very best in all your future endeavors.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h5 className="font-bold text-slate-800 mb-3">Key Achievements:</h5>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>15 YEARS of experience in both Industry and academics</li>
                    <li>Joint Secretary of AP Training & Placement officer's consor team.</li>
                    <li>Vice President of AP Chapter HR of success talk.</li>
                    <li>Core Committee member Visakhapatnam of GH Yard.</li>
                    <li>Life member NHRD.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'objective':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">OBJECTIVE</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                <ul className="list-disc list-inside space-y-3">
                  <li>The Placement Cell of VIET has been assisting the students in paving a way to their career. We are happy to share the various activities carried out by the Placement cell.</li>
                  <li>The placement cell conducts Career guidance programs, workshops on Employability skills, Soft Skills, Various Internships by Industry experts as Trainers.</li>
                  <li>Placement Cell also conducts motivational programs on various career opportunities in the market and how to explore the industry expectations etc.</li>
                  <li>The Placement Cell also organized Seminars on overseas education to create an awareness of various courses offered by Foreign Universities.</li>
                  <li>Skill Enhancement Training programs are conducted regularly to improve the technical and soft skills of the students.</li>
                  <li>The Placement Cell maintains a database of all the students and their achievements, which helps in matching the right candidate with the right job.</li>
                  <li>Regular industry interactions and campus recruitment drives are organized to provide placement opportunities to students.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 'about':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">About Training & Placement Cell</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  The Training & Placement Cell at VIET is dedicated to bridging the gap between academia and industry. 
                  Our mission is to ensure that every student gets the best possible career opportunities and is well-prepared 
                  to meet the challenges of the professional world.
                </p>
                <p>
                  We work closely with leading companies across various sectors to organize campus recruitment drives, 
                  internships, and training programs. Our team continuously strives to enhance the employability of our 
                  students through various skill development initiatives.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'placement-team':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Placement Team</h2>
              <p className="text-gray-600 mb-6">Our dedicated placement team works tirelessly to ensure the best opportunities for our students.</p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Core Team Members</h3>
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100 max-w-md w-full">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                        <img 
                          src="/FACULTY/dean-placement.jpg" 
                          alt="VARMA DENDUKURI"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const icon = target.nextElementSibling as HTMLElement;
                            if (icon) icon.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                          <User className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-center mb-2">VARMA DENDUKURI</h4>
                      <p className="text-sm text-gray-600 text-center mb-2">Dean (CDC), Ph.D</p>
                      <p className="text-xs text-gray-700 text-center">tpo@viet.edu.in</p>
                      <p className="text-xs text-gray-700 text-center">+91 8886888445</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Department Coordinators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/cse-coordinator.jpg" 
                            alt="CSE Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">CSE Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Computer Science & Engineering</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / M.Tech</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/ece-coordinator.jpg" 
                            alt="ECE Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">ECE Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Electronics & Communication Engineering</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / M.Tech</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/mech-coordinator.jpg" 
                            alt="MECH Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">MECH Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Mechanical Engineering</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / M.Tech</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/eee-coordinator.jpg" 
                            alt="EEE Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">EEE Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Electrical & Electronics Engineering</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / M.Tech</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/civil-coordinator.jpg" 
                            alt="CIVIL Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">CIVIL Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Civil Engineering</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / M.Tech</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                          <img 
                            src="/FACULTY/mba-coordinator.jpg" 
                            alt="MBA Coordinator"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const icon = target.nextElementSibling as HTMLElement;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1">Dr. [Name]</h4>
                        <p className="text-sm text-gray-600 text-center mb-1">MBA Coordinator</p>
                        <p className="text-xs text-gray-500 text-center mb-2">Management</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Qualification:</span>
                          <span className="text-gray-600 ml-2">Ph.D / MBA</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-600 ml-2">X Years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'trainers':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Trainers</h2>
              <p className="text-gray-600 mb-6">Our trainers are industry experts who provide comprehensive training in various domains.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-1.jpg" 
                        alt="Trainer 1"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Technical Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">Programming & Web Technologies</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">M.Tech / B.Tech</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-2.jpg" 
                        alt="Trainer 2"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Data Science Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">AI & Machine Learning</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">M.Tech / Ph.D</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-3.jpg" 
                        alt="Trainer 3"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Soft Skills Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">Communication & Personality Development</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">MBA / M.A</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-4.jpg" 
                        alt="Trainer 4"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Aptitude Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">Quantitative & Logical Reasoning</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">M.Sc / M.Tech</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-5.jpg" 
                        alt="Trainer 5"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Cloud Computing Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">AWS, Azure & Cloud Platforms</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">M.Tech / B.Tech</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 bg-gray-200 flex items-center justify-center relative">
                      <img 
                        src="/FACULTY/trainer-6.jpg" 
                        alt="Trainer 6"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const icon = target.nextElementSibling as HTMLElement;
                          if (icon) icon.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-center mb-1">[Name]</h4>
                    <p className="text-sm text-gray-600 text-center mb-1">Verbal Ability Trainer</p>
                    <p className="text-xs text-gray-500 text-center mb-2">English Language & Communication</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Qualification:</span>
                      <span className="text-gray-600 ml-2">M.A / M.Phil</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="text-gray-600 ml-2">X Years</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'placement-summary':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Placement Summary</h2>
              <div className="space-y-8">
                {renderPlacementTable(placementSummary2024, '2024 - 2025', true)}
                {renderPlacementTable(placementSummary2019, '2019 - 2020')}
                {renderPlacementTable(placementSummary2018, '2018 - 2019')}
                {renderPlacementTable(placementSummary2017, '2017 - 2018')}
              </div>
            </CardContent>
          </Card>
        );

      case 'current-openings':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Current Openings</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Click Here To Open Current Opening</strong>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  For the latest job openings and opportunities, please contact the Placement Cell.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-slate-800 mb-2">How to Apply</h3>
                  <p className="text-gray-700">Students can register for placements through the Placement Cell. Contact us for more information.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'internships':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Internships</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Click Here To Open Internship</strong>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  For internship opportunities, please contact the Placement Cell.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-slate-800 mb-2">Summer Internships</h3>
                  <p className="text-gray-700">We facilitate summer internships with leading companies to provide practical industry experience.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-slate-800 mb-2">Mid-Semester Projects</h3>
                  <p className="text-gray-700">Industry-sponsored projects during the semester to enhance practical skills.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'gallery':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => openImageModal(image.src)}
                  >
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'contact':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Contact Training & Placement Cell</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <User className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">DEAN</h3>
                      <p className="text-gray-700">VARMA DENDUKURI, (Ph.D)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">Email</h3>
                      <a href="mailto:tpo@viet.edu.in" className="text-blue-600 hover:underline">tpo@viet.edu.in</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">Phone</h3>
                      <a href="tel:+918886888445" className="text-blue-600 hover:underline">+91 8886888445</a>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-slate-800 mb-4">Office Hours</h3>
                  <p className="text-gray-700 mb-2">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-700">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderPageNavbar backHref="/placements" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 pt-56">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Training and Placement Cell
            </h1>
            <p className="text-xl text-blue-100">
              Connecting Talent with Opportunity
            </p>
          </div>
        </div>
      </div>

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
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 border-0 bg-transparent">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={closeImageModal}
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={goToPreviousImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={goToNextImage}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
            {selectedImage && (
              <div className="flex items-center justify-center bg-black/80 rounded-lg">
                <img 
                  src={selectedImage} 
                  alt={galleryImages[currentImageIndex]?.alt || "Gallery Image"} 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default PlacementsCell;


