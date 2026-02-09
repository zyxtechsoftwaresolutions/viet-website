import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Wifi, MapPin, Coffee } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

const Library = () => {
  const features = [
    { icon: BookOpen, title: "Vast Collection", description: "50,000+ books, journals, magazines, and reference materials" },
    { icon: Users, title: "Spacious Reading Hall", description: "Seating capacity for 500+ students with comfortable furniture" },
    { icon: Wifi, title: "Free Wi-Fi", description: "High-speed internet access for research and online resources" },
    { icon: Clock, title: "Extended Hours", description: "Open from 8 AM to 8 PM on weekdays, 9 AM to 5 PM on weekends" },
    { icon: Coffee, title: "Refreshment Zone", description: "Cafeteria nearby for snacks and beverages" },
    { icon: MapPin, title: "Central Location", description: "Located in the main academic building, easily accessible" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      {/* Hero — Chairman-style spacing */}
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
              Our Library
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
              A place of knowledge, inspiration, and academic excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About — Chairman-style section */}
      <section className="py-20 md:py-28 bg-[#fafafa] border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              About our library
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              About Our Library
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85]">
              <p className="mb-6">
                The college library is the heart of our academic community. Established in 1985, our library
                has grown to house over <strong className="text-slate-800 font-semibold">50,000 books</strong>,
                covering all major disciplines including Science, Arts, Commerce, Engineering, and Humanities.
              </p>
              <p>
                Our library provides a peaceful and conducive environment for learning, research, and
                intellectual growth. With modern facilities and dedicated staff, we are committed to
                supporting the academic success of every student.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features — Chairman-style spacing */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              What we offer
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Library Features
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-amber-700" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collection Stats */}
      <section
        className="py-20 md:py-28 border-t border-slate-200"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)" }}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-white/70 uppercase mb-4 font-poppins">
              At a glance
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight mb-8 font-poppins leading-tight">
              Our Collection
            </h2>
            <div className="h-px w-16 bg-white/40 mb-10" aria-hidden />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {[
                { value: "50,000+", label: "Books" },
                { value: "200+", label: "Journals" },
                { value: "500+", label: "Magazines" },
                { value: "1,000+", label: "E-Books" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timings & Rules — Chairman-style spacing */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
                Opening hours
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-8 font-poppins">
                Library Timings
              </h3>
              <div className="h-px w-16 bg-slate-300 mb-6" aria-hidden />
              <div className="space-y-0">
                {[
                  { day: "Monday - Friday", time: "8:00 AM - 8:00 PM" },
                  { day: "Saturday", time: "9:00 AM - 5:00 PM" },
                  { day: "Sunday", time: "10:00 AM - 4:00 PM" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-800 font-poppins">{item.day}</span>
                    <span className="text-amber-600 font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
                Guidelines
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-8 font-poppins">
                Library Rules
              </h3>
              <div className="h-px w-16 bg-slate-300 mb-6" aria-hidden />
              <ul className="space-y-3 text-slate-600 font-poppins text-[1.0625rem] leading-relaxed">
                <li className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> Maintain silence in the reading area</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> Valid ID card required for entry</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> Books can be borrowed for 14 days</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> No food or drinks inside the library</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> Handle books with care</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Library;
