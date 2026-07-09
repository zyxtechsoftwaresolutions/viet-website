import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const Hostel: React.FC = () => {
  const { hero, content } = useFacilityCms("hostel");

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      <FacilityWaveHero
        badge={hero.badge}
        title={hero.title}
        description={hero.description}
        heroImage={hero.heroImage}
        video={hero.video}
        gradient={hero.gradient}
        waveFill={hero.waveFill}
        align={hero.align}
      />

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
              {content.intro.label}
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 bg-clip-text text-transparent"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)" }}
            >
              {content.intro.title}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-[#5a6c7d] max-w-[700px] mb-10 font-light">
              {content.intro.description}
            </p>
            <div className="flex flex-wrap gap-10 items-center">
              {content.intro.stats.map((stat, i) => (
                <div key={i}>
                  <div className={`text-4xl md:text-5xl font-bold leading-none ${i === 0 ? "text-[#e67e22]" : "text-[#3498db]"}`}>{stat.value}</div>
                  <div className="text-sm text-[#7f8c8d] mt-2 tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
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
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.boysHostel.title}</h3>
              <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded mb-5" />
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                {content.boysHostel.description}
              </p>
              <ul className="space-y-3">
                {content.boysHostel.features.map((f, i) => (
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
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.girlsHostel.title}</h3>
              <div className="w-14 h-1 bg-gradient-to-r from-violet-500 to-transparent rounded mb-5" />
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                {content.girlsHostel.description}
              </p>
              <ul className="space-y-3">
                {content.girlsHostel.features.map((f, i) => (
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
            {content.facilities.map((f, i) => (
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
              {content.rooms.map((room, i) => (
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
              <div className="text-sm tracking-widest uppercase text-amber-600 mb-4 font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.community.label}</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {content.community.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {content.community.description}
              </p>
              <ul className="space-y-4">
                {content.community.items.map((item, i) => (
                  <li key={i} className="text-slate-600 pl-8 relative">
                    <span className="absolute left-0 text-amber-600 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-amber-50/80 to-blue-50/80 border-2 border-slate-200/60 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-200/20 blur-3xl" />
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 relative" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.rules.title}</h3>
              <div className="space-y-6 relative">
                {content.rules.rules.map((rule, i) => (
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
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{content.cta.title}</h2>
          <p className="text-lg text-slate-600 max-w-[600px] mx-auto mb-10">
            {content.cta.description}
          </p>
          <Link
            to={content.cta.buttonHref}
            className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white uppercase tracking-wider shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
              boxShadow: "0 10px 30px rgba(230, 126, 34, 0.3)",
            }}
          >
            {content.cta.buttonText}
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Hostel;
