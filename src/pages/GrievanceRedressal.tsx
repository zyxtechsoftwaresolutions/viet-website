import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Scale,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Target,
  Eye,
  Lock,
  ClipboardList,
  MessageCircle,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Member = {
  sno: number;
  name: string;
  dept: string;
  designation: string;
};

const antiRaggingMembers: Member[] = [
  { sno: 1, name: "Dr. G Vidya Pradeep Varma", dept: "Principal", designation: "Chair Person" },
  { sno: 2, name: "Dr K. Dayana", dept: "MECH", designation: "Member" },
  { sno: 3, name: "Ch. Veeru Naidu", dept: "NSS", designation: "Member" },
  { sno: 4, name: "Mr. P. Prasad", dept: "Principal Diploma College", designation: "Member" },
  { sno: 5, name: "K. Rama Krishna", dept: "Librarian", designation: "Member" },
  { sno: 6, name: "P. Sai Prasana", dept: "Librarian", designation: "Member" },
  { sno: 7, name: "S. Kusaraju", dept: "Physical Director", designation: "Member" },
  { sno: 8, name: "K. Chandana", dept: "MECH", designation: "Member" },
  { sno: 9, name: "P. Ramesh", dept: "Boys Hostel", designation: "Boys Hostel Warden" },
  { sno: 10, name: "Prasanna Lakshmi", dept: "Girls Hostel", designation: "Girls Hostel Warden" },
];

const womenCellMembers: Member[] = [
  { sno: 1, name: "Dr. G Vidya Pradeep Varma", dept: "Principal", designation: "Chair Person" },
  { sno: 2, name: "Mr. Ch Kannam Naidu", dept: "CIVIL, HOD", designation: "Advisor" },
  { sno: 3, name: "Dr K. Dayana", dept: "MECH", designation: "Convenor" },
  { sno: 4, name: "Y. Priyanka", dept: "CIVIL", designation: "Co-Convenor" },
  { sno: 5, name: "A S C Tejaaswini Kona", dept: "CSE", designation: "Treasurer" },
  { sno: 6, name: "Dr. SK Razia", dept: "BS&H", designation: "Member" },
  { sno: 7, name: "K. Chandana", dept: "MECH", designation: "Member" },
  { sno: 8, name: "K. Divya", dept: "MBA", designation: "Member" },
];

function designationBadgeClass(designation: string) {
  const d = designation.toLowerCase();
  if (d.includes("chair")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (d.includes("advisor")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (d.includes("convenor") || d.includes("treasurer")) return "bg-violet-100 text-violet-800 border-violet-200";
  if (d.includes("warden")) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function MemberTable({ members }: { members: Member[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-14">S.No</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Department</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Designation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {members.map((member) => (
            <tr
              key={member.sno}
              className="hover:bg-slate-50/80 transition-colors"
            >
              <td className="px-5 py-4 text-sm font-medium text-slate-500 tabular-nums">{member.sno}</td>
              <td className="px-5 py-4 text-sm font-medium text-slate-900">{member.name}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{member.dept}</td>
              <td className="px-5 py-4">
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium border", designationBadgeClass(member.designation))}
                >
                  {member.designation}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">
        {label}
      </p>
      <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
          {description}
        </p>
      )}
      <div className="h-px w-16 bg-slate-300 mt-6" aria-hidden />
    </div>
  );
}

const GrievanceRedressal = () => {
  const [activeTab, setActiveTab] = useState<"anti-ragging" | "women-cell">("anti-ragging");

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero — Chairman spacing */}
      <section
        className="relative min-h-[70vh] md:min-h-[75vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-slate-800 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/campus-hero.jpg)" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 from-35% via-black/55 to-black/30"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Student Welfare
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Grievance Redressal
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
              Mechanisms for anti-ragging compliance, women&apos;s grievance redressal, and prompt resolution of
              student and staff concerns at VIET.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="flex gap-1 overflow-x-auto" role="tablist">
            {(
              [
                { id: "anti-ragging" as const, label: "Anti-Ragging Committee", icon: Shield },
                { id: "women-cell" as const, label: "Women Grievance Cell", icon: Scale },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anti-Ragging */}
      {activeTab === "anti-ragging" && (
        <>
          <section className="py-20 md:py-28 bg-[#fafafa]">
            <div className="container mx-auto px-4 md:px-10 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SectionHeading
                  label="Campus safety"
                  title="Anti-Ragging Committee"
                  description="The committee is responsible for maintaining a ragging-free campus and ensuring strict compliance with UGC and statutory anti-ragging norms."
                />

                <div className="prose prose-slate max-w-none text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] text-left space-y-5 mb-10">
                  <p>
                    Ragging is defined as any act that violates or is perceived to violate an individual student&apos;s
                    dignity. It is <strong className="text-slate-800 font-semibold">totally banned</strong> on campus.
                    Anyone found guilty of ragging or abetting ragging is liable to punishment under applicable law. VIET
                    enforces zero tolerance through awareness, monitoring, and disciplinary action.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 md:p-5 mb-10 rounded-lg border border-red-200 bg-red-50/80">
                  <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden />
                  <p className="text-sm md:text-base text-red-900 leading-relaxed m-0">
                    Any act of ragging is a <strong>criminal offence</strong> under Indian law. Offenders may face
                    expulsion, FIR registration, and criminal prosecution.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <div className="border border-slate-200 rounded-lg p-6 md:p-7 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-700" aria-hidden />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Vision</h3>
                    </div>
                    <p className="text-slate-600 text-base leading-relaxed m-0">
                      To build a ragging-free environment by instilling democratic values, tolerance, empathy, and
                      sensitivity so that students become responsible citizens.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-6 md:p-7 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Target className="w-5 h-5 text-slate-700" aria-hidden />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Mission</h3>
                    </div>
                    <p className="text-slate-600 text-base leading-relaxed m-0">
                      To create an atmosphere of discipline by passing a clear message that no act of ragging is
                      tolerated within college premises.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-4">Committee members</h3>
                <MemberTable members={antiRaggingMembers} />
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* Women Grievance Cell */}
      {activeTab === "women-cell" && (
        <section className="py-20 md:py-28 bg-[#fafafa]">
          <div className="container mx-auto px-4 md:px-10 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading
                label="POSH compliance"
                title="Women Grievance Cell"
                description="In compliance with Supreme Court directions, the cell also functions as the Internal Complaints Committee under the POSH Act."
              />

              <div className="prose prose-slate max-w-none text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] text-left space-y-5 mb-10">
                <p>
                  Education should instil moral and ethical values alongside academic learning. The Women Grievance Cell
                  provides a safe platform for addressing gender-specific concerns and ensuring dignity for all members of
                  the campus community.
                </p>
              </div>

              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 list-none p-0 m-0">
                {[
                  { icon: Lock, title: "Confidential support", text: "A safe environment for reporting concerns." },
                  { icon: ClipboardList, title: "Fair redressal", text: "Timely and impartial handling of complaints." },
                  { icon: MessageCircle, title: "Counselling", text: "Information on campus counselling services." },
                  { icon: Megaphone, title: "Awareness", text: "Programs that promote a respectful campus culture." },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="border border-slate-200 rounded-lg p-5 bg-white">
                    <Icon className="w-5 h-5 text-slate-700 mb-3" aria-hidden />
                    <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed m-0">{text}</p>
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-3 p-4 md:p-5 mb-10 rounded-lg border border-emerald-200 bg-emerald-50/80">
                <p className="text-sm md:text-base text-emerald-900 leading-relaxed m-0">
                  No instances of sexual harassment have been reported at VIET campus. The institution remains committed
                  to maintaining this record through proactive awareness and support systems.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-4">Committee members</h3>
              <MemberTable members={womenCellMembers} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHeading
            label="Reach us"
            title="Contact for grievances"
            description="For anti-ragging complaints, women&apos;s cell matters, or general grievances, use the contacts below."
          />

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Anti-Ragging</h3>
                </div>
                <ul className="space-y-4 list-none p-0 m-0">
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 mt-1 shrink-0" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Phone / WhatsApp</p>
                      <p className="text-sm text-slate-800 m-0">+91-9494670501 · 9959617477, 9959617476</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Email</p>
                      <a href="mailto:vietvsp@gmail.com" className="text-sm text-blue-700 hover:underline">
                        vietvsp@gmail.com
                      </a>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-700" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">General grievances</h3>
                </div>
                <ul className="space-y-4 list-none p-0 m-0">
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Email</p>
                      <a href="mailto:website@viet.edu.in" className="text-sm text-blue-700 hover:underline">
                        website@viet.edu.in
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 mt-1 shrink-0" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Phone</p>
                      <p className="text-sm text-slate-800 m-0">9959617476, 9959617477</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Address</p>
                      <p className="text-sm text-slate-800 m-0">
                        88th Division, Narava, GVMC, Visakhapatnam
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-slate-800 text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">UGC anti-ragging helpline</p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight">1800-180-5522</p>
              <p className="text-sm text-slate-400 mt-1">Toll-free · 24×7</p>
            </div>
            <a
              href="https://www.ugc.ac.in/antiRagging/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/30 bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors shrink-0"
            >
              UGC portal
              <ExternalLink className="w-4 h-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GrievanceRedressal;
