import { useState, useEffect } from 'react';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { visitorCountAPI } from '@/lib/api';

const SESSION_KEY = 'viet_visit_counted';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const counted = sessionStorage.getItem(SESSION_KEY);
        const data = counted
          ? await visitorCountAPI.get()
          : await visitorCountAPI.increment();
        const count = typeof data?.count === 'number' ? data.count : 0;
        if (isMounted) {
          setVisitorCount(count);
          if (!counted) sessionStorage.setItem(SESSION_KEY, '1');
        }
      } catch {
        if (isMounted) setVisitorCount(0);
      }
    };
    fetchCount();
    return () => { isMounted = false; };
  }, []);

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Chairman', href: '/chairman' },
    { name: 'HR', href: '/hr' },
    { name: 'Principal', href: '/principal' },
    { name: 'Accreditation', href: '/accreditation' },
    { name: 'Organizational Chart', href: '/organizational-chart' }
  ];

  const academics = [
    { name: 'Diploma Programs', href: '#' },
    { name: 'B.Tech Programs', href: '#' },
    { name: 'M.Tech Programs', href: '#' },
    { name: 'BBA/MBA', href: '#' },
    { name: 'BCA/MCA', href: '#' },
    { name: 'Online Admission Form', href: '#' }
  ];

  const resources = [
    { name: 'Placements', href: '#' },
    { name: 'R&D', href: '#' },
    { name: 'IQAC', href: '#' },
    { name: 'Facilities', href: '#' },
    { name: 'Grievance Redressal', href: '/grievance-redressal' },
    { name: 'Committees', href: '/committees' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/vietvizag', label: 'Facebook' },
    { icon: Linkedin, href: 'https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/visakha_college_official?igsh=MXcydnJ4ajMwd2MzMw==', label: 'Instagram' }
  ];

  return (
    <footer className="text-white bg-black border-t border-transparent shadow-2xl relative overflow-hidden -mt-1">
      <div className="container mx-auto px-4 md:px-10 lg:px-12 py-16 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="/logo-viet.png" 
                  alt="VIET Logo" 
                  className="w-6 h-6 object-contain"
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                  fetchpriority="auto"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">VIET</div>
                <div className="text-sm text-primary-foreground/80">Excellence in Education</div>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              Visakha Institute of Engineering & Technology - Empowering minds, fostering innovation, 
              and building tomorrow's leaders through world-class education and research excellence since 2008.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>88th Division, Narava, GVMC, Visakhapatnam, Andhra Pradesh 530027, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91-9959617476, +91-9959617477, +91-9550957054</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>website@viet.edu.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Academics</h3>
            <ul className="space-y-3">
              {academics.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
            <ul className="space-y-3 mb-8">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="text-primary-foreground/80 text-sm">
              © {new Date().getFullYear()} Visakha Institute of Engineering and Technology. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Anti Ragging Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                AICTE Feedback
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Mandatory Disclosure
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 shrink-0" aria-hidden />
              <span>Visitors: {visitorCount != null ? visitorCount.toLocaleString() : '—'}</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <a
              href="https://www.zyxtechsolutions.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Developed by ZYX TECH SOLUTIONS in collaboration with CSE Department
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;