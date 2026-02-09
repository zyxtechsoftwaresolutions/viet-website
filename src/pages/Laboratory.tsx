import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

const LABS = [
  {
    id: "dbms",
    name: "DBMS Lab",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
    description: "Database Management Systems laboratory equipped with SQL Server, MySQL, Oracle, and MongoDB installations. Students gain hands-on experience in database design, normalization, query optimization, and transaction management with industry-standard tools.",
    features: ["50+ Workstations", "Multiple DBMS Platforms", "Query Optimization Tools", "Dedicated Lab Assistant"],
  },
  {
    id: "simulation",
    name: "Simulation Lab",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    description: "Advanced simulation laboratory featuring MATLAB, Simulink, NS-2/NS-3, and LabVIEW software for modeling and simulating complex systems. Students work on network simulations, signal processing, control systems, and virtual prototyping projects.",
    features: ["High-Performance PCs", "Licensed Software", "Virtual Instruments", "Expert Lab Assistant"],
  },
  {
    id: "vlsi",
    name: "VLSI Design Lab",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    description: "Cutting-edge VLSI laboratory equipped with Cadence, Xilinx ISE, and Synopsys tools for chip design and verification. Students learn RTL design, FPGA programming, circuit simulation, and physical design using industry-standard EDA tools.",
    features: ["EDA Tool Suite", "FPGA Development Kits", "HDL Simulators", "Technical Lab Assistant"],
  },
  {
    id: "embedded",
    name: "Embedded Systems Lab",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    description: "Comprehensive embedded systems lab with ARM Cortex, Arduino, Raspberry Pi, and 8051 microcontroller kits. Students develop real-time embedded applications, IoT projects, and firmware programming with hands-on hardware interfacing experience.",
    features: ["Development Boards", "IoT Kits", "Debugging Tools", "Skilled Lab Assistant"],
  },
  {
    id: "networking",
    name: "Networking Lab",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    description: "Modern networking laboratory with Cisco routers, switches, and network simulation tools. Students configure LAN/WAN networks, implement routing protocols, network security, and troubleshoot real-world networking scenarios using Packet Tracer and GNS3.",
    features: ["Cisco Equipment", "Network Simulators", "Security Tools", "Certified Lab Assistant"],
  },
  {
    id: "it-workshop",
    name: "IT Workshop Lab",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
    description: "Comprehensive IT workshop with software development environments, cloud platforms, and collaborative tools. Students work on full-stack development, DevOps, cloud computing, and agile methodologies with access to AWS, Azure, and Google Cloud platforms.",
    features: ["Cloud Platforms", "Development Tools", "Version Control", "Expert Lab Assistant"],
  },
];

const Laboratory = () => {
  const [activeLabIndex, setActiveLabIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      {/* Hero — same theme as Library */}
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
              Our Laboratories
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
              Where theory meets practice — advanced engineering labs.
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
              About our labs
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              About Our Laboratories
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85] max-w-3xl">
              <p>
                Our state-of-the-art laboratories form the backbone of practical engineering education. Established with cutting-edge technology and industry-standard equipment, we provide students with hands-on experience across <strong className="text-slate-800 font-semibold">8+ specialized labs</strong> covering all major B.Tech disciplines including Computer Science, Electronics, VLSI Design, Embedded Systems, and Networking. Each lab is supervised by experienced technical staff and lab assistants who guide students through practical sessions, ensuring safety and maximum learning outcomes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Laboratory Facilities — lab cards */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              Explore labs
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Laboratory Facilities
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <p className="text-slate-600 text-sm mb-8 max-w-xl">Hover over each lab to view details, or tap on mobile.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LABS.map((lab, index) => (
                <div
                  key={lab.id}
                  className="group relative h-[380px] md:h-[400px] overflow-hidden border border-slate-200 cursor-pointer rounded-tl-[4rem] rounded-tr-[2rem] rounded-br-[4rem] rounded-bl-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25),0_8px_16px_-8px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),0_12px_24px_-10px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setActiveLabIndex(activeLabIndex === index ? null : index)}
                >
                  <img
                    src={lab.image}
                    alt={lab.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-[2] pointer-events-none">
                    <h3 className="text-xl font-semibold font-poppins">{lab.name}</h3>
                    <div className="h-1 w-12 bg-amber-400 rounded mt-2" />
                  </div>

                  {/* Hover / active dialog — glass effect, same curve as card to avoid corner glitch */}
                  <div
                    className={`absolute inset-0 overflow-hidden rounded-tl-[4rem] rounded-tr-[2rem] rounded-br-[4rem] rounded-bl-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 flex flex-col z-10 transition-opacity duration-300 ${
                      activeLabIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white font-poppins">{lab.name}</h3>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActiveLabIndex(null); }}
                        className="p-1 rounded-md text-white/80 hover:bg-white/10 hover:text-white md:hidden"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed flex-grow overflow-y-auto mb-4">{lab.description}</p>
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-2">Key Features</h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {lab.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/20 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-sm font-medium text-white">Mon–Sat: 9AM – 4PM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lab Resources / Stats — theme gradient like Library collection */}
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
              Our Lab Resources
            </h2>
            <div className="h-px w-16 bg-white/40 mb-10" aria-hidden />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {[
                { value: "8+", label: "Specialized Labs" },
                { value: "200+", label: "Lab Equipment" },
                { value: "15+", label: "Lab Assistants" },
                { value: "300+", label: "Workstations" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Laboratory;
