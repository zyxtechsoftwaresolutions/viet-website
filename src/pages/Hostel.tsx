import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

const Hostel: React.FC = () => {
  const facilities = [
    { title: "Residential Blocks", description: "Separate hostel blocks for boys and girls with dedicated wardens, 24/7 security, and CCTV surveillance", icon: "🏢" },
    { title: "Dining Hall", description: "Hygienic mess with nutritious vegetarian and non-vegetarian meals", icon: "🍽️" },
    { title: "Recreation Rooms", description: "Indoor games, TV rooms, and common areas for social interaction", icon: "🎮" },
    { title: "Study Rooms", description: "Dedicated quiet zones with WiFi for focused academic work", icon: "📚" },
    { title: "Gym & Sports", description: "Well-equipped fitness center and outdoor sports facilities", icon: "💪" },
    { title: "Medical Care", description: "On-campus health center with 24/7 first aid services", icon: "🏥" },
    { title: "Laundry Service", description: "Automated washing machines and dry cleaning facilities", icon: "👕" },
    { title: "High-Speed WiFi", description: "Uninterrupted internet connectivity throughout the hostel premises", icon: "📡" },
  ];

  const rooms = [
    { type: "Single Occupancy", capacity: "1 student", amenities: "Attached bathroom, study table, wardrobe, AC" },
    { type: "Double Occupancy", capacity: "2 students", amenities: "Shared bathroom, study tables, wardrobes, fan" },
    { type: "Triple Occupancy", capacity: "3 students", amenities: "Common bathroom, study space, storage units" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      {/* Hero — full-width gradient, same style as Library / Laboratory */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-center text-white"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
        <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Facilities
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Our Hostel
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
              A safe, comfortable, and vibrant living environment for students. Home away from home.
            </p>
          </motion.div>
        </div>
      </section>

      <div
        className="relative overflow-hidden"
        style={{
          fontFamily: "'Libre Baskerville', 'Georgia', serif",
          background: "linear-gradient(135deg, #fdfbf7 0%, #f8f4ed 50%, #f5f0e8 100%)",
          color: "#2c3e50",
        }}
      >
        {/* Decorative background elements */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-10%",
            right: "-5%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(230, 126, 34, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-10%",
            left: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(52, 152, 219, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        {/* Intro + Stats + Boys/Girls cards */}
        <section className="relative pt-20 md:pt-28 pb-20 px-4 md:px-10 max-w-[1400px] mx-auto">
          <div className="max-w-[900px] mb-16 md:mb-20">
            <div className="text-[15px] tracking-[4px] uppercase text-[#e67e22] mb-4 font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Home Away From Home
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 bg-clip-text text-transparent"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)" }}
            >
              Hostel Life
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-[#5a6c7d] max-w-[700px] mb-10 font-light">
              Our modern hostel facilities provide a safe, comfortable, and vibrant living environment for both boys and girls in separate, well-maintained blocks. Students forge lifelong friendships and create unforgettable memories while pursuing academic excellence in a secure and supportive community.
            </p>
            <div className="flex flex-wrap gap-10 items-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#e67e22] leading-none">500+</div>
                <div className="text-sm text-[#7f8c8d] mt-2 tracking-wider uppercase">Students Accommodated</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#3498db] leading-none">24/7</div>
                <div className="text-sm text-[#7f8c8d] mt-2 tracking-wider uppercase">Security & Support</div>
              </div>
            </div>
          </div>

          {/* Gender-specific facilities */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Boys Hostel Card */}
            <div
              className="rounded-3xl p-8 md:p-10 border-2 border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-sky-50/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200/20"
              style={{ borderColor: "rgba(52, 152, 219, 0.2)" }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 rounded-tr-3xl rounded-bl-full bg-gradient-to-br from-blue-200/30 to-transparent" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Boys Hostel</h3>
              <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded mb-5" />
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                State-of-the-art residential facility designed for male students, offering a secure and conducive environment for academic growth and personal development.
              </p>
              <ul className="space-y-3">
                {["Male wardens & support staff", "Spacious common areas", "Study-friendly environment", "Sports & fitness facilities"].map((f, i) => (
                  <li key={i} className="text-slate-600 pl-7 relative">
                    <span className="absolute left-0 text-blue-500 font-bold text-lg">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Girls Hostel Card */}
            <div
              className="rounded-3xl p-8 md:p-10 border-2 border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-purple-50/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-200/20"
              style={{ borderColor: "rgba(155, 89, 182, 0.2)" }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 rounded-tr-3xl rounded-bl-full bg-gradient-to-br from-violet-200/30 to-transparent" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Girls Hostel</h3>
              <div className="w-14 h-1 bg-gradient-to-r from-violet-500 to-transparent rounded mb-5" />
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Premium accommodation exclusively for female students with enhanced security measures, creating a safe haven for learning and building lasting friendships.
              </p>
              <ul className="space-y-3">
                {["Female wardens available 24/7", "Enhanced security protocols", "Well-lit & monitored premises", "Comfortable living spaces"].map((f, i) => (
                  <li key={i} className="text-slate-600 pl-7 relative">
                    <span className="absolute left-0 text-violet-500 font-bold text-lg">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-16 md:py-20 px-4 md:px-10 max-w-[1400px] mx-auto relative">
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-12 md:mb-16">
            World-Class Facilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <div
                key={i}
                className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:border-amber-200 hover:shadow-lg cursor-default"
              >
                <div className="text-4xl md:text-5xl mb-4 grayscale-[0.2]">{f.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{f.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Room Types */}
        <section className="py-16 md:py-20 px-4 md:px-10 bg-white/40 relative">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-12 md:mb-16">
              Accommodation Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rooms.map((room, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-8 md:p-10 border-2 border-slate-200/80 bg-gradient-to-br from-amber-50/50 to-blue-50/50 relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-600">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>{room.type}</h3>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                    <span>👥</span>
                    <span>{room.capacity}</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-transparent rounded mb-4" />
                  <p className="text-slate-600 leading-relaxed">{room.amenities}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hostel Life & Rules */}
        <section className="py-16 md:py-24 px-4 md:px-10 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-sm tracking-widest uppercase text-amber-600 mb-4 font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Beyond Academics</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                A Vibrant Community Experience
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our hostel is more than just a place to sleep. It's a thriving community where students from diverse backgrounds come together, share experiences, and build networks that last a lifetime.
              </p>
              <ul className="space-y-4">
                {["Cultural festivals and celebrations", "Sports tournaments and competitions", "Study groups and peer learning", "Weekend movie nights and events", "Student-led clubs and activities"].map((item, i) => (
                  <li key={i} className="text-slate-600 pl-8 relative">
                    <span className="absolute left-0 text-amber-600 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-amber-50/80 to-blue-50/80 border-2 border-slate-200/60 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-200/20 blur-3xl" />
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 relative" style={{ fontFamily: "'Montserrat', sans-serif" }}>Hostel Rules & Guidelines</h3>
              <div className="space-y-6 relative">
                {[
                  { title: "Curfew Hours", detail: "Entry restricted after 10:00 PM on weekdays" },
                  { title: "Visitor Policy", detail: "Guests allowed in common areas with prior permission" },
                  { title: "Mess Timings", detail: "Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM" },
                  { title: "Cleanliness", detail: "Maintain room hygiene and common area etiquette" },
                ].map((rule, i) => (
                  <div key={i} className="border-l-4 border-amber-500/60 pl-5">
                    <div className="text-lg font-semibold text-slate-800 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{rule.title}</div>
                    <div className="text-slate-600">{rule.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 px-4 md:px-10 max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Need More Information?</h2>
          <p className="text-lg text-slate-600 max-w-[600px] mx-auto mb-10">
            Our hostel administration team is here to answer all your questions about accommodation, facilities, and hostel life.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white uppercase tracking-wider shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
              boxShadow: "0 10px 30px rgba(230, 126, 34, 0.3)",
            }}
          >
            Contact Hostel Office
          </Link>
        </section>
      </div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Hostel;
