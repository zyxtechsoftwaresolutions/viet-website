import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import { pagesAPI, transportRoutesAPI } from "@/lib/api";

// Fallback data: bus no, driver, contact, capacity, image for hover
const DEFAULT_ROUTES = [
  { id: "01", name: "Route 1", from: "Dwaraka Nagar / NAD Kotha Road", to: "VIET Campus, Narava", stops: 8, time: "25 min", freq: "Morning & Evening", color: "from-indigo-500 to-blue-600", busNo: "AP 31 TB 1234", driverName: "K. Venkata Rao", driverContactNo: "+91 98765 43210", seatingCapacity: 45, image: "/footer bg/collegeimage.jpeg" },
  { id: "02", name: "Route 2", from: "Gajuwaka / Kancharapalem", to: "VIET Campus, Narava", stops: 6, time: "20 min", freq: "Morning & Evening", color: "from-indigo-600 to-slate-700", busNo: "AP 31 TB 2345", driverName: "M. Siva Kumar", driverContactNo: "+91 98765 43211", seatingCapacity: 42, image: "/footer bg/fbg1.jpg" },
  { id: "03", name: "Route 3", from: "MVP Colony / Siripuram", to: "VIET Campus, Narava", stops: 10, time: "30 min", freq: "Morning & Evening", color: "from-blue-500 to-indigo-600", busNo: "AP 31 TB 3456", driverName: "P. Ramesh", driverContactNo: "+91 98765 43212", seatingCapacity: 48, image: "/footer bg/fbg2.jpg" },
  { id: "04", name: "Route 4", from: "Industrial Area / Parawada", to: "VIET Campus, Narava", stops: 7, time: "22 min", freq: "Morning & Evening", color: "from-slate-600 to-indigo-700", busNo: "AP 31 TB 4567", driverName: "S. Srinivas", driverContactNo: "+91 98765 43213", seatingCapacity: 44, image: "/footer bg/fbg3.jpg" },
];

const DEFAULT_STATS = [
  { value: "24+", label: "Buses" },
  { value: "4", label: "Main Routes" },
  { value: "Visakhapatnam", label: "Coverage" },
  { value: "Narava", label: "Campus" },
];

const DEFAULT_WHY_FEATURES = [
  { title: "Safe & Punctual", description: "Regular schedules and trained drivers for safe, on-time pick-up and drop from campus.", icon: "shield", accent: "indigo" },
  { title: "Wide Coverage", description: "Buses cover major areas in and around Visakhapatnam so students and staff can commute easily.", icon: "map", accent: "blue" },
  { title: "Affordable", description: "Transport fee is part of the fee structure, making daily commute to VIET campus hassle-free.", icon: "payment", accent: "emerald" },
  { title: "Comfortable", description: "Well-maintained buses with adequate seating for a comfortable journey to and from Narava campus.", icon: "bus", accent: "slate" },
];

const COLOR_ORDER = ["from-indigo-500 to-blue-600", "from-indigo-600 to-slate-700", "from-blue-500 to-indigo-600", "from-slate-600 to-indigo-700"];

const Transport = () => {
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [routesList, setRoutesList] = useState<typeof DEFAULT_ROUTES>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [page, apiRoutes] = await Promise.all([
          pagesAPI.getBySlug("transport").catch(() => null),
          transportRoutesAPI.getAll().catch(() => []),
        ]);
        setPageContent(page?.content || null);
        if (Array.isArray(apiRoutes) && apiRoutes.length > 0) {
          setRoutesList(
            apiRoutes.map((r: any, i: number) => ({
              id: String(r.id),
              name: r.name ?? `Route ${i + 1}`,
              from: r.from ?? "",
              to: r.to ?? "VIET Campus, Narava",
              stops: r.stops ?? 0,
              time: r.time ?? "",
              freq: r.frequency ?? "Morning & Evening",
              color: COLOR_ORDER[i % COLOR_ORDER.length],
              busNo: r.busNo ?? "",
              driverName: r.driverName ?? "",
              driverContactNo: r.driverContactNo ?? "",
              seatingCapacity: r.seatingCapacity ?? 0,
              image: r.image ?? "/placeholder.svg",
            }))
          );
        } else {
          setRoutesList(DEFAULT_ROUTES);
        }
      } catch {
        setPageContent(null);
        setRoutesList(DEFAULT_ROUTES);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroTitle = pageContent?.hero?.title ?? "Campus Transport";
  const heroDescription = pageContent?.hero?.description ?? "VIET provides safe and reliable bus transport for students and staff from various points in and around Visakhapatnam to our campus at Narava.";
  const introParagraph = pageContent?.mainContent ?? null;
  const routes = routesList;
  const stats = (pageContent?.stats && Array.isArray(pageContent.stats) && pageContent.stats.length > 0)
    ? pageContent.stats.map((s: any) => ({ value: s.value ?? "", label: s.label ?? "" }))
    : DEFAULT_STATS;
  const whyFeatures = (pageContent?.features && Array.isArray(pageContent.features) && pageContent.features.length > 0)
    ? pageContent.features.map((f: any, i: number) => ({
        title: f.title ?? "",
        description: f.description ?? "",
        icon: f.icon ?? DEFAULT_WHY_FEATURES[i % DEFAULT_WHY_FEATURES.length].icon,
        accent: DEFAULT_WHY_FEATURES[i % DEFAULT_WHY_FEATURES.length].accent,
      }))
    : DEFAULT_WHY_FEATURES;

  const accentClasses: Record<string, string> = {
    indigo: "bg-indigo-500/10 border-indigo-200 text-indigo-700 hover:border-indigo-300",
    blue: "bg-blue-500/10 border-blue-200 text-blue-700 hover:border-blue-300",
    emerald: "bg-emerald-500/10 border-emerald-200 text-emerald-700 hover:border-emerald-300",
    slate: "bg-slate-500/10 border-slate-200 text-slate-700 hover:border-slate-300",
  };

  const iconSvg = (icon: string) => {
    switch (icon) {
      case "shield":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
      case "map":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4-2v-8l-4-2m-2 0l-4 2v8l4-2" />;
      case "payment":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />;
      case "bus":
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />

      {/* Hero — data from API or fallback */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-end text-white"
        style={{ background: "linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)" }}
      >
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
              {loading ? "Campus Transport" : heroTitle}
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats — Chairman spacing, left-aligned */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="text-2xl md:text-3xl font-bold text-indigo-600">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional intro from old page / API */}
      {introParagraph && (
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <div
              className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: typeof introParagraph === "string" ? introParagraph : "" }}
            />
          </div>
        </section>
      )}

      {/* Active Routes — Chairman spacing, left-aligned */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Routes</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Bus Routes</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600">Pick-up and drop services to VIET campus, Narava</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {routes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm text-left
                  transition-[box-shadow,border-color,transform] duration-500 ease-out
                  hover:shadow-xl hover:border-indigo-200 hover:-translate-y-0.5"
              >
                {/* Default card content: Bus No, Driver Name, Driver Contact, Seating Capacity */}
                <div className="relative z-0 h-full bg-slate-50 p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-slate-500 text-xs font-mono mb-1">ROUTE {String(i + 1).padStart(2, "0")}</div>
                      <h3 className="text-xl font-bold text-slate-900">{route.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                      <div className="text-right flex flex-col gap-0.5 max-w-[180px] sm:max-w-[220px]">
                        <span className="text-slate-800 text-sm font-semibold leading-tight block">
                          {route.from}
                        </span>
                        <span className="text-slate-500 text-xs font-medium mb-0.5">↓</span>
                        <span className="text-slate-800 text-sm font-semibold leading-tight block">
                          {route.to}
                        </span>
                      </div>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${route.color} flex items-center justify-center text-white flex-shrink-0`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-medium uppercase w-28">Bus No</span>
                      <span className="font-mono font-bold text-slate-900">{route.busNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-medium uppercase w-28">Driver Name</span>
                      <span className="font-semibold text-slate-800">{route.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-medium uppercase w-28">Driver Contact</span>
                      <a href={`tel:${route.driverContactNo?.replace(/\s/g, "")}`} className="font-mono text-sm font-semibold text-indigo-600 hover:underline">{route.driverContactNo}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-medium uppercase w-28">Seating Capacity</span>
                      <span className="font-mono font-bold text-slate-800">{route.seatingCapacity} seats</span>
                    </div>
                  </div>
                </div>

                {/* Hover overlay: image + glass effect + bottom text (driver name, bus no) — smoother animation */}
                <div
                  className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500 ease-out"
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                    style={{ backgroundImage: `url(${route.image || "/placeholder.svg"})` }}
                  />
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity duration-500 ease-out" />
                  <div className="relative z-10 px-5 py-4 bg-white/15 backdrop-blur-xl border-t border-white/20">
                    <p className="text-white font-semibold text-lg drop-shadow-md">
                      {route.driverName} · Bus {route.busNo}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why our transport — enhanced section, refined colours */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-3">Why our transport</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg max-w-2xl">
              VIET’s transport facility ensures safe, punctual, and comfortable travel for students and staff between the campus at Narava and key locations in Visakhapatnam.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {whyFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${accentClasses[feature.accent] || accentClasses.slate}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {iconSvg(feature.icon)}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-[1rem] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact only — no download app */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Contact</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">Get in touch</h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-8">
              For transport routes, timings, and fee-related queries, contact the college office.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Phone</div>
                  <a href="tel:+919959617477" className="font-semibold text-slate-900 hover:text-indigo-600">+91-9959617477</a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Email</div>
                  <a href="mailto:admissions@viet.edu.in" className="font-semibold text-slate-900 hover:text-indigo-600">admissions@viet.edu.in</a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Campus</div>
                  <span className="font-semibold text-slate-900">VIET, Narava, Visakhapatnam</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Transport;
