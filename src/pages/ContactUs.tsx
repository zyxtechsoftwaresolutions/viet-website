import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Building2,
} from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import FacilityWaveHero from '@/components/FacilityWaveHero';
import { pagesAPI } from '@/lib/api';
import { resolveLeaderHeroImage } from '@/lib/imageUtils';
import {
  AUTHORITY_CONTACTS,
  COLLEGE_INFO,
  KEY_CONTACTS,
  MAP_DIRECTIONS_URL,
  MAP_EMBED_URL,
  type AuthorityContact,
} from '@/lib/contactContent';

type AuthorityDisplay = AuthorityContact & { imageUrl: string };

const ContactUs = () => {
  const [authorities, setAuthorities] = useState<AuthorityDisplay[]>(
    AUTHORITY_CONTACTS.map((authority) => ({ ...authority, imageUrl: '/chairmanedit.jpeg' }))
  );

  useEffect(() => {
    let active = true;

    const loadAuthorityImages = async () => {
      const enriched = await Promise.all(
        AUTHORITY_CONTACTS.map(async (authority) => {
          try {
            const page = await pagesAPI.getBySlug(authority.slug);
            const content = (page?.content || {}) as Record<string, unknown>;
            const profile = content.profile as Record<string, unknown> | undefined;
            const cmsName =
              typeof profile?.name === 'string' && profile.name.trim() ? profile.name.trim() : authority.name;

            return {
              ...authority,
              name: cmsName,
              imageUrl: resolveLeaderHeroImage(content),
            };
          } catch {
            return { ...authority, imageUrl: '/chairmanedit.jpeg' };
          }
        })
      );

      if (active) setAuthorities(enriched);
    };

    loadAuthorityImages();
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />

      <FacilityWaveHero
        badge="Get in touch"
        title="Contact Us"
        description="Reach VIET for admissions, academic queries, placements, and campus support. We are here to help students, parents, and visitors."
        gradient="linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)"
        waveFill="rgb(248 250 252)"
        showDotPattern
        align="end"
      />

      {/* College details + map */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
                  Campus
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
                  College Details
                </h2>
                <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
                <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
                  {COLLEGE_INFO.name} is located at Narava, Visakhapatnam — easily accessible from
                  major areas of the city. Use the map for directions or contact the numbers below
                  for admissions and general enquiries.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Institution</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{COLLEGE_INFO.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{COLLEGE_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <div className="space-y-1">
                      {COLLEGE_INFO.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="block text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <div className="space-y-1">
                      {COLLEGE_INFO.emails.map((email) => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="block text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3>
                    <p className="text-slate-600 text-sm">{COLLEGE_INFO.officeHours}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
                Location
              </p>
              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Campus Map</h3>
              <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] min-h-[320px]">
                <iframe
                  title="VIET campus location on Google Maps"
                  src={MAP_EMBED_URL}
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Get directions on Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authorities */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Leadership
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">
              College Authorities
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed max-w-3xl">
              Contact details and profile pages for VIET leadership. For direct phone or email to a
              specific office, use the key contacts section below.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorities.map((authority, i) => (
              <motion.div
                key={authority.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={authority.profileHref || '#'}
                  className="group relative block overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all min-h-[300px]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${authority.imageUrl})` }}
                    role="img"
                    aria-label={authority.name}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
                    aria-hidden
                  />
                  <div className="relative z-10 flex flex-col justify-end min-h-[300px] p-6 text-left">
                    <p className="text-xs font-semibold tracking-wider text-indigo-200 uppercase mb-1">
                      {authority.role}
                    </p>
                    <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                      {authority.name}
                    </h3>
                    {authority.note && (
                      <p className="text-sm text-white/80 mb-4 leading-relaxed line-clamp-2">
                        {authority.note}
                      </p>
                    )}
                    {authority.phone && (
                      <a
                        href={`tel:${authority.phone.replace(/\s/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block text-sm text-indigo-200 hover:text-white mb-1"
                      >
                        {authority.phone}
                      </a>
                    )}
                    {authority.email && (
                      <a
                        href={`mailto:${authority.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block text-sm text-indigo-200 hover:text-white mb-3"
                      >
                        {authority.email}
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">
                      View profile
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key contacts */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Departments
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">
              Key Contacts
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {KEY_CONTACTS.map((contact, i) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 p-8 rounded-2xl border-l-4 border-indigo-600 border border-slate-200 text-left"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">{contact.title}</h3>
                {contact.person && (
                  <p className="text-slate-600 mb-2">
                    <span className="font-semibold text-slate-800">Contact: </span>
                    {contact.person}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-slate-600 mb-2">
                    <span className="font-semibold text-slate-800">Phone: </span>
                    {contact.phone.split(',').map((part, idx) => {
                      const trimmed = part.trim();
                      const digits = trimmed.replace(/[^\d+]/g, '');
                      return (
                        <span key={trimmed}>
                          {idx > 0 && ', '}
                          <a href={`tel:${digits}`} className="text-indigo-600 hover:text-indigo-800">
                            {trimmed}
                          </a>
                        </span>
                      );
                    })}
                  </p>
                )}
                {contact.email && (
                  <p className="text-slate-600 mb-2">
                    <span className="font-semibold text-slate-800">Email: </span>
                    <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:text-indigo-800">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.extra && <p className="text-slate-600 text-sm leading-relaxed">{contact.extra}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
