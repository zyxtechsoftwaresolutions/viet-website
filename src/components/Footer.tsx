import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Eye,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { visitorCountAPI } from '@/lib/api';

const SESSION_KEY = 'viet_visit_counted';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-slate-200 hover:text-white transition-colors duration-200"
    >
      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 shrink-0" aria-hidden />
      {children}
    </a>
  </li>
);

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-w-0">
    <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-5 flex items-center gap-2">
      <span className="w-6 h-px bg-primary/80 shrink-0" aria-hidden />
      {title}
    </h3>
    {children}
  </div>
);

const FooterDottedDivider = ({ className = '' }: { className?: string }) => (
  <div className={`footer-h-rule ${className}`} aria-hidden />
);

/** Plus (+) where horizontal & vertical dotted footer lines meet — Amrita-style */
const FooterJunction = ({ className = '' }: { className?: string }) => (
  <span className={`footer-junction ${className}`} aria-hidden />
);

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [todayVisitorCount, setTodayVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const counted = sessionStorage.getItem(SESSION_KEY);
        const data = counted ? await visitorCountAPI.get() : await visitorCountAPI.increment();
        const count = typeof data?.count === 'number' ? data.count : 0;
        const todayCount = typeof data?.todayCount === 'number' ? data.todayCount : 0;
        if (isMounted) {
          setVisitorCount(count);
          setTodayVisitorCount(todayCount);
          if (!counted) sessionStorage.setItem(SESSION_KEY, '1');
        }
      } catch {
        if (isMounted) {
          setVisitorCount(0);
          setTodayVisitorCount(0);
        }
      }
    };
    fetchCount();
    return () => {
      isMounted = false;
    };
  }, []);

  const leadershipLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Chairman', href: '/chairman' },
    { name: 'Principal', href: '/principal' },
    { name: 'Diploma Principal', href: '/diploma-principal' },
    { name: 'Governing Body', href: '/governing-body' },
    { name: 'Organizational Chart', href: '/organizational-chart' },
    { name: 'Accreditation', href: '/accreditation' },
  ];

  const academicsLinks = [
    { name: 'Diploma Programs', href: '/btech' },
    { name: 'B.Tech Programs', href: '/btech' },
    { name: 'M.Tech Programs', href: '/btech' },
    { name: 'BBA / MBA', href: '/btech' },
    { name: 'BCA / MCA', href: '/btech' },
    { name: 'Faculty', href: '/faculty' },
    { name: 'Examinations (UG/PG)', href: '/examinations/ug-pg' },
    { name: 'Examinations (Diploma)', href: '/examinations/diploma' },
  ];

  const campusLinks = [
    { name: 'Placements', href: '/placements' },
    { name: 'Placements Cell', href: '/placements-cell' },
    { name: 'Research & Development', href: '/research-development' },
    { name: 'Campus Life', href: '/campus-life' },
    { name: 'Library', href: '/facilities/library' },
    { name: 'Hostel', href: '/facilities/hostel' },
    { name: 'Grievance Redressal', href: '/grievance-redressal' },
    { name: 'Committees', href: '/committees' },
  ];

  const socialLinks = [
    {
      icon: FacebookIcon,
      href: 'https://www.facebook.com/vietvizag',
      label: 'Facebook',
      className: 'bg-[#1877F2] hover:bg-[#166fe5] text-white border-transparent',
    },
    {
      icon: LinkedInIcon,
      href: 'https://in.linkedin.com/school/visakha-institute-of-engineering-&-technology-57th-division-narava-pin--530027-cc-nt-/',
      label: 'LinkedIn',
      className: 'bg-[#0A66C2] hover:bg-[#0958a8] text-white border-transparent',
    },
    {
      icon: InstagramIcon,
      href: 'https://www.instagram.com/visakha_college_official?igsh=MXcydnJ4ajMwd2MzMw==',
      label: 'Instagram',
      className:
        'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-white border-transparent',
    },
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden font-montserrat">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(27 79% 49% / 0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, hsl(260 75% 35% / 0.12), transparent)',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* ── Main: Brand (left) | Anti-Ragging + links (right) ── */}
        <div className="py-10 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-0">
            {/* Left — Brand, social, contact */}
            <div className="w-full lg:w-[34%] lg:shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-10 xl:pr-12 footer-v-rule">
              <img
                src="/logo-viet.png"
                alt="VIET Logo"
                className="w-auto max-w-[10rem] sm:max-w-[11.5rem] lg:max-w-[12.5rem] h-auto object-contain mb-4"
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
              />
              <h2 className="text-base sm:text-lg font-bold text-white uppercase leading-snug tracking-wide">
                Visakha Institute of Engineering &amp; Technology
              </h2>
              <p className="text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-[0.18em] text-primary mt-2">
                (Autonomous)
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm">
                Approved by AICTE New Delhi,
                <br />
                Affiliated to JNTUGV, Vizianagaram,
                <br />
                88th Division, Narava, GVMC, Visakhapatnam, Andhra Pradesh - 530027, India.
              </p>

              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${social.className}`}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>

              <div className="w-full mt-8 text-center lg:text-left [&_h3]:justify-center lg:[&_h3]:justify-start">
                <FooterSection title="Contact Us">
                  <ul className="space-y-2.5">
                    <li>
                      <a
                        href="mailto:website@viet.edu.in"
                        className="group inline-flex items-start gap-2 justify-center lg:justify-start text-[0.9375rem] text-slate-200 hover:text-white transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" aria-hidden />
                        <span>website@viet.edu.in</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+919959617476"
                        className="group inline-flex items-start gap-2 justify-center lg:justify-start text-[0.9375rem] text-slate-200 hover:text-white transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" aria-hidden />
                        <span>+91 9959617476 / 9959617477</span>
                      </a>
                    </li>
                    <li>
                      <span className="inline-flex items-start gap-2 justify-center lg:justify-start text-[0.9375rem] text-slate-200">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" aria-hidden />
                        <span>
                          88th Division, Narava, GVMC,
                          <br />
                          Visakhapatnam, Andhra Pradesh 530027, India
                        </span>
                      </span>
                    </li>
                  </ul>
                </FooterSection>
              </div>
            </div>

            {/* Right — Anti-Ragging on top, link columns below */}
            <div className="w-full lg:flex-1 lg:min-w-0 lg:pl-10 xl:pl-12 flex flex-col">
              <div className="relative pb-8 lg:pb-10 footer-cell-h-rule">
                <FooterJunction className="footer-junction--main hidden lg:block" />
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 lg:gap-8 text-center lg:text-left">
                  <img
                    src="/anti-ragging-symbol.png"
                    alt="Anti-Ragging Symbol"
                    className="w-auto max-w-[7rem] sm:max-w-[7.5rem] lg:max-w-[8rem] h-auto object-contain shrink-0 mx-auto sm:mx-0"
                    width={120}
                    height={120}
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3
                      id="footer-anti-ragging-heading"
                      className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-4 flex items-center gap-2 justify-center lg:justify-start"
                    >
                      <span className="w-6 h-px bg-primary/80 shrink-0" aria-hidden />
                      Anti-Ragging Policy
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed mb-5 text-justify">
                    Visakha Institute of Engineering & Technology, in strict compliance with UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009, AICTE Notification, 2009, Supreme Court directives, 2007 and Andhra Pradesh Prohibition of Ragging Act, 1997 as adopted by the State Govt. of Telangana, has decided to frame a Policy to Prohibit and Prevent Ragging Activities in its Campus. Ragging - A violation of Human Rights.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Link
                        to="/grievance-redressal"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" aria-hidden />
                        View Policy
                      </Link>
                      <a
                        href="tel:18001805522"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/20 text-slate-100 text-xs font-medium hover:bg-white/10 transition-colors"
                      >
                        Helpline: 1800-180-5522
                      </a>
                      <a
                        href="https://www.ugc.ac.in/antiRagging/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/20 text-slate-100 text-xs font-medium hover:bg-white/10 transition-colors"
                      >
                        UGC Portal
                        <ExternalLink className="w-3 h-3" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 lg:gap-0 pt-8 lg:pt-10">
                <div className="relative sm:pr-6 lg:pr-8 footer-v-rule">
                  <FooterJunction className="footer-junction--col hidden lg:block" />
                  <FooterSection title="Leadership">
                    <ul className="space-y-2.5">
                      {leadershipLinks.map((link) => (
                        <FooterLink key={link.name} href={link.href}>
                          {link.name}
                        </FooterLink>
                      ))}
                    </ul>
                  </FooterSection>
                </div>

                <div className="relative sm:px-6 lg:px-8 footer-v-rule">
                  <FooterJunction className="footer-junction--col hidden lg:block" />
                  <FooterSection title="Academics">
                    <ul className="space-y-2.5">
                      {academicsLinks.map((link) => (
                        <FooterLink key={link.name} href={link.href}>
                          {link.name}
                        </FooterLink>
                      ))}
                    </ul>
                  </FooterSection>
                </div>

                <div className="relative sm:pl-6 lg:pl-8">
                  <FooterSection title="Campus &amp; Support">
                    <ul className="space-y-2.5">
                      {campusLinks.map((link) => (
                        <FooterLink key={link.name} href={link.href}>
                          {link.name}
                        </FooterLink>
                      ))}
                    </ul>
                  </FooterSection>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterDottedDivider />

        {/* ── Key contacts (replaces former policy links row) ── */}
        <div className="py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                For Enquiry and Verification
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                <span className="font-semibold text-white">Contact Person:</span> P Subba Raju
                <br />
                <span className="font-semibold text-white">Phone:</span>{' '}
                <a href="tel:+919959617477" className="hover:text-primary transition-colors">9959617477</a>
                {', '}
                <a href="tel:+919959617476" className="hover:text-primary transition-colors">9959617476</a>
                <br />
                <span className="font-semibold text-white">Email:</span>{' '}
                <a href="mailto:vietvsp@gmail.com" className="hover:text-primary transition-colors">vietvsp@gmail.com</a>
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                Training and Placements
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                <span className="font-semibold text-white">Coordinator:</span> Dendukuri Devi Prasanna Varma
                <br />
                <span className="font-semibold text-white">Phone:</span>{' '}
                <a href="tel:+918886888445" className="hover:text-primary transition-colors">+91 88868 88445</a>
                <br />
                <span className="font-semibold text-white">Email:</span>{' '}
                <a href="mailto:deancdc@viet.edu.in" className="hover:text-primary transition-colors">deancdc@viet.edu.in</a>
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
                Grievance Redressal
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                For grievance submissions, please contact via WhatsApp:
                <br />
                <a href="https://wa.me/919494670501" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+91 9494670501</a>
                <br />
                <a href="https://wa.me/919550957054" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+91 9550957054</a>
              </p>
            </div>
          </div>
        </div>

        <FooterDottedDivider />

        {/* ── Bottom: copyright | visitors (center) | developer ── */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-sm">
          <p className="text-slate-200 text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Visakha Institute of Engineering &amp; Technology. All
            rights reserved.
          </p>

          <div className="flex justify-center order-1 md:order-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200">
                <Eye className="w-4 h-4 text-primary" aria-hidden />
                <span>
                  Total visitors:{' '}
                  <strong className="font-semibold text-white">
                    {visitorCount != null ? visitorCount.toLocaleString() : '—'}
                  </strong>
                </span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200">
                <Eye className="w-4 h-4 text-primary" aria-hidden />
                <span>
                  Today&apos;s visitors:{' '}
                  <strong className="font-semibold text-white">
                    {todayVisitorCount != null ? todayVisitorCount.toLocaleString() : '—'}
                  </strong>
                </span>
              </span>
            </div>
          </div>

          <p className="text-slate-300 text-center md:text-right order-3">
            Developed by <span className="text-slate-200 font-semibold">G4U Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
