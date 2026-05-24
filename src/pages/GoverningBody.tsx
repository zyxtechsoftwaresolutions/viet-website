import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  GraduationCap,
  Building2,
  Star,
  LayoutList,
  LayoutGrid,
  X,
  Compass,
  Landmark,
} from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MemberCategory = "management" | "academia" | "nominee" | "invitee";

type Member = {
  sno: number;
  name: string;
  designation: string;
  role: string;
  category: MemberCategory;
};

const members: Member[] = [
  { sno: 1, name: "Sri. G. Satyanarayana", designation: "Chairman, VLNSET", role: "Chairperson", category: "management" },
  { sno: 2, name: "Sri P. Subbaraju", designation: "Vice-Chairman, VLNSET", role: "Member", category: "management" },
  { sno: 3, name: "Sri. B. Bhaskar Rao", designation: "Director, VLNSET", role: "Member", category: "management" },
  { sno: 4, name: "Dr. G.V. Pradeep Varma", designation: "Principal, VIET", role: "Member", category: "academia" },
  {
    sno: 5,
    name: "Dr. G. J. Nagaraju",
    designation: "Asst. Prof of Physics & HOD, CEV-JNTUGV",
    role: "Member (University Nominee)",
    category: "nominee",
  },
  { sno: 6, name: "Dr. K V Ramana", designation: "Principal, GICE-SBTET", role: "Member (SBTET Nominee)", category: "nominee" },
  {
    sno: 7,
    name: "Dr. K Satyanarayana",
    designation: "Guest Lecturer in Law, Practicing Advocate, Addl. SP (RTD)",
    role: "Special Invitee",
    category: "invitee",
  },
  {
    sno: 8,
    name: "Dr. K Venkata Krishna Rao",
    designation: "Asst Prof, Dept of CSE, NIT Warangal",
    role: "Special Invitee",
    category: "invitee",
  },
  { sno: 9, name: "Dr. D. Santha Rao", designation: "Dean Academics, VIET", role: "Member", category: "academia" },
  { sno: 10, name: "Varma Dendukuri", designation: "Dean CDC, VIET", role: "Member", category: "academia" },
  { sno: 11, name: "Dr T. Satyanarayana", designation: "Dean R&D, VIET", role: "Member", category: "academia" },
  { sno: 12, name: "Dr A S C Tejaswini Kone", designation: "HoD CSE, VIET", role: "Member", category: "academia" },
  { sno: 13, name: "Sri. B. Jeevan Rao (Ph.D)", designation: "HoD ECE, Vice-Principal, VIET", role: "Member", category: "academia" },
  { sno: 14, name: "Sri. P. Prasada Rao (Ph.D)", designation: "Principal, Polytechnic-VIET", role: "Member", category: "academia" },
  { sno: 15, name: "Sri. CH.B.R.Srikanth (Ph.D)", designation: "IQAC Co-Ordinator", role: "Member", category: "academia" },
];

const categoryMeta: Record<
  MemberCategory,
  { label: string; badge: string; filter: string; filterActive: string; dot: string; statBorder: string }
> = {
  management: {
    label: "Management",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    filter: "border-slate-200 text-slate-600 hover:border-blue-300",
    filterActive: "border-blue-500 bg-blue-50 text-blue-800",
    dot: "bg-blue-500",
    statBorder: "border-blue-200 bg-blue-50",
  },
  academia: {
    label: "Academia",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    filter: "border-slate-200 text-slate-600 hover:border-emerald-300",
    filterActive: "border-emerald-500 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
    statBorder: "border-emerald-200 bg-emerald-50",
  },
  nominee: {
    label: "Nominee",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    filter: "border-slate-200 text-slate-600 hover:border-violet-300",
    filterActive: "border-violet-500 bg-violet-50 text-violet-800",
    dot: "bg-violet-500",
    statBorder: "border-violet-200 bg-violet-50",
  },
  invitee: {
    label: "Special Invitee",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    filter: "border-slate-200 text-slate-600 hover:border-amber-300",
    filterActive: "border-amber-500 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
    statBorder: "border-amber-200 bg-amber-50",
  },
};

const stats: { value: string; label: string; category: MemberCategory; icon: typeof Crown }[] = [
  { value: "1", label: "Chairperson", category: "management", icon: Crown },
  { value: "9", label: "Members", category: "academia", icon: GraduationCap },
  { value: "2", label: "Nominees", category: "nominee", icon: Landmark },
  { value: "2", label: "Special Invitees", category: "invitee", icon: Star },
];

const responsibilities = [
  {
    title: "Strategic Governance",
    icon: Compass,
    border: "border-blue-200 bg-blue-50/60",
    titleColor: "text-blue-900",
    bullet: "bg-blue-700",
    items: [
      "Policy formulation and strategic planning",
      "Academic and administrative oversight",
      "Financial management and resource allocation",
      "Quality assurance and accreditation",
    ],
  },
  {
    title: "Institutional Development",
    icon: Building2,
    border: "border-emerald-200 bg-emerald-50/60",
    titleColor: "text-emerald-900",
    bullet: "bg-emerald-700",
    items: [
      "Infrastructure development and expansion",
      "Faculty recruitment and development",
      "Industry partnerships and collaborations",
      "Research and innovation initiatives",
    ],
  },
];

function roleBadgeClass(role: string, category: MemberCategory) {
  if (role.toLowerCase().includes("chair")) return categoryMeta.management.badge;
  return categoryMeta[category].badge;
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
      <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">{label}</p>
      <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">{description}</p>
      )}
      <div className="h-px w-16 bg-slate-300 mt-6" aria-hidden />
    </div>
  );
}

const GoverningBody = () => {
  const [filter, setFilter] = useState<"all" | MemberCategory>("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const filtered = filter === "all" ? members : members.filter((m) => m.category === filter);

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

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
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Institutional Governance
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Governing Body
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              Distinguished members from academia, industry, and administration who guide the strategic direction and
              governance of VIET.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <Icon className="w-5 h-5 text-white/90 shrink-0" aria-hidden />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white leading-none">{value}</p>
                    <p className="text-xs text-white/60 mt-1 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHeading
            label="Composition"
            title="Governing body structure"
            description="Representing management, academia, university nominees, and special invitees."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map(({ value, label, category, icon: Icon }) => (
              <div
                key={label}
                className={cn("rounded-lg border p-5", categoryMeta[category].statBorder)}
              >
                <Icon className="w-5 h-5 text-slate-700 mb-2" aria-hidden />
                <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-sm font-medium text-slate-600 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <SectionHeading label="Members" title="Governing body members" />

          <Card className="border-slate-200 shadow-sm overflow-hidden mb-12">
            <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {(Object.keys(categoryMeta) as MemberCategory[]).map((key) => {
                  const meta = categoryMeta[key];
                  const active = filter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(active ? "all" : key)}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors",
                        active ? meta.filterActive : meta.filter
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full shrink-0", meta.dot)} aria-hidden />
                      {meta.label}
                    </button>
                  );
                })}
                {filter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden />
                    Clear
                  </button>
                )}
              </div>

              <div className="flex rounded-md border border-slate-200 overflow-hidden" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setView("table")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                    view === "table" ? "bg-slate-100 text-slate-900" : "bg-white text-slate-500 hover:text-slate-700"
                  )}
                >
                  <LayoutList className="w-4 h-4" aria-hidden />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-l border-slate-200 transition-colors",
                    view === "grid" ? "bg-slate-100 text-slate-900" : "bg-white text-slate-500 hover:text-slate-700"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" aria-hidden />
                  Grid
                </button>
              </div>
            </div>

            <div className="px-4 md:px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {members.length}{" "}
              members
            </div>

            {view === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-14">
                        S.No
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Member</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filtered.map((member) => (
                      <tr key={member.sno} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-slate-500 tabular-nums">
                          {String(member.sno).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-900">{member.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 max-w-md">{member.designation}</td>
                        <td className="px-5 py-4">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs font-medium border", roleBadgeClass(member.role, member.category))}
                          >
                            {member.role}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <CardContent className="p-4 md:p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((member) => (
                      <div
                        key={member.sno}
                        className={cn(
                          "rounded-lg border border-slate-200 bg-white p-4 border-t-[3px]",
                          member.category === "management" && "border-t-blue-500",
                          member.category === "academia" && "border-t-emerald-500",
                          member.category === "nominee" && "border-t-violet-500",
                          member.category === "invitee" && "border-t-amber-500"
                        )}
                      >
                        <p className="font-semibold text-slate-900 text-sm leading-snug">{member.name}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{member.designation}</p>
                        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs font-medium border", roleBadgeClass(member.role, member.category))}
                          >
                            {member.role}
                          </Badge>
                          <span className="text-xs text-slate-400 font-medium tabular-nums">
                            #{String(member.sno).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <SectionHeading
            label="Governance"
            title="Key responsibilities"
            description="Strategic direction and institutional development overseen by the governing body."
          />

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {responsibilities.map(({ title, icon: Icon, border, titleColor, bullet, items }) => (
              <div key={title} className={cn("rounded-lg border p-6 md:p-7", border)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center border border-slate-200/80">
                    <Icon className="w-5 h-5 text-slate-700" aria-hidden />
                  </div>
                  <h3 className={cn("text-lg font-semibold", titleColor)}>{title}</h3>
                </div>
                <ul className="space-y-2.5 list-none p-0 m-0">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <span className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", bullet)} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Legend</span>
            {(Object.entries(categoryMeta) as [MemberCategory, (typeof categoryMeta)[MemberCategory]][]).map(
              ([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", val.dot)} aria-hidden />
                  {val.label}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default GoverningBody;
