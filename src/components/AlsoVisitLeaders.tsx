import { Link } from 'react-router-dom';
import { User, GraduationCap, Lightbulb, BookOpen, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LeaderSlug = 'principal' | 'chairman' | 'hr' | 'dean-academics' | 'dean-innovation';

const LEADERS: { slug: LeaderSlug; label: string; href: string; icon: typeof User }[] = [
  { slug: 'chairman', label: 'Chairman', href: '/chairman', icon: User },
  { slug: 'hr', label: 'HR', href: '/hr', icon: Briefcase },
  { slug: 'principal', label: 'Principal', href: '/principal', icon: GraduationCap },
  { slug: 'dean-academics', label: 'Dean Academics', href: '/dean-academics', icon: BookOpen },
  { slug: 'dean-innovation', label: 'Dean Innovation & Student Projects', href: '/dean-innovation', icon: Lightbulb },
];

interface AlsoVisitLeadersProps {
  /** Current page - these links will be excluded */
  currentSlug: LeaderSlug;
  className?: string;
}

const AlsoVisitLeaders = ({ currentSlug, className }: AlsoVisitLeadersProps) => {
  const others = LEADERS.filter((l) => l.slug !== currentSlug);

  return (
    <section className={cn('py-12 md:py-16 bg-slate-100 border-t border-slate-200', className)}>
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 font-poppins text-center">
          Also visit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {others.map((leader) => (
            <Link
              key={leader.slug}
              to={leader.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                <leader.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-800 font-poppins group-hover:text-slate-900">
                {leader.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlsoVisitLeaders;
