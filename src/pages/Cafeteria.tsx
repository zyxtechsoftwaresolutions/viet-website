import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

/** Cafeteria gallery — bento-style grid */
const GALLERY_ITEMS = [
  { image: "/GALLERY/section2.jpg", title: "Dining area", caption: "Spacious and comfortable seating", large: true },
  { image: "/GALLERY/section3.jpg", title: "Food counter", caption: "Variety of meals and snacks" },
  { image: "/GALLERY/bg1.jpg", title: "Cafeteria space", caption: "Clean and hygienic environment" },
  { image: "/GALLERY/bg2.jpg", title: "Refreshments", caption: "Beverages and light bites" },
  { image: "/GALLERY/bg3.jpg", title: "Campus dining", caption: "A place to relax and refuel" },
  { image: "/GALLERY/bg4.jpg", title: "Student hub", caption: "Where students gather and connect", wide: true },
];

const Cafeteria = () => {
  const features = [
    {
      title: "Hygienic kitchen & serving",
      description: "Our cafeteria follows strict hygiene standards. Food is prepared in a clean kitchen and served in a well-maintained dining area for the safety and health of our students and staff.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
      title: "Variety of food",
      description: "From breakfast to lunch and evening snacks, we offer a range of vegetarian options, rice meals, curries, snacks, and beverages at affordable prices to suit different tastes.",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      title: "Comfortable seating",
      description: "The cafeteria has ample seating so students and staff can enjoy their meals in a relaxed environment. It also serves as a social space for breaks between classes.",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />
      <ScrollProgressIndicator />

      {/* Hero — site theme */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-end text-white overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} aria-hidden />
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
              Cafeteria & Canteen
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins mb-6">
              A hygienic, spacious cafeteria offering a variety of meals, snacks, and beverages at affordable prices for students and staff.
            </p>
            <a href="#gallery" className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg">
              View gallery
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="rgb(248 250 252)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* About Cafeteria */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            className="max-w-3xl text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">About</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
              Cafeteria at VIET
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-6">
              Our college cafeteria provides a clean, comfortable space for students and staff to enjoy meals and refreshments throughout the day. We focus on hygiene, variety, and affordability so that everyone on campus can eat well without leaving the premises.
            </p>
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
              The cafeteria is open during college hours and serves breakfast, lunch, and evening snacks. It also doubles as a social space where students can take a break, catch up with friends, and recharge before the next class.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cafeteria gallery — one viewport height, scales with window size */}
      <section
        id="gallery"
        className="min-h-screen bg-slate-100 border-t border-slate-200 scroll-mt-24 flex flex-col"
        style={{ minHeight: "100vh" }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col flex-1 min-h-0 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shrink-0 pt-6 pb-3 md:pt-8 md:pb-4 flex flex-wrap items-end justify-between gap-2 text-left"
          >
            <div>
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-0.5">Gallery</p>
              <h2 className="text-base md:text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">Our dining space</h2>
            </div>
            <p className="text-slate-600 text-xs md:text-sm max-w-sm">
              Dining area, food counters, and where students and staff enjoy their meals.
            </p>
          </motion.div>
          <div className="flex-1 min-h-0 w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 lg:gap-3 grid-rows-6 md:grid-rows-[1fr_1fr_1fr_0.5fr] pb-6 md:pb-8">
            {GALLERY_ITEMS.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.25) }}
                className={`group relative overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-slate-200 hover:shadow-md transition-shadow min-h-0 h-full
                  ${item.large ? "md:row-span-2" : item.wide ? "md:col-span-2" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 lg:p-2.5 text-white text-left">
                  <h3 className="text-[10px] md:text-xs lg:text-sm font-bold drop-shadow-md truncate">{item.title}</h3>
                  {item.caption && <p className="text-white/90 text-[9px] md:text-[10px] lg:text-xs truncate">{item.caption}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Hygienic, Variety, Seating */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Why our cafeteria</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">What we offer</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {features.map((fac, i) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-10 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fac.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{fac.title}</h3>
                <p className="text-slate-600 text-[1.0625rem] leading-relaxed">{fac.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-left flex flex-col md:flex-row md:items-center md:gap-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mb-4 md:mb-0">
              <UtensilsCrossed className="w-8 h-8" aria-hidden />
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Contact</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">Visit the cafeteria</h2>
              <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
              <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-6">
                The cafeteria is located on campus and is open during college hours. For any queries regarding food services or timings, please contact the administration or visit the cafeteria in person.
              </p>
              <a href="mailto:admissions@viet.edu.in?subject=Cafeteria enquiry" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
                Enquire
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cafeteria;
