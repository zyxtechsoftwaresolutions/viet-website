import { motion } from 'framer-motion';
import { Code, Cog, Briefcase, ArrowRight, Zap, Radio, Building2, Car, BookOpen, Users, GraduationCap, Laptop, Calculator, Wrench, Leaf, Shield, Brain, FileText, Mail, Phone } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { facultyAPI } from '@/lib/api';
import cseImage from '@/assets/cse-department.jpg';
import mechanicalImage from '@/assets/mechanical-department.jpg';
import managementImage from '@/assets/management-department.jpg';
import eeeImage from '@/assets/eee-department.svg';
import eceImage from '@/assets/ece-department.svg';
import civilImage from '@/assets/civil-department.svg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Faculty data structure
interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  experience?: string;
  email?: string;
  phone?: string;
  image?: string;
  resume?: string;
}

interface Program {
  icon: any;
  title: string;
  description: string;
  duration: string;
  seats: string;
  gradient: string;
  image: string;
  color: string;
  category: string;
  faculty?: {
    hod?: FacultyMember;
    members?: FacultyMember[];
  };
}

interface APIFacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  email?: string;
  phone?: string;
  experience?: string;
  department?: string;
  image?: string;
  resume?: string;
}

// Define programs array outside component to avoid dependency issues
const PROGRAMS_DATA: Program[] = [
    // Diploma Programs
    {
      icon: Leaf,
      title: 'Agriculture Engineering',
      description: 'Modern agricultural technology and sustainable farming practices',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-green-500 to-emerald-600',
      image: civilImage,
      color: 'hsl(142 70% 30%)',
      category: 'Diploma',
      faculty: {
        hod: {
          name: 'HOD - Agriculture Engineering',
          designation: 'Head of Department',
          qualification: 'M.Tech / Ph.D',
          email: 'agriculturehod@viet.edu.in'
        }
      }
    },
    {
      icon: Building2,
      title: 'Civil Engineering',
      description: 'Infrastructure development and construction technology',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-emerald-500 to-green-700',
      image: civilImage,
      color: 'hsl(142 70% 30%)',
      category: 'Diploma'
    },
    {
      icon: Code,
      title: 'Computer Science Engineering',
      description: 'Software development and computer applications',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-blue-500 to-purple-600',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Diploma'
    },
    {
      icon: Radio,
      title: 'ECE',
      description: 'Electronics and communication systems',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-cyan-500 to-blue-600',
      image: eceImage,
      color: 'hsl(200 80% 40%)',
      category: 'Diploma'
    },
    {
      icon: Zap,
      title: 'EEE',
      description: 'Electrical and electronics engineering fundamentals',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-yellow-500 to-orange-600',
      image: eeeImage,
      color: 'hsl(45 93% 47%)',
      category: 'Diploma'
    },
    {
      icon: Cog,
      title: 'Mechanical Engineering',
      description: 'Mechanical systems and manufacturing technology',
      duration: '3 Years',
      seats: '30',
      gradient: 'from-slate-800 to-blue-950',
      image: mechanicalImage,
      color: 'hsl(25 85% 45%)',
      category: 'Diploma'
    },

    // Engineering UG Programs
    {
      icon: Car,
      title: 'Automobile Engineering (AME)',
      description: 'Automotive design, manufacturing, and vehicle technology',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-slate-800 to-blue-950',
      image: mechanicalImage,
      color: 'hsl(0 70% 50%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Mr. K. Jagadeeswa Rao',
          designation: 'Associate Professor & HOD',
          qualification: 'M.Tech',
          email: 'amehod@viet.edu.in'
        }
      }
    },
    {
      icon: BookOpen,
      title: 'Basic Science and Humanities (BS&H)',
      description: 'Foundation courses in mathematics, physics, and humanities',
      duration: '4 Years',
      seats: '40',
      gradient: 'from-indigo-500 to-purple-600',
      image: managementImage,
      color: 'hsl(260 75% 35%)',
      category: 'Engineering UG'
    },
    {
      icon: Building2,
      title: 'Civil Engineering (CIV)',
      description: 'Structural engineering, geotechnical design, and sustainable infrastructure',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-emerald-500 to-green-700',
      image: civilImage,
      color: 'hsl(142 70% 30%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Dr. Kannam Naidu Cheepurupalli',
          designation: 'Professor & HOD',
          qualification: 'M.Tech., Ph.D',
          email: 'civilhod@viet.edu.in',
          experience: '24 years'
        },
        members: [
          {
            name: 'Dr. Kannam Naidu Cheepurupalli',
            designation: 'Professor & HOD',
            qualification: 'M.Tech., Ph.D',
            experience: '24 years'
          },
          {
            name: 'MS.T Rohini',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          }
        ]
      }
    },
    {
      icon: Code,
      title: 'Computer Science and Engineering (CSE)',
      description: 'Cutting-edge curriculum in AI, Machine Learning, and Software Development',
      duration: '4 Years',
      seats: '120',
      gradient: 'from-blue-500 to-purple-600',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Dr. A S C Tejaswini Kone',
          designation: 'Professor & HOD-CSE',
          qualification: 'M.Tech., Ph.D',
          image: '/DR-ASC-TEJASWINI-KONE-optimized.jpg'
        },
        members: [
          {
            name: 'Dr. G. Sitaratnam',
            designation: 'Professor',
            qualification: 'Ph.D, M.Tech',
            image: '/FACULTY/Dr. G. Sitaratnam image.jpg',
            resume: '/FACULTY/Dr. G. Sitaratnam Resume.pdf'
          },
          {
            name: 'Dr. M V Krishna Mohan',
            designation: 'Professor',
            qualification: 'Ph.D, M.Tech',
            image: '/FACULTY/Dr. M V KRISHNA MOHAN image.jpg',
            resume: '/FACULTY/Dr. M V KRISHNA MOHAN resume.docx'
          },
          {
            name: 'Dr. T Krishna Mohan',
            designation: 'Professor',
            qualification: 'Ph.D, M.Tech',
            resume: '/FACULTY/Dr. T KRISHNA MOHAN resume.pdf'
          },
          {
            name: 'Rajasekharam Bonthu',
            designation: 'Assistant Professor',
            qualification: 'M.Tech',
            image: '/FACULTY/Rajasekharam Bonthu image.jfif',
            resume: '/FACULTY/Rajasekharam Bonthu Bio Data.docx'
          },
          {
            name: 'Dr. S Venkata Rao',
            designation: 'Associate Professor',
            qualification: 'Ph.D, M.Tech',
            resume: '/FACULTY/VARAPRASAD SIR.docx'
          },
          {
            name: 'K A Bhavani',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          },
          {
            name: 'Dr. P Rajesh Kumar',
            designation: 'Associate Professor',
            qualification: 'Ph.D, M.Tech'
          },
          {
            name: 'Dr. R Siva Kumar',
            designation: 'Assistant Professor',
            qualification: 'Ph.D, M.Tech'
          },
          {
            name: 'Dr. V Satyanarayana',
            designation: 'Assistant Professor',
            qualification: 'Ph.D, M.Tech'
          }
        ]
      }
    },
    {
      icon: Laptop,
      title: 'CSE DataScience (CSD)',
      description: 'Data analytics, machine learning, and big data technologies',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-slate-700 to-blue-900',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Engineering UG'
    },
    {
      icon: Shield,
      title: 'CSE CyberSecurity (CSC)',
      description: 'Cybersecurity, network security, and digital forensics',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-slate-700 to-blue-900',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Engineering UG'
    },
    {
      icon: Brain,
      title: 'CSE MachineLearning (CSM)',
      description: 'Artificial intelligence, machine learning, and neural networks',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-purple-600 to-pink-700',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Engineering UG'
    },
    {
      icon: Radio,
      title: 'Electronics and Communication Engineering (ECE)',
      description: 'Communications, VLSI, and signal processing with hardware-software co-design',
      duration: '4 Years',
      seats: '90',
      gradient: 'from-cyan-500 to-blue-600',
      image: eceImage,
      color: 'hsl(200 80% 40%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Dr. Jeevanarao Batakala',
          designation: 'Professor & HOD',
          qualification: 'M.Tech., Ph.D',
          email: 'ecehod@viet.edu.in',
          phone: '+91-9182854272',
          experience: '15 years'
        },
        members: [
          {
            name: 'Dr. Jeevanarao Batakala',
            designation: 'Professor & HOD',
            qualification: 'M.Tech., Ph.D',
            experience: '15 years'
          },
          {
            name: 'Mrs L. Keerthi',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          }
        ]
      }
    },
    {
      icon: Zap,
      title: 'Electrical and Electronics Engineering (EEE)',
      description: 'Power systems, control, and embedded electronics for modern energy and automation',
      duration: '4 Years',
      seats: '60',
      gradient: 'from-yellow-500 to-orange-600',
      image: eeeImage,
      color: 'hsl(45 93% 47%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Mr. Varaprasad K S B',
          designation: 'Associate Professor & HOD',
          qualification: 'M.Tech (Ph.D)',
          email: 'eeehod@viet.edu.in',
          phone: '+91-9553326245',
          experience: '13 years'
        },
        members: [
          {
            name: 'Mr. Varaprasad K S B',
            designation: 'Associate Professor & HOD',
            qualification: 'M.Tech (Ph.D)',
            experience: '13 years'
          },
          {
            name: 'Mrs S Jyothi Rani',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          }
        ]
      }
    },
    {
      icon: Cog,
      title: 'Mechanical Engineering (Mech)',
      description: 'Advanced manufacturing, robotics, and sustainable engineering solutions',
      duration: '4 Years',
      seats: '90',
      gradient: 'from-slate-800 to-blue-950',
      image: mechanicalImage,
      color: 'hsl(25 85% 45%)',
      category: 'Engineering UG',
      faculty: {
        hod: {
          name: 'Mechanical Engineering HOD',
          designation: 'Professor & HOD',
          qualification: 'M.Tech., Ph.D',
          email: 'mechhod@viet.edu.in',
          phone: '+91-9959617477'
        },
        members: [
          {
            name: 'Dr G.V. Pradeep Varma',
            designation: 'Professor & Principal',
            qualification: 'Ph.D',
            experience: '29 years'
          },
          {
            name: 'Dr. Satya Narayana Tirlangi',
            designation: 'Associate Professor and R&D Dean',
            qualification: 'Ph.D',
            experience: '13 years'
          },
          {
            name: 'Dr. P.V.V. Satyanarayana',
            designation: 'Professor',
            qualification: 'Ph.D, M.Tech'
          },
          {
            name: 'Dr K. Dayana',
            designation: 'Associate Professor',
            qualification: 'Ph.D, M.Tech'
          },
          {
            name: 'K. Chandana',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          }
        ]
      }
    },

    // Engineering PG Programs
    {
      icon: Wrench,
      title: 'CAD/CAM',
      description: 'Computer-aided design and manufacturing technologies',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-slate-500 to-gray-600',
      image: mechanicalImage,
      color: 'hsl(25 85% 45%)',
      category: 'Engineering PG'
    },
    {
      icon: Code,
      title: 'Computer Science and Engineering (CSE)',
      description: 'Advanced computer science and software engineering',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-blue-500 to-purple-600',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Engineering PG'
    },
    {
      icon: Zap,
      title: 'Power Systems',
      description: 'Advanced power generation, transmission, and distribution',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-yellow-500 to-orange-600',
      image: eeeImage,
      color: 'hsl(45 93% 47%)',
      category: 'Engineering PG'
    },
    {
      icon: Building2,
      title: 'Structural Engineering',
      description: 'Advanced structural analysis and design',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-emerald-500 to-green-700',
      image: civilImage,
      color: 'hsl(142 70% 30%)',
      category: 'Engineering PG'
    },
    {
      icon: Cog,
      title: 'Thermal Engineering',
      description: 'Heat transfer, thermodynamics, and energy systems',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-slate-800 to-blue-950',
      image: mechanicalImage,
      color: 'hsl(25 85% 45%)',
      category: 'Engineering PG'
    },
    {
      icon: Radio,
      title: 'VLSI and Embedded Systems',
      description: 'Very large scale integration and embedded system design',
      duration: '2 Years',
      seats: '30',
      gradient: 'from-cyan-500 to-blue-600',
      image: eceImage,
      color: 'hsl(200 80% 40%)',
      category: 'Engineering PG'
    },

    // Management UG Programs
    {
      icon: Briefcase,
      title: 'BBA',
      description: 'Bachelor of Business Administration - Business fundamentals and management',
      duration: '3 Years',
      seats: '60',
      gradient: 'from-purple-500 to-pink-600',
      image: managementImage,
      color: 'hsl(260 75% 35%)',
      category: 'Management UG'
    },
    {
      icon: Laptop,
      title: 'BCA',
      description: 'Bachelor of Computer Applications - Computer applications and programming',
      duration: '3 Years',
      seats: '60',
      gradient: 'from-blue-500 to-cyan-600',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Management UG'
    },

    // Management PG Programs
    {
      icon: GraduationCap,
      title: 'MBA',
      description: 'Master of Business Administration - Strategic leadership and business innovation',
      duration: '2 Years',
      seats: '60',
      gradient: 'from-purple-600 to-indigo-700',
      image: managementImage,
      color: 'hsl(260 75% 35%)',
      category: 'Management PG'
    },
    {
      icon: Calculator,
      title: 'MCA',
      description: 'Master of Computer Applications - Advanced computer applications and software development',
      duration: '2 Years',
      seats: '60',
      gradient: 'from-blue-600 to-purple-700',
      image: cseImage,
      color: 'hsl(215 85% 25%)',
      category: 'Management PG'
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient font-firlest" style={{ letterSpacing: '0.12em' }}>
              Academic Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of undergraduate and postgraduate programs 
              designed to prepare you for the challenges of tomorrow's world.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {PROGRAMS_DATA.map((program, index) => (
              <Dialog key={program.title}>
                <DialogTrigger asChild>
                  <motion.div
                    className="department-card bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Image Background with Overlay */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20" />
                      
                      {/* Icon */}
                      <div className="absolute top-3 left-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                          <program.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Info Badge */}
                      <div className="absolute bottom-2 right-2 flex space-x-1 text-white/90 text-xs font-medium">
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
                          {program.duration}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
                          {program.seats}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {program.title}
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                          {program.category}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-3 text-sm">
                        {program.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-success rounded-full" />
                          <span className="text-success font-medium">Applications Open</span>
                        </div>
                        
                        <button className="flex items-center text-primary hover:text-primary-glow font-semibold text-sm transition-colors duration-300">
                          Explore
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="relative">
                    <img src={program.image} alt={`${program.title} banner`} className="w-full h-48 md:h-64 object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0))' }} />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/90">
                        <span className="bg-black/30 backdrop-blur px-2 py-0.5 rounded-full border border-white/20">{program.duration}</span>
                        <span className="bg-black/30 backdrop-blur px-2 py-0.5 rounded-full border border-white/20">{program.seats} Seats</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8">
                    <DialogHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent border border-border">
                          <program.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl md:text-3xl">{program.title}</DialogTitle>
                          <DialogDescription className="mt-2 text-base md:text-lg">{program.description}</DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Overview</div>
                          <div className="text-sm leading-relaxed">A comprehensive program focused on foundations and advanced topics, taught with hands-on labs and real-world projects in collaboration with industry partners.</div>
                        </div>
                        <div className="rounded-xl border border-border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Curriculum Highlights</div>
                          <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>Core theory with practical labs</li>
                            <li>Capstone projects with mentorship</li>
                            <li>Electives aligned to latest trends</li>
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Labs and Facilities</div>
                          <div className="text-sm leading-relaxed">State-of-the-art labs, maker spaces, and dedicated research clusters with access to modern tooling and datasets.</div>
                        </div>
                        <div className="rounded-xl border border-border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Outcomes</div>
                          <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>Career-ready technical proficiency</li>
                            <li>Internships and placement support</li>
                            <li>Strong portfolio through projects</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-border p-4">
                        <div className="text-xs text-muted-foreground mb-1">Eligibility</div>
                        <div className="text-sm">As per university norms</div>
                      </div>
                      <div className="rounded-xl border border-border p-4">
                        <div className="text-xs text-muted-foreground mb-1">Intake</div>
                        <div className="text-sm">{program.seats} seats</div>
                      </div>
                      <div className="rounded-xl border border-border p-4">
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="text-sm">{program.duration}</div>
                      </div>
                    </div>

                    {/* Faculty Section */}
                    {program.faculty && (
                      <div className="mt-6 border-t border-border pt-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Faculty
                        </h3>
                        
                        {/* Head of Department */}
                        {program.faculty.hod && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Head of Department</h4>
                            <div className="bg-card border border-border rounded-xl p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                  {program.faculty.hod.image ? (
                                    <img 
                                      src={program.faculty.hod.image} 
                                      alt={program.faculty.hod.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                      <Users className="w-8 h-8 text-primary/50" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-foreground mb-1">{program.faculty.hod.name}</h5>
                                  <p className="text-sm text-muted-foreground mb-1">{program.faculty.hod.designation}</p>
                                  <p className="text-xs text-muted-foreground mb-1">{program.faculty.hod.qualification}</p>
                                  {program.faculty.hod.experience && (
                                    <p className="text-xs text-muted-foreground mb-2">Experience: {program.faculty.hod.experience}</p>
                                  )}
                                  {program.faculty.hod.email && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Mail className="w-3 h-3" />
                                      <span>{program.faculty.hod.email}</span>
                                    </div>
                                  )}
                                  {program.faculty.hod.phone && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <Phone className="w-3 h-3" />
                                      <span>{program.faculty.hod.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Faculty Statistics */}
                        {facultyStatsByProgram[program.title] && (
                          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="text-center p-2 bg-primary/10 rounded-lg">
                              <div className="text-lg font-bold text-primary">{facultyStatsByProgram[program.title].total}</div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/10 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{facultyStatsByProgram[program.title].phdHolders}</div>
                              <div className="text-xs text-muted-foreground">Ph.D</div>
                            </div>
                            <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">{facultyStatsByProgram[program.title].mtechFaculty}</div>
                              <div className="text-xs text-muted-foreground">M.Tech</div>
                            </div>
                            <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                              <div className="text-lg font-bold text-orange-600">{facultyStatsByProgram[program.title].industryExperience}</div>
                              <div className="text-xs text-muted-foreground">Experience</div>
                            </div>
                          </div>
                        )}

                        {/* Faculty Members from API */}
                        {facultyByProgram[program.title] && facultyByProgram[program.title].length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Faculty Members</h4>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                              {facultyByProgram[program.title].map((member) => (
                                <div key={member.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="text-center">
                                    <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-muted">
                                      {member.image ? (
                                        <img 
                                          src={member.image.startsWith('/') 
                                            ? `${API_BASE_URL}${member.image}` 
                                            : `${API_BASE_URL}/${member.image}`} 
                                          alt={member.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                          <Users className="w-8 h-8 text-primary/50" />
                                        </div>
                                      )}
                                    </div>
                                    <h5 className="font-semibold text-sm text-foreground mb-1">{member.name}</h5>
                                    <p className="text-xs text-muted-foreground mb-1">{member.designation}</p>
                                    <p className="text-xs text-muted-foreground mb-1">{member.qualification}</p>
                                    {member.experience && (
                                      <p className="text-xs text-muted-foreground mb-1">Experience: {member.experience}</p>
                                    )}
                                    {member.email && (
                                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate">{member.email}</span>
                                      </div>
                                    )}
                                    {member.phone && (
                                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-2">
                                        <Phone className="w-3 h-3" />
                                        <span>{member.phone}</span>
                                      </div>
                                    )}
                                    {member.resume && (
                                      <button
                                        onClick={() => {
                                          if (member.resume?.endsWith('.pdf')) {
                                            window.open(member.resume, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                                          } else {
                                            window.open(member.resume, '_blank');
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-glow font-medium"
                                      >
                                        <FileText className="w-3 h-3" />
                                        Resume
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Fallback: Show hardcoded members if no API faculty found */}
                        {(!facultyByProgram[program.title] || facultyByProgram[program.title].length === 0) && program.faculty?.members && program.faculty.members.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Faculty Members</h4>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                              {program.faculty.members.map((member, idx) => (
                                <div key={idx} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="text-center">
                                    <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-muted">
                                      {member.image ? (
                                        <img 
                                          src={member.image.startsWith('/') 
                                            ? `${API_BASE_URL}${member.image}` 
                                            : `${API_BASE_URL}/${member.image}`} 
                                          alt={member.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                          <Users className="w-8 h-8 text-primary/50" />
                                        </div>
                                      )}
                                    </div>
                                    <h5 className="font-semibold text-sm text-foreground mb-1">{member.name}</h5>
                                    <p className="text-xs text-muted-foreground mb-1">{member.designation}</p>
                                    <p className="text-xs text-muted-foreground mb-1">{member.qualification}</p>
                                    {member.experience && (
                                      <p className="text-xs text-muted-foreground mb-2">Experience: {member.experience}</p>
                                    )}
                                    {member.resume && (
                                      <button
                                        onClick={() => {
                                          if (member.resume?.endsWith('.pdf')) {
                                            window.open(member.resume, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                                          } else {
                                            window.open(member.resume, '_blank');
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-glow font-medium"
                                      >
                                        <FileText className="w-3 h-3" />
                                        Resume
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Empty state */}
                        {(!facultyByProgram[program.title] || facultyByProgram[program.title].length === 0) && (!program.faculty?.members || program.faculty.members.length === 0) && (
                          <div className="text-center py-8 bg-muted/50 rounded-lg">
                            <Users className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No faculty members found. Faculty will appear here once added through the admin panel.</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      {program.title === 'Computer Science and Engineering (CSE)' ? (
                        <Link 
                          to="/programs/engineering/ug/cse" 
                          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-glow"
                        >
                          Explore Department <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-glow">
                          Apply / Explore Program <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      <span className="text-sm text-success">Applications Open</span>
                    </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Course Offerings</div>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-accent mb-2">95%</div>
              <div className="text-muted-foreground">Placement Rate</div>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-success mb-2">50+</div>
              <div className="text-muted-foreground">Industry Partners</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-gradient-primary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Join thousands of successful graduates who chose VIET for their academic journey. 
                Apply now and take the first step towards your dream career.
              </p>
              <button className="glass hover-glow-accent text-white border-white/20 px-8 py-3 rounded-lg font-semibold transition-all">
                Apply for Admission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;