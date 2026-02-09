import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';

export default function CampusLife() {
  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero Section — Chairman-style spacing */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #422006 0%, #713f12 35%, #a16207 70%, #ca8a04 100%)',
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 from-40% via-black/40 to-transparent"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              VIET Campus
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Campus Life
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
              Where innovation meets inspiration at Visakha Institute of Engineering and Technology
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-amber-300"></div>
        </div>
      </section>

      {/* Introduction — Chairman-style section */}
      <section className="py-20 md:py-28 bg-[#fafafa] border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              About campus life
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              A Living, Breathing <span className="text-amber-600">Ecosystem</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85] [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:text-slate-800 [&_strong]:font-semibold">
              <p>
                At Visakha Institute of Engineering and Technology, campus life transcends the traditional
                boundaries of education. We've created an environment where cutting-edge technology meets
                creative expression, where rigorous academics blend with vibrant cultural experiences.
              </p>
              <p>
                Our campus is a melting pot of ideas, innovations, and inspirations. From state-of-the-art
                laboratories to dynamic student-led initiatives, every corner of VIET pulses with energy
                and possibility. This is where future engineers are forged, leaders are born, and dreams
                take flight.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Showcase — Magazine Grid */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              Explore our campus
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 font-poppins leading-tight">
              Campus Highlights
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="grid grid-cols-12 gap-4 auto-rows-[280px] md:auto-rows-[300px]">
              {/* Large feature image */}
              <div className="col-span-12 md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop"
                  alt="Modern classroom at VIET"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-10">
                  <div className="w-12 h-1 bg-amber-400 mb-4"></div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 font-poppins">Academic Excellence</h3>
                  <p className="text-zinc-100 text-base md:text-lg max-w-2xl font-poppins leading-relaxed">
                    State-of-the-art smart classrooms equipped with interactive technology, fostering
                    collaborative learning and innovative thinking.
                  </p>
                </div>
              </div>

              {/* Small images */}
              <div className="col-span-12 md:col-span-4 relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop"
                  alt="VIET campus building"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-zinc-900/60 flex items-end p-6">
                  <div>
                    <div className="w-8 h-1 bg-amber-400 mb-3"></div>
                    <h4 className="text-xl md:text-2xl font-bold text-white font-poppins">Campus Architecture</h4>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop"
                  alt="Innovation lab at VIET"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-zinc-900/60 flex items-end p-6">
                  <div>
                    <div className="w-8 h-1 bg-amber-400 mb-3"></div>
                    <h4 className="text-xl md:text-2xl font-bold text-white font-poppins">Innovation Labs</h4>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop"
                  alt="Cultural activities at VIET"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-zinc-900/60 flex items-end p-6">
                  <div>
                    <div className="w-8 h-1 bg-amber-400 mb-3"></div>
                    <h4 className="text-xl md:text-2xl font-bold text-white font-poppins">Cultural Celebrations</h4>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=400&fit=crop"
                  alt="Sports facilities at VIET"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-zinc-900/60 flex items-end p-6">
                  <div>
                    <div className="w-8 h-1 bg-amber-400 mb-3"></div>
                    <h4 className="text-xl md:text-2xl font-bold text-white font-poppins">Sports & Fitness</h4>
                  </div>
                </div>
              </div>

              <div className="col-span-12 relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=400&fit=crop"
                  alt="VIET library"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent flex items-center p-8 md:p-10">
                  <div className="max-w-xl">
                    <div className="w-12 h-1 bg-amber-400 mb-4"></div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 font-poppins">Knowledge Repository</h4>
                    <p className="text-zinc-100 font-poppins text-[1.0625rem] md:text-lg leading-[1.85]">
                      Extensive digital and physical collections supporting research and learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              At a glance
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 font-poppins leading-tight">
              Campus <span className="text-amber-600">Statistics</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { number: '25+', label: 'Active Clubs' },
                { number: '1000+', label: 'Students' },
                { number: '50+', label: 'Events/Year' },
                { number: '100%', label: 'Placement Support' },
                { number: '200+', label: 'Industry Partners' },
                { number: '15+', label: 'Years of Excellence' },
              ].map((stat, i) => (
                <div key={i} className="flex-shrink-0 w-56 md:w-64 snap-start">
                  <div className="relative group bg-white p-6 shadow-lg border border-slate-200 group-hover:border-amber-400 transition-colors rounded-xl">
                    <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2 font-poppins">{stat.number}</div>
                    <div className="text-slate-600 font-semibold tracking-wide uppercase text-xs font-poppins">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              What defines VIET
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 font-poppins leading-tight">
              What Defines <span className="text-amber-600">VIET Life</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: 'Student Innovation Hub', description: 'Dedicated spaces for project development, hackathons, and collaborative innovation. Access to cutting-edge tools, mentorship from industry experts, and funding opportunities for breakthrough ideas.', color: 'blue' },
                { title: 'Technical Societies', description: 'Over 25 student-run clubs spanning robotics, AI/ML, web development, cyber security, and emerging technologies. Regular workshops, competitions, and peer-learning sessions drive skill development.', color: 'purple' },
                { title: 'Cultural Extravaganza', description: 'Annual cultural festivals, inter-college competitions, talent showcases, and creative expression platforms. From classical arts to contemporary performances, every talent finds its stage.', color: 'orange' },
                { title: 'Sports Excellence', description: 'Professional-grade facilities for cricket, basketball, volleyball, athletics, and indoor games. Regular tournaments, coaching programs, and fitness training for holistic development.', color: 'green' },
                { title: 'Industry Connect', description: 'Regular guest lectures, industrial visits, internship programs, and placement training. Strong industry partnerships ensure students stay ahead of market demands and career opportunities.', color: 'indigo' },
                { title: 'Research Opportunities', description: 'State-of-the-art laboratories, access to research publications, faculty mentorship for projects, and opportunities to present at national and international conferences.', color: 'amber' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group p-6 md:p-8 rounded-xl border-2 border-slate-200 group-hover:border-amber-400 bg-white group-hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-1 bg-amber-500 mb-6`}></div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 font-poppins group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 font-poppins text-[1.0625rem] leading-[1.85]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 md:py-28 bg-amber-50/70 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-0 left-0 text-[150px] md:text-[200px] font-black text-amber-400/20 leading-none">"</div>
            <div className="relative pl-12 md:pl-24 pt-12 md:pt-20">
              <p className="text-xl md:text-3xl lg:text-4xl font-light text-slate-800 leading-relaxed mb-8 italic font-poppins">
                VIET isn't just an institution – it's a launchpad for dreams. The blend of rigorous
                academics, hands-on projects, and vibrant campus culture shaped me into who I am today.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-amber-500"></div>
                <div>
                  <div className="text-slate-900 font-bold text-lg font-poppins">VIET Alumni</div>
                  <div className="text-slate-600 text-sm font-poppins">Class of 2023</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              Infrastructure
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 font-poppins leading-tight">
              World-Class <span className="text-amber-600">Facilities</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { icon: '🔬', title: 'Advanced Labs', desc: 'Industry-standard equipment and technology' },
                { icon: '💻', title: 'Computer Centers', desc: 'Latest software with high-speed internet' },
                { icon: '📚', title: 'Digital Library', desc: 'Vast collection of books and e-resources' },
                { icon: '🏢', title: 'Smart Classrooms', desc: 'Interactive digital learning spaces' },
                { icon: '🏃', title: 'Sports Complex', desc: 'Multi-sport facilities and fitness center' },
                { icon: '🍽️', title: 'Modern Cafeteria', desc: 'Hygienic food with diverse cuisines' },
                { icon: '🏠', title: 'Comfortable Hostels', desc: 'Safe and secure residential facilities' },
                { icon: '🎭', title: 'Auditorium', desc: 'Premium venue for events and seminars' },
                { icon: '🏥', title: 'Health Center', desc: 'On-campus medical and wellness support' },
                { icon: '🚌', title: 'Transport', desc: 'Convenient bus services across routes' },
                { icon: '🏦', title: 'Banking', desc: 'ATM and banking facilities on campus' },
                { icon: '📡', title: 'Wi-Fi Campus', desc: 'High-speed connectivity throughout' },
              ].map((facility, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 md:w-72 snap-start group relative bg-white border-2 border-slate-200 hover:border-amber-400 p-6 transition-all hover:shadow-xl rounded-xl"
                >
                  <div className="text-4xl md:text-5xl mb-4">{facility.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 font-poppins">{facility.title}</h3>
                  <p className="text-slate-600 text-sm font-poppins leading-relaxed">{facility.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Annual Events */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              Celebrations
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4 font-poppins leading-tight">
              Major Events
            </h2>
            <p className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg">Celebrations that bring our campus alive</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'TechnoVista', subtitle: 'Technical Symposium', description: 'Annual tech fest featuring hackathons, paper presentations, project exhibitions, and guest lectures from industry leaders.', gradient: 'from-blue-500 to-cyan-500' },
              { title: 'Spectrum', subtitle: 'Cultural Festival', description: 'A vibrant celebration of arts, music, dance, drama, and creative expression. Inter-college competitions and performances.', gradient: 'from-purple-500 to-pink-500' },
              { title: 'Athlexa', subtitle: 'Sports Championship', description: 'Multi-sport tournament showcasing athletic talent. Team building, competitive spirit, and celebration of fitness.', gradient: 'from-orange-500 to-red-500' },
            ].map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative bg-gradient-to-br ${event.gradient} p-8 md:p-10 rounded-xl border-2 border-slate-200 shadow-xl`}
              >
                <div className="text-white font-bold text-sm tracking-widest mb-2 opacity-90 font-poppins">{event.subtitle}</div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-poppins">{event.title}</h3>
                <p className="text-white/90 font-poppins text-[1.0625rem] leading-[1.85]">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-500 p-12 md:p-16 text-center overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-poppins leading-tight">
                Ready to Experience<br />
                <span className="text-white">VIET Campus Life?</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-800 mb-10 max-w-2xl mx-auto font-poppins text-[1.0625rem] md:text-lg leading-[1.85]">
                Join us in shaping the future. Be part of a community where innovation thrives,
                talents flourish, and futures are built.
              </p>
              <a
                href="https://viet.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 md:px-10 py-4 md:py-5 hover:bg-slate-100 transition-all rounded-full shadow-xl hover:shadow-2xl font-poppins"
              >
                <span className="text-base md:text-lg">EXPLORE VIET</span>
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
