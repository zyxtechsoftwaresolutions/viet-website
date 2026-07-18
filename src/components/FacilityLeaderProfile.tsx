import { motion } from 'framer-motion';
import { Mail, Phone, UserRound } from 'lucide-react';
import { imgUrl } from '@/lib/imageUtils';
import type { FacilityLeaderProfile as LeaderProfile } from '@/lib/facilityContent/leaderProfile';

type Props = {
  profile: LeaderProfile;
};

const FacilityLeaderProfile = ({ profile }: Props) => (
  <section className="py-20 md:py-28 bg-white border-t border-slate-200">
    <div className="container mx-auto px-4 md:px-10 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
          {profile.label}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
          {profile.title}
        </h2>
        <div className="h-px w-16 bg-primary mb-10" aria-hidden />

        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-8 md:gap-12 items-start">
          <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/5]">
            {profile.image ? (
              <img
                src={imgUrl(profile.image)}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <UserRound className="w-24 h-24" aria-hidden />
              </div>
            )}
          </div>

          <div className="text-left">
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">{profile.name}</h3>
            <p className="text-primary font-semibold mt-2">{profile.designation}</p>
            {profile.qualification && (
              <p className="text-sm text-slate-500 mt-1">{profile.qualification}</p>
            )}
            {profile.intro && (
              <p className="text-lg text-slate-700 font-medium mt-6 leading-relaxed">{profile.intro}</p>
            )}
            {profile.message && (
              <p className="text-slate-600 text-[1.0625rem] leading-[1.85] mt-5 whitespace-pre-line">
                {profile.message}
              </p>
            )}
            {(profile.phone || profile.email) && (
              <div className="flex flex-wrap gap-3 mt-8">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FacilityLeaderProfile;
