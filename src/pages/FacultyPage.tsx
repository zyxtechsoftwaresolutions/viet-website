import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { facultyAPI, hodsAPI, departmentsAPI } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Department {
  id: number;
  name: string;
  stream: string;
  level: string;
  image?: string;
}

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  email?: string;
  phone?: string;
  experience?: string;
  department?: string;
  image?: string;
  resume?: string;
  _role?: 'principal' | 'hod' | 'faculty';
  _source: 'faculty' | 'hod';
}

const FacultyPage = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [designationFilter, setDesignationFilter] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [f, h, d] = await Promise.all([
          facultyAPI.getAll(),
          hodsAPI.getAll(),
          departmentsAPI.getAll(),
        ]);
        const facultyList = Array.isArray(f) ? f : [];
        const hodsList = Array.isArray(h) ? h : [];
        const deptList = Array.isArray(d) ? d : [];
        setDepartments(deptList);

        const hodKey = (x: { name: string; department?: string }) =>
          `${(x.name || '').trim()}|${(x.department || '').trim()}`;
        const hodKeys = new Set(hodsList.map((x: any) => hodKey(x)));

        const withRole = (item: any, role: 'principal' | 'hod' | 'faculty', source: 'faculty' | 'hod'): FacultyMember => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          qualification: item.qualification || '',
          email: item.email,
          phone: item.phone,
          experience: item.experience,
          department: item.department,
          image: item.image,
          resume: item.resume,
          _role: role,
          _source: source,
        });

        const principalDesignation = (des: string) =>
          (des || '').toLowerCase().includes('principal');

        const combined: FacultyMember[] = [];

        hodsList.forEach((hod: any) => {
          combined.push(withRole(hod, principalDesignation(hod.designation) ? 'principal' : 'hod', 'hod'));
        });

        facultyList.forEach((f: any) => {
          if (hodKeys.has(hodKey(f))) return;
          const role = principalDesignation(f.designation) ? 'principal' : 'faculty';
          combined.push(withRole(f, role, 'faculty'));
        });

        const order = { principal: 0, hod: 1, faculty: 2 };
        combined.sort((a, b) => (order[a._role!] ?? 2) - (order[b._role!] ?? 2));
        setFaculty(combined);
      } catch (e) {
        console.error(e);
        setFaculty([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const deptNameToStream = useMemo(() => {
    const m: Record<string, string> = {};
    departments.forEach((d) => {
      m[d.name] = d.stream;
    });
    return m;
  }, [departments]);

  const streams = useMemo(() => {
    const s = new Set(departments.map((d) => d.stream).filter(Boolean));
    return Array.from(s).sort();
  }, [departments]);

  // Dedupe designations case-insensitively (e.g. "ASSISTANT PROFESSOR" + "Assistant Professor" → one option)
  const designations = useMemo(() => {
    const byLower = new Map<string, string>();
    const toTitleCase = (s: string) =>
      s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    faculty.forEach((f) => {
      const d = (f.designation || '').trim();
      if (!d) return;
      const key = d.toLowerCase();
      if (!byLower.has(key)) byLower.set(key, toTitleCase(d));
    });
    return Array.from(byLower.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [faculty]);

  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      if (streamFilter !== 'all') {
        const stream = deptNameToStream[f.department || ''] ?? '';
        if (stream !== streamFilter) return false;
      }
      if (departmentFilter !== 'all') {
        if ((f.department || '') !== departmentFilter) return false;
      }
      if (designationFilter !== 'all') {
        const fDes = (f.designation || '').trim().toLowerCase();
        const filterDes = designationFilter.trim().toLowerCase();
        if (fDes !== filterDes) return false;
      }
      return true;
    });
  }, [faculty, streamFilter, departmentFilter, designationFilter, deptNameToStream]);

  const imgUrl = (path: string | undefined) => {
    if (!path) return '';
    const base = API_BASE_URL.replace('/api', '');
    return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />
      <ScrollProgressIndicator />

      {/* Hero — site standard (Library/Chairman style) */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-center text-white"
        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)' }}
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
              Faculty
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Faculty
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins">
              Our faculty across all departments and streams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters - Amrita style */}
      <section className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 py-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="text-sm font-medium text-slate-600">Filters:</span>
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger className="w-[180px] md:w-[200px]">
                <SelectValue placeholder="Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                {streams.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px] md:w-[240px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={designationFilter} onValueChange={setDesignationFilter}>
              <SelectTrigger className="w-[200px] md:w-[240px]">
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Faculty grid — Amrita-style cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          {loading ? (
            <p className="text-slate-500">Loading faculty…</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500">No faculty match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {filtered.map((f, index) => (
                <motion.article
                  key={`${f._source}-${f.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index % 12 * 0.03 }}
                  className="bg-white text-left border border-slate-200/80 rounded overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {/* Amrita-style: square photo, centered face */}
                  <div className="aspect-square w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {f.image ? (
                      <img
                        src={imgUrl(f.image)}
                        alt={f.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="p-3 md:p-4 border-t border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm md:text-base leading-tight">
                      {f.name}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 mt-0.5 leading-snug">
                      {f.designation}
                    </p>
                    {f.qualification && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2" title={f.qualification}>
                        {f.qualification}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FacultyPage;
