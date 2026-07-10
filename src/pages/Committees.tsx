import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, LayoutList } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Committee = {
  sno: number;
  name: string;
  coordinator: string;
};

/** Official VIET committees — https://www.viet.edu.in/committees.php */
const committees: Committee[] = [
  { sno: 1, name: "Academic Planning and Advisory Committee", coordinator: "Dr.G.V. Pradeep Varma" },
  { sno: 2, name: "Admission Committee", coordinator: "Mr.Ch.Veerunaidu" },
  { sno: 3, name: "Alumni Association Cell", coordinator: "Mr.K.Bhargav" },
  { sno: 4, name: "Anti-Ragging Cell", coordinator: "Mr.K.Bhargav" },
  { sno: 5, name: "Career Development Cell", coordinator: "Mr.D. Devi Prasanna Varma" },
  { sno: 6, name: "College Development Committee", coordinator: "Mr.P.Subba Raju" },
  { sno: 7, name: "Discipline Committee", coordinator: "Mr.K.Bhargav" },
  { sno: 8, name: "Entrepreneur Innovation Start-up Centre", coordinator: "Mrs.K.Chandana" },
  { sno: 9, name: "Examination Grievance Redressal Committee", coordinator: "Dr.C.Govindarajulu" },
  { sno: 10, name: "Extra-Curricular Activities Cell", coordinator: "Dr.K.Dayana" },
  { sno: 11, name: "Faculty Recruitment Committee (FRC)", coordinator: "Dr.G.V. Pradeep Varma" },
  { sno: 12, name: "Finance Committee", coordinator: "Mr.K.Ganeswara Rao" },
  { sno: 13, name: "Food & Water Quality Monitoring Committee", coordinator: "Mr.K.Bhargav" },
  { sno: 14, name: "Grievances Redressal Cell (GRC)", coordinator: "Mr.K.Bhargav" },
  { sno: 15, name: "Hostel & Mess Committee (Boys)", coordinator: "Mr.K.Bhargav" },
  { sno: 16, name: "Hostel & Mess Committee (Girls)", coordinator: "Dr.K.Dayana" },
  { sno: 17, name: "Industry Institute Interaction Cell (IIIC)", coordinator: "Mr.D. Devi Prasanna Varma" },
  { sno: 18, name: "Institute Newsletter Committee", coordinator: "Dr.B.Jeevana Rao" },
  { sno: 19, name: "Internal Audit Committee", coordinator: "Mr.CH.B.R.Srikanth" },
  { sno: 20, name: "Internal Complaint Committee", coordinator: "Mr.K.Bhargav" },
  { sno: 21, name: "Internal Quality Assurance Cell (IQAC)", coordinator: "Mr.CH.B.R.Srikanth" },
  { sno: 22, name: "Library Advisory Committee", coordinator: "Mr.K.Ramakrishna" },
  { sno: 23, name: "Media Cell", coordinator: "Mr.K.Ramakrishna" },
  { sno: 24, name: "Minority Cell", coordinator: "Dr. Kausar Jahan" },
  { sno: 25, name: "N.S.S", coordinator: "Mr.Ch.Veerunaidu" },
  { sno: 26, name: "Purchase Committee (PC)", coordinator: "Dr.G.V. Pradeep Varma" },
  { sno: 27, name: "Research and Development Cell", coordinator: "Dr.T.Satyanarayana" },
  { sno: 28, name: "SC and ST Cell", coordinator: "Dr.K.Dayana" },
  { sno: 29, name: "Scholarship Committee", coordinator: "Mr.P.Subba Raju" },
  { sno: 30, name: "Sports and Games Committee", coordinator: "Mr.B.Rajesh" },
  { sno: 31, name: "Student Activity Cell", coordinator: "Mr.K.Bhargav" },
  { sno: 32, name: "Student Welfare Committee (SWC)", coordinator: "Mr.K.Bhargav" },
  { sno: 33, name: "Teaching and Learning Monitoring Committee", coordinator: "Dr.D.Santha Rao" },
  { sno: 34, name: "Website Maintenance Committee", coordinator: "Mr.K.Bhargav" },
  { sno: 35, name: "Women Grievance Cell (WGC)", coordinator: "Dr.K.Dayana" },
];

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

const CommitteesPage = () => {
  const [view, setView] = useState<"table" | "grid">("table");

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
              Committees
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              Institutional committees at Visakha Institute of Engineering &amp; Technology, with designated
              co-ordinators for academic planning, student welfare, quality assurance, and campus administration.
            </p>
            <div className="inline-flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-2xl md:text-3xl font-bold text-white leading-none tabular-nums">35</p>
              <p className="text-sm text-white/70 font-medium">Institutional committees</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHeading
            label="Composition"
            title="Committee structure"
            description="Each committee is headed by a faculty or staff co-ordinator, as notified by the institution."
          />

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Official list as published on{" "}
                <a
                  href="https://www.viet.edu.in/committees.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700"
                >
                  viet.edu.in
                </a>
              </p>

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
              Showing <span className="font-semibold text-slate-700">{committees.length}</span> committees
            </div>

            {view === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-16">
                        S.No
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                        Name of the Committee
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                        Name of the Co-ordinator
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {committees.map((committee) => (
                      <tr key={committee.sno} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-slate-500 tabular-nums">
                          {committee.sno}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-900">{committee.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-700">{committee.coordinator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <CardContent className="p-4 md:p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {committees.map((committee) => (
                    <div
                      key={committee.sno}
                      className="rounded-lg border border-slate-200 bg-white p-4 border-t-[3px] border-t-slate-800"
                    >
                      <p className="text-xs font-semibold text-slate-400 tabular-nums mb-2">#{committee.sno}</p>
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{committee.name}</p>
                      <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                        <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px] block mb-1">
                          Co-ordinator
                        </span>
                        {committee.coordinator}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommitteesPage;
