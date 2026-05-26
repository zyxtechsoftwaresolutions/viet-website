import { useState, useEffect } from 'react';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, Eye, ArrowUp } from 'lucide-react';
import { visitorCountAPI } from '@/lib/api';

const SESSION_KEY = 'viet_visit_counted';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Chairman', href: '/chairman' },
    { name: 'Principal', href: '/principal' },
    { name: 'HR', href: '/hr' },
    { name: 'Accreditation', href: '/accreditation' },
    { name: 'Organizational Chart', href: '/organizational-chart' },
  ];

  const academics = [
    { name: 'Diploma Programs', href: '#' },
    { name: 'B.Tech Programs', href: '#' },
    { name: 'M.Tech Programs', href: '#' },
    { name: 'BBA / MBA', href: '#' },
    { name: 'BCA / MCA', href: '#' },
    { name: 'Online Admission Form', href: '#' },
  ];

  const resources = [
    { name: 'Placements', href: '#' },
    { name: 'R&D', href: '#' },
    { name: 'IQAC', href: '#' },
    { name: 'Facilities', href: '#' },
    { name: 'Grievance Redressal', href: '/grievance-redressal' },
    { name: 'Committees', href: '/committees' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/vietvizag', label: 'Facebook' },
    { icon: Linkedin, href: 'https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/visakha_college_official?igsh=MXcydnJ4ajMwd2MzMw==', label: 'Instagram' },
  ];

  return (
    <footer className="bg-black text-white -mt-1">
      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-14 pb-6 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-4">
            <img
              src="/logo-viet.png"
              alt="VIET Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-5"
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
            <h2 className="text-xl font-bold tracking-wide mb-1">
              Visakha Institute of Engineering & Technology
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mt-3 max-w-sm">
              Empowering minds, fostering innovation, and building tomorrow's leaders
              through world-class education and research excellence since 2008.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-neutral-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Academics ── */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-5">
              Academics
            </h3>
            <ul className="space-y-3">
              {academics.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-neutral-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources + Contact ── */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-5">
              Resources
            </h3>
            <ul className="space-y-3 mb-8">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-neutral-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-neutral-500">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-600" />
                <span>88th Division, Narava, GVMC, Visakhapatnam, AP 530027</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0 text-neutral-600" />
                <span>+91 9959617476 / 9959617477</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0 text-neutral-600" />
                <span>website@viet.edu.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-neutral-900 mt-12 pt-6">
          {/* Policies */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {['Anti Ragging Policy', 'AICTE Feedback', 'Mandatory Disclosure', 'Privacy Policy', 'Terms of Service'].map((name) => (
              <a
                key={name}
                href="#"
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200"
              >
                {name}
              </a>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
            <p>© {new Date().getFullYear()} Visakha Institute of Engineering and Technology. All rights reserved.</p>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" aria-hidden />
                Visitors: {visitorCount != null ? visitorCount.toLocaleString() : '—'}
              </span>
              <span className="text-neutral-800">|</span>
              <a
                href="https://www.zyxtechsolutions.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-400 transition-colors"
              >
                Developed by ZYX Tech Solutions in collaboration with CSE Department
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll to Top ── */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

export default Footer;
