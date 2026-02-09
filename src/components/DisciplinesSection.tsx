import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import cseImage from '@/assets/cse-department.jpg';
import mechanicalImage from '@/assets/mechanical-department.jpg';
import managementImage from '@/assets/management-department.jpg';
import eeeImage from '@/assets/eee-department.svg';
import eceImage from '@/assets/ece-department.svg';
import civilImage from '@/assets/civil-department.svg';
// Engineering department images (JPG versions)
import eceEngineeringImage from '@/assets/ece-engineering.jpg';
import eeeEngineeringImage from '@/assets/eee-engineering.jpg';
import civilEngineeringImage from '@/assets/civil-engineering.jpg';
// Department-specific images
import agricultureImage from '@/assets/agriculture-engineering.jpg';
import automobileImage from '@/assets/automobile-engineering.jpg';
import basicScienceImage from '@/assets/basic-science.jpg';
import datascienceImage from '@/assets/datascience.jpg';
import cybersecurityImage from '@/assets/cybersecurity.jpg';
import machinelearningImage from '@/assets/machinelearning-fixed.jpg';
import cadcamImage from '@/assets/cad-cam.jpg';
import powerSystemsImage from '@/assets/power-systems.jpg';
import structuralImage from '@/assets/structural-engineering.jpg';
import thermalImage from '@/assets/thermal-engineering.jpg';
import vlsiImage from '@/assets/vlsi-embedded.jpg';
import bcaImage from '@/assets/bca.jpg';
import mcaImage from '@/assets/mca.jpg';
// Diploma-specific images
import civilDiplomaImage from '@/assets/civil-diploma.jpg';
import cseDiplomaImage from '@/assets/cse-diploma.jpg';
import eceDiplomaImage from '@/assets/ece-diploma.jpg';
import eeeDiplomaImage from '@/assets/eee-diploma.jpg';
import mechanicalDiplomaImage from '@/assets/mechanical-diploma.jpg';
import { Leaf, Building2, Code, Radio, Zap, Car, Calculator, Wrench, Laptop, Shield, Brain, Briefcase, BookOpen } from 'lucide-react';

// Map each department to its unique downloaded image
const getDepartmentImage = (departmentName: string): string => {
  const imageMap: Record<string, string> = {
    // Diploma Programmes - each with proper department image
    'Agriculture Engineering': agricultureImage,
    'Civil Engineering': civilDiplomaImage,
    'Computer Science Engineering': cseDiplomaImage,
    'ECE': eceDiplomaImage,
    'EEE': eeeDiplomaImage,
    'Mechanical Engineering': mechanicalDiplomaImage,
    
    // Engineering UG Programmes - each with unique downloaded image
    'Automobile Engineering (AME)': automobileImage,
    'Basic Science & Humanities (BS&H)': basicScienceImage,
    'Civil Engineering (CIV)': civilEngineeringImage,
    'Computer Science & Engineering (CSE)': cseImage,
    'CSE DataScience (CSD)': datascienceImage,
    'CSE CyberSecurity (CSC)': cybersecurityImage,
    'CSE MachineLearning (CSM)': machinelearningImage,
    'Electronics and Communication Engineering (ECE)': eceEngineeringImage,
    'Electrical and Electronics Engineering (EEE)': eeeEngineeringImage,
    'Mechanical Engineering (Mech)': mechanicalImage,
    
    // Engineering PG Programmes - each with unique downloaded image
    'CAD/CAM': cadcamImage,
    'Computer Science & Engineering (CSE)': cseImage,
    'Power Systems': powerSystemsImage,
    'Structural Engineering': structuralImage,
    'Thermal Engineering': thermalImage,
    'VLSI & Embedded Systems': vlsiImage,
    
    // Management Programmes - each with unique downloaded image
    'BBA': managementImage,
    'BCA': bcaImage,
    'MBA': managementImage,
    'MCA': mcaImage,
  };
  
  return imageMap[departmentName] || cseImage;
};

interface Programme {
  name: string;
  stream: string;
  level: string;
  image: string;
  icon: any;
}

const DisciplinesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // All programmes with their stream and level information - using department-specific images
  const programmes: Programme[] = [
    // Diploma Programmes - each using getDepartmentImage for consistency
    { name: 'Agriculture Engineering', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('Agriculture Engineering'), icon: Leaf },
    { name: 'Civil Engineering', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('Civil Engineering'), icon: Building2 },
    { name: 'Computer Science Engineering', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('Computer Science Engineering'), icon: Code },
    { name: 'ECE', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('ECE'), icon: Radio },
    { name: 'EEE', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('EEE'), icon: Zap },
    { name: 'Mechanical Engineering', stream: 'DIPLOMA', level: 'Diploma', image: getDepartmentImage('Mechanical Engineering'), icon: Wrench },
    
    // Engineering UG Programmes - each using getDepartmentImage
    { name: 'Automobile Engineering (AME)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Automobile Engineering (AME)'), icon: Car },
    { name: 'Basic Science & Humanities (BS&H)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Basic Science & Humanities (BS&H)'), icon: Calculator },
    { name: 'Civil Engineering (CIV)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Civil Engineering (CIV)'), icon: Building2 },
    { name: 'Computer Science & Engineering (CSE)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Computer Science & Engineering (CSE)'), icon: Code },
    { name: 'CSE DataScience (CSD)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('CSE DataScience (CSD)'), icon: Laptop },
    { name: 'CSE CyberSecurity (CSC)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('CSE CyberSecurity (CSC)'), icon: Shield },
    { name: 'CSE MachineLearning (CSM)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('CSE MachineLearning (CSM)'), icon: Brain },
    { name: 'Electronics and Communication Engineering (ECE)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Electronics and Communication Engineering (ECE)'), icon: Radio },
    { name: 'Electrical and Electronics Engineering (EEE)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Electrical and Electronics Engineering (EEE)'), icon: Zap },
    { name: 'Mechanical Engineering (Mech)', stream: 'ENGINEERING', level: 'B.Tech UG', image: getDepartmentImage('Mechanical Engineering (Mech)'), icon: Wrench },
    
    // Engineering PG Programmes - each using getDepartmentImage
    { name: 'CAD/CAM', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('CAD/CAM'), icon: Wrench },
    { name: 'Computer Science & Engineering (CSE)', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('Computer Science & Engineering (CSE)'), icon: Code },
    { name: 'Power Systems', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('Power Systems'), icon: Zap },
    { name: 'Structural Engineering', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('Structural Engineering'), icon: Building2 },
    { name: 'Thermal Engineering', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('Thermal Engineering'), icon: Wrench },
    { name: 'VLSI & Embedded Systems', stream: 'ENGINEERING', level: 'M.Tech PG', image: getDepartmentImage('VLSI & Embedded Systems'), icon: Radio },
    
    // Management UG Programmes - each using getDepartmentImage
    { name: 'BBA', stream: 'MANAGEMENT', level: 'UG', image: getDepartmentImage('BBA'), icon: Briefcase },
    { name: 'BCA', stream: 'MANAGEMENT', level: 'UG', image: getDepartmentImage('BCA'), icon: BookOpen },
    
    // Management PG Programmes - each using getDepartmentImage
    { name: 'MBA', stream: 'MANAGEMENT', level: 'PG', image: getDepartmentImage('MBA'), icon: Briefcase },
    { name: 'MCA', stream: 'MANAGEMENT', level: 'PG', image: getDepartmentImage('MCA'), icon: BookOpen },
  ];

  // Duplicate programmes for seamless infinite scrolling (like GITAM)
  const duplicatedProgrammes = [...programmes, ...programmes];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="disciplines" className="py-20 bg-gradient-to-b from-background to-secondary/10" ref={ref}>
      <div className="container mx-auto px-4 md:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient font-firlest" style={{ letterSpacing: '0.12em' }}>
              3 Disciplines.<br />
              <span className="text-2xl md:text-3xl lg:text-4xl">Infinite Possibilities</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              Explore our comprehensive range of programmes across Diploma, Engineering, and Management
            </p>
          </motion.div>

          {/* Scrolling Cards Container - GITAM Style */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays for smooth scroll effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrollable Cards with CSS Animation - GITAM Style */}
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-scroll">
                {/* First set */}
                {programmes.map((programme, index) => (
                  <motion.div
                    key={`${programme.name}-${programme.level}-${index}`}
                    variants={cardVariants}
                    className="flex-shrink-0 w-80 group"
                  >
                    <div className="relative h-96 rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      {/* Image Container with lazy loading */}
                      <div className="relative h-3/5 overflow-hidden bg-muted">
                        <img
                          src={programme.image}
                          alt={programme.name}
                          width={320}
                          height={192}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="auto"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ 
                            imageRendering: 'auto',
                            willChange: 'transform'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Stream Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {programme.stream}
                          </span>
                        </div>
                        
                        {/* Level Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {programme.level}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 h-2/5 flex flex-col justify-between bg-gradient-to-b from-card to-card/95">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <programme.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {programme.name}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-sm text-muted-foreground">
                            {programme.stream} • {programme.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Duplicated set for seamless loop */}
                {duplicatedProgrammes.map((programme, index) => (
                  <motion.div
                    key={`dup-${programme.name}-${programme.level}-${index}`}
                    variants={cardVariants}
                    className="flex-shrink-0 w-80 group"
                  >
                    <div className="relative h-96 rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      {/* Image Container with lazy loading */}
                      <div className="relative h-3/5 overflow-hidden bg-muted">
                        <img
                          src={programme.image}
                          alt={programme.name}
                          width={320}
                          height={192}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="auto"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ 
                            imageRendering: 'auto',
                            willChange: 'transform'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Stream Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {programme.stream}
                          </span>
                        </div>
                        
                        {/* Level Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {programme.level}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 h-2/5 flex flex-col justify-between bg-gradient-to-b from-card to-card/95">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <programme.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {programme.name}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-sm text-muted-foreground">
                            {programme.stream} • {programme.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add CSS Animation for smooth infinite scroll - GITAM Style */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-320px * ${programmes.length} - 24px * ${programmes.length}));
          }
        }
        
        .animate-scroll {
          animation: scroll ${programmes.length * 3}s linear infinite;
          display: flex;
          width: fit-content;
          will-change: transform;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default DisciplinesSection;
