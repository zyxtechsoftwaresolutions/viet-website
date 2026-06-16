import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type LeaderSlug =
  | 'principal'
  | 'diploma-principal'
  | 'chairman'
  | 'hr'
  | 'dean-academics'
  | 'dean-innovation';

const LEADERS: { slug: LeaderSlug; label: string; href: string }[] = [
  { slug: 'chairman', label: 'Chairman', href: '/chairman' },
  { slug: 'hr', label: 'HR', href: '/hr' },
  { slug: 'principal', label: 'Principal', href: '/principal' },
  { slug: 'diploma-principal', label: 'Diploma Principal', href: '/diploma-principal' },
  { slug: 'dean-academics', label: 'Dean Academics', href: '/dean-academics' },
  { slug: 'dean-innovation', label: 'Dean Innovation', href: '/dean-innovation' },
];

interface AlsoVisitLeadersProps {
  currentSlug: LeaderSlug;
  className?: string;
}

const AlsoVisitLeaders = ({ currentSlug, className }: AlsoVisitLeadersProps) => {
  const others = LEADERS.filter((l) => l.slug !== currentSlug);

  return (
    <section className={cn('py-10 md:py-14 bg-slate-100 border-t border-slate-200', className)}>
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-5 font-poppins text-center">
          Also visit
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3 max-w-4xl mx-auto">
          {others.map((leader) => (
            <Link
              key={leader.slug}
              to={leader.href}
              className="flex items-center justify-center px-3 py-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group text-center"
            >
              <span className="font-medium text-sm text-slate-800 font-poppins group-hover:text-slate-900">
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
