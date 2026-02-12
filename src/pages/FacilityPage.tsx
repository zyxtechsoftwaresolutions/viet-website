import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI, transportRoutesAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import NotFound from './NotFound';

const COLOR_ORDER = [
  'from-indigo-500 to-blue-600',
  'from-indigo-600 to-slate-700',
  'from-blue-500 to-indigo-600',
  'from-slate-600 to-indigo-700',
];

const FacilityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [transportRoutes, setTransportRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const [pageData, routes] = await Promise.all([
          pagesAPI.getBySlug(slug).catch(() => null),
          slug === 'transport' ? transportRoutesAPI.getAll().catch(() => []) : Promise.resolve([]),
        ]);
        if (pageData && (pageData.category || '').toLowerCase() === 'facilities') {
          setPage(pageData);
          if (Array.isArray(routes) && routes.length > 0) {
            setTransportRoutes(
              routes.map((r: any, i: number) => ({
                id: String(r.id),
                name: r.name ?? `Route ${i + 1}`,
                from: r.from ?? '',
                to: r.to ?? 'VIET Campus, Narava',
                stops: r.stops ?? 0,
                time: r.time ?? '',
                freq: r.frequency ?? 'Morning & Evening',
                color: COLOR_ORDER[i % COLOR_ORDER.length],
                busNo: r.bus_no ?? r.busNo ?? '',
                driverName: r.driver_name ?? r.driverName ?? '',
                driverContactNo: r.driver_contact_no ?? r.driverContactNo ?? '',
                seatingCapacity: r.seating_capacity ?? r.seatingCapacity ?? 0,
                image: r.image ?? '/placeholder.svg',
              }))
            );
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !page) {
    return <NotFound />;
  }

  const content = page.content || {};
  const hero = content.hero || {};
  const heroTitle = hero.title || page.title;
  const heroDescription = hero.description || '';
  const heroImage = hero.heroImage || content.heroImage;
  const mainContent = content.mainContent || '';
  const stats = Array.isArray(content.stats) && content.stats.length > 0
    ? content.stats
    : [];
  const features = Array.isArray(content.features) && content.features.length > 0
    ? content.features
    : [];
  const gallery = Array.isArray(content.gallery) ? content.gallery : [];
  const mapEmbed = content.mapEmbed || '';
  const isTransport = slug === 'transport';

  const iconSvg = (icon: string) => {
    switch (icon) {
      case 'shield':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
      case 'map':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4-2v-8l-4-2m-2 0l-4 2v8l4-2" />;
      case 'star':
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />
      <ScrollProgressIndicator />

      {/* Hero */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-end text-white"
        style={{
          background: heroImage
            ? `linear-gradient(155deg, rgba(15,23,42,0.9) 0%, rgba(49,46,129,0.85) 35%, rgba(30,58,138,0.9) 70%, rgba(15,23,42,0.95) 100%)`
            : 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
        }}
      >
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${imgUrl(heroImage)})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
        <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
          <motion.div
            className="max-w-2xl text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Facilities
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              {heroTitle}
            </h1>
            {heroDescription && (
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
                {heroDescription}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {stats.map((stat: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="text-2xl md:text-3xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-slate-600 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      {mainContent && (
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <div
              className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
          </div>
        </section>
      )}

      {/* Transport routes (transport only) */}
      {isTransport && transportRoutes.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-left"
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Routes</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-2">Bus Routes</h2>
              <div className="h-px w-16 bg-indigo-400 mb-4" />
              <p className="text-slate-600">Pick-up and drop services to VIET campus, Narava</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transportRoutes.map((route: any, i: number) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative min-h-[200px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:border-indigo-200 transition-all"
                >
                  <div className="text-slate-500 text-xs font-mono mb-1">ROUTE {String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{route.name}</h3>
                  <p className="text-slate-700 text-sm">{route.from} → {route.to}</p>
                  {route.busNo && <p className="text-slate-500 text-sm mt-1">Bus: {route.busNo}</p>}
                  {route.driverName && <p className="text-slate-500 text-sm">Driver: {route.driverName}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {iconSvg(f.icon || 'star')}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-600 text-sm">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-200"
                >
                  <img
                    src={imgUrl(img.url)}
                    alt={img.alt || ''}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map embed */}
      {mapEmbed && (
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
              {mapEmbed.trim().startsWith('<') ? (
                <div dangerouslySetInnerHTML={{ __html: mapEmbed }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
              ) : (
                <iframe
                  src={mapEmbed}
                  title="Location map"
                  className="w-full h-full min-h-[300px]"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default FacilityPage;
