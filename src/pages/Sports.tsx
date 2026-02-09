import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

/** Grid items for "A glimpse into VIET sports" — LPU-style image grid */
const GLIMPSE_ITEMS = [
  { image: "/GALLERY/section2.jpg", title: "Sports achievements", caption: "Our teams in action" },
  { image: "/GALLERY/section3.jpg", title: "Tournaments & events", caption: "Inter-college competitions" },
  { image: "/GALLERY/bg1.jpg", title: "Indoor sports", caption: "Dedicated sports room" },
  { image: "/GALLERY/bg2.jpg", title: "PT & fitness", caption: "Expert training and guidance" },
  { image: "/GALLERY/bg3.jpg", title: "Campus sports", caption: "Building team spirit" },
];

/** Hall of Fame — achievers to showcase (replace with real names & achievements) */
const HALL_OF_FAME = [
  { name: "Student Achiever", achievement: "Gold medal at Inter-College Cricket Tournament", sport: "Cricket", year: "2024" },
  { name: "Team Champions", achievement: "Runners-up at Zonal Volleyball Championship", sport: "Volleyball", year: "2024" },
  { name: "Individual Excellence", achievement: "Best player award at District Badminton Meet", sport: "Badminton", year: "2023" },
  { name: "Kho-Kho Squad", achievement: "Winners at State Inter-College Kho-Kho", sport: "Kho-Kho", year: "2023" },
];

const Sports = () => {

  const sportsOffered = [
    { name: "Volleyball", category: "Outdoor" },
    { name: "Cricket", category: "Outdoor" },
    { name: "Kho-Kho", category: "Outdoor" },
    { name: "Badminton", category: "Indoor" },
    { name: "Table Tennis", category: "Indoor" },
    { name: "Chess", category: "Indoor" },
    { name: "Carroms", category: "Indoor" },
    { name: "Throw Ball", category: "Outdoor" },
    { name: "Other Indoor Games", category: "Indoor" },
  ];

  const facilities = [
    {
      title: "Dedicated Indoor Sports Room",
      description: "A fully equipped indoor sports room for badminton, table tennis, chess, carroms, and other indoor games. Available for practice and inter-college events.",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      title: "Expertised Physical Training (PT)",
      description: "Our college has dedicated and experienced PT staff to train students in various sports, conduct fitness sessions, and prepare teams for tournaments.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
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
              Sports & Games
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins mb-6">
              A dedicated indoor sports room, expert PT staff, and a wide range of indoor and outdoor games for fitness and fun.
            </p>
            <a href="#sports-offered" className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg">
              Sports we offer
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="rgb(248 250 252)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* About Sports — Chairman spacing, left-aligned */}
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
              Sports at VIET
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-6">
              Our college encourages students to stay active and build team spirit through a variety of sports and games. We offer volleyball, cricket, kho-kho, badminton, table tennis, chess, carroms, throw ball, and other indoor games.
            </p>
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
              We have a dedicated indoor sports room for indoor games and expertised Physical Training (PT) staff to guide and train students in sports and fitness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* A glimpse into VIET sports — LPU-style image grid */}
      <section className="py-20 md:py-28 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Gallery</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">A glimpse into VIET sports</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              Highlights from our sports facilities, events, and campus activities.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {GLIMPSE_ITEMS.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.35) }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-slate-200 aspect-[4/3] hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white text-left">
                  <h3 className="text-base md:text-lg font-bold drop-shadow-md">{item.title}</h3>
                  {item.caption && <p className="text-white/90 text-sm mt-0.5">{item.caption}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Hall of Fame — LPU-style achievers */}
      <section id="hall-of-fame" className="py-20 md:py-28 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Achievers</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Hall of Fame</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              From local triumphs to zonal and state-level victories, our students and teams redefine success on and off the field.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {HALL_OF_FAME.map((entry, i) => (
              <motion.article
                key={`${entry.name}-${entry.sport}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.3) }}
                className="group bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Trophy className="w-7 h-7" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{entry.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-2">{entry.achievement}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {entry.sport}
                  </span>
                  {entry.year && (
                    <span className="text-xs text-slate-500">{entry.year}</span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Sports we offer — grid */}
      <section id="sports-offered" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">What we offer</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Sports we offer</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              Indoor and outdoor games for all students. Practice and compete in a supportive environment.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-left">
            {sportsOffered.map((sport, i) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${sport.category === "Indoor" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}`}>
                  {sport.category}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{sport.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities — Indoor sports room + PT */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Facilities</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Our sports facilities</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {facilities.map((fac, i) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-10 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
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
            className="max-w-2xl text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Contact</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">Interested in sports?</h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-8">
              For sports activities, PT sessions, or representing the college in tournaments, get in touch with the sports cell or PT staff at the campus.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:admissions@viet.edu.in?subject=Sports enquiry" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
                Contact sports cell
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sports;
