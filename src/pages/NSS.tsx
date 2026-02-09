import React from "react";
import { motion } from "framer-motion";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

const NSSPage = () => {
  const objectives = [
    { title: "Personality Development", icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" },
    { title: "Social Responsibility", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
    { title: "Leadership Skills", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
    { title: "Community Service", icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
    { title: "Bridge Building", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
    { title: "Value Education", icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" },
    { title: "Awareness Programs", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" },
    { title: "National Integration", icon: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" },
  ];

  const activities = [
    { title: "Blood Donation Camps", icon: "M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4Z" },
    { title: "Tree Plantation", icon: "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" },
    { title: "Cleanliness Campaigns", icon: "M21.03,3L18,20.31C17.83,21.27 17,22 16,22H8C7,22 6.17,21.27 6,20.31L2.97,3H21.03M5.36,5L8,20H16L18.64,5H5.36M9,18V14H13V18H15V14L12,10.5L9,14V18H9Z" },
    { title: "Health Awareness", icon: "M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2L4.5,3.5L3,2V22L4.5,20.5L6,22L7.5,20.5L9,22L10.5,20.5L12,22L13.5,20.5L15,22L16.5,20.5L18,22L19.5,20.5L21,22V2L19.5,3.5M19,19H5V5H19V19M6,15H18V17H6V15M6,11H18V13H6V11M6,7H18V9H6V7Z" },
    { title: "Rural Development", icon: "M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z" },
    { title: "Literacy Programs", icon: "M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z" },
    { title: "Disaster Relief", icon: "M12,2L4,5V11.09C4,16.14 7.41,20.85 12,22C16.59,20.85 20,16.14 20,11.09V5L12,2M18,11.09C18,15.09 15.45,18.79 12,19.92C8.55,18.79 6,15.1 6,11.09V6.39L12,4.14L18,6.39V11.09M9.5,11A1.5,1.5 0 0,1 11,9.5A1.5,1.5 0 0,1 12.5,11A1.5,1.5 0 0,1 11,12.5A1.5,1.5 0 0,1 9.5,11M14.5,11A1.5,1.5 0 0,1 16,9.5A1.5,1.5 0 0,1 17.5,11A1.5,1.5 0 0,1 16,12.5A1.5,1.5 0 0,1 14.5,11M11,14H13V15.5H11V14Z" },
    { title: "Women Empowerment", icon: "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" },
    { title: "Environmental Programs", icon: "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z" },
    { title: "Slum Adoption", icon: "M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" },
    { title: "Community Outreach", icon: "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,12.5A1.5,1.5 0 0,1 10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M12,7.2C9.9,7.2 8.2,8.9 8.2,11C8.2,14 12,17.5 12,17.5C12,17.5 15.8,14 15.8,11C15.8,8.9 14.1,7.2 12,7.2Z" },
    { title: "Youth Development", icon: "M12,8A3,3 0 0,0 9,11A3,3 0 0,0 12,14A3,3 0 0,0 15,11A3,3 0 0,0 12,8M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />
      <ScrollProgressIndicator />

      {/* Hero — site theme (slate/indigo gradient) */}
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
              Empowering through service
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              National Service Scheme
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins mb-6">
              Not Me, But You — Building tomorrow&apos;s leaders through community service and social responsibility.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#join" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg">
                Join NSS
              </a>
              <a href="#activities" className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                Our Activities
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="rgb(248 250 252)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* About NSS — Chairman spacing, left-aligned */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">About</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight">
                About NSS
              </h2>
              <div className="h-px w-16 bg-indigo-400" aria-hidden />
              <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
                The National Service Scheme (NSS) at our college is a vibrant platform for students to engage in community service and contribute to nation-building. Since its inception, NSS has been instrumental in developing the personality and character of students through voluntary community service.
              </p>
              <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
                Our NSS unit works on the principle of &quot;Education through Service&quot; and aims to instill social and civic responsibility among students while providing opportunities for personal growth through community service.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { value: "500+", label: "Active Volunteers", bg: "from-indigo-50 to-indigo-100", text: "text-indigo-700" },
                { value: "50+", label: "Annual Projects", bg: "from-blue-50 to-blue-100", text: "text-blue-700" },
                { value: "1000+", label: "Hours of Service", bg: "from-slate-50 to-slate-100", text: "text-slate-700" },
                { value: "20+", label: "Community Partners", bg: "from-indigo-50 to-slate-100", text: "text-slate-700" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${stat.bg} p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all`}
                >
                  <div className={`text-2xl md:text-3xl font-bold ${stat.text}`}>{stat.value}</div>
                  <div className="text-slate-600 font-medium text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NSS Objectives — site theme */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Objectives</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">NSS Objectives</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center flex-shrink-0 w-36 group cursor-default"
              >
                <div className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d={obj.icon} /></svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {obj.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Activities */}
      <section id="activities" className="py-20 md:py-28 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">What we do</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Key Activities</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center flex-shrink-0 w-36 group cursor-default"
              >
                <div className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d={act.icon} /></svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Special Camp — site theme gradient */}
      <section className="py-20 md:py-28 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #312e81 0%, #1e3a8a 50%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, transparent 48%, white 49%, white 51%, transparent 52%)", backgroundSize: "20px 20px" }} aria-hidden />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-left">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Annual Special Camp</h2>
            <div className="h-px w-16 bg-white/50 rounded-full mb-6" aria-hidden />
            <p className="text-lg text-indigo-100 leading-relaxed mb-8">
              Every year, our NSS volunteers participate in a 7-day residential special camp in adopted villages. This immersive experience allows students to understand rural life, implement community development projects, and make a tangible difference in people&apos;s lives.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { value: "7 Days", label: "Residential Camp" },
                { value: "100+", label: "Volunteers" },
                { value: "Multiple", label: "Villages Adopted" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                  <div className="text-indigo-100 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join NSS — Chairman spacing */}
      <section id="join" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Get involved</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">Join Our NSS Family</h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-10">
              Become a part of our vibrant NSS community and make a difference in society while developing your own personality, leadership skills, and social awareness. Join us in our mission to serve the nation.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 rounded-2xl border-l-4 border-indigo-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Eligibility</h3>
                <ul className="text-slate-600 space-y-2 text-left">
                  {["Currently enrolled student of the college", "Willing to volunteer 120 hours per year", "Passionate about social service", "Committed to community development"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Benefits</h3>
                <ul className="text-slate-600 space-y-2 text-left">
                  {["NSS Certificate on completion", "Leadership development opportunities", "Personal growth and skill enhancement", "Preference in placements and higher studies"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href="mailto:admissions@viet.edu.in?subject=NSS Registration"
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              Register for NSS
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact — site theme */}
      <section className="py-20 md:py-28 bg-slate-900 text-white border-t border-slate-700">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-lg font-bold mb-3 text-indigo-300">NSS Programme Officer</h3>
              <p className="text-slate-300">Contact via college office</p>
              <a href="mailto:admissions@viet.edu.in" className="text-slate-400 hover:text-white">admissions@viet.edu.in</a>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-indigo-300">Office Hours</h3>
              <p className="text-slate-300">Monday – Friday</p>
              <p className="text-slate-400">9:00 AM – 5:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-indigo-300">Location</h3>
              <p className="text-slate-300">NSS Office, VIET Campus</p>
              <p className="text-slate-400">Narava, Visakhapatnam</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NSSPage;
