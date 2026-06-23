import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import { admissionLeadsAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { preloadAdmissionPopupImages } from '@/lib/admissionPopupImages';

const PROGRAMMES = [
  { group: 'B.Tech (Engineering UG)', items: [
    'B.Tech – Computer Science & Engineering',
    'B.Tech – CSE (AI & Machine Learning)',
    'B.Tech – CSE (Data Science)',
    'B.Tech – CSE (Cyber Security)',
    'B.Tech – Electronics & Communication Engineering',
    'B.Tech – Electrical & Electronics Engineering',
    'B.Tech – Mechanical Engineering',
    'B.Tech – Civil Engineering',
    'B.Tech – Automobile Engineering',
  ]},
  { group: 'Diploma', items: [
    'Diploma – Computer Science Engineering',
    'Diploma – Electronics & Communication Engineering',
    'Diploma – Electrical & Electronics Engineering',
    'Diploma – Mechanical Engineering',
    'Diploma – Civil Engineering',
  ]},
  { group: 'Postgraduate & Management', items: ['M.Tech', 'MBA', 'MCA'] },
  { group: 'Other', items: ['Not sure yet / Need guidance'] },
];

const QUALIFICATIONS = [
  'Intermediate (12th)',
  'Diploma',
  'Degree (Graduate)',
  'Post Graduate',
  'Other',
];

type FormState = {
  name: string;
  mobile: string;
  email: string;
  program: string;
  qualification: string;
  city: string;
  district: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  mobile: '',
  email: '',
  program: '',
  qualification: '',
  city: '',
  district: '',
  message: '',
};

type Props = {
  settings: { title: string; subtitle: string; images?: string[] };
  onClose: () => void;
};

const CAROUSEL_INTERVAL_MS = 4500;

function AdmissionImageCarousel({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const validImages = images.filter(Boolean);

  useEffect(() => {
    preloadAdmissionPopupImages(validImages);
  }, [validImages]);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [validImages.length]);

  const markLoaded = (src: string) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#7a3b08]">
      {validImages.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
          <ImageIcon className="h-10 w-10 opacity-40" strokeWidth={1.25} />
          <span className="text-xs font-medium tracking-wide uppercase">Admission highlights</span>
        </div>
      ) : (
        <>
          {validImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out',
                !loaded[src]
                  ? 'opacity-0'
                  : validImages.length === 1 || index === activeIndex
                    ? 'opacity-100'
                    : 'opacity-0'
              )}
              loading="eager"
              decoding="async"
              fetchpriority={index === 0 ? 'high' : 'low'}
              ref={(el) => {
                if (el?.complete) markLoaded(src);
              }}
              onLoad={() => markLoaded(src)}
            />
          ))}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
              {validImages.map((src, index) => (
                <span
                  key={`dot-${src}`}
                  className={cn(
                    'h-1.5 transition-all duration-300',
                    index === activeIndex ? 'w-5 bg-[#F58220]' : 'w-1.5 bg-white/70'
                  )}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const AdmissionPopupDialog = ({ settings, onClose }: Props) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const images = settings.images ?? [];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prev;
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    const digits = form.mobile.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.program) {
      setError('Please select a programme.');
      return;
    }

    setSubmitting(true);
    try {
      await admissionLeadsAPI.submit({
        name: form.name.trim(),
        mobile: digits.slice(-10),
        email: form.email.trim() || undefined,
        program: form.program,
        qualification: form.qualification || undefined,
        city: form.city.trim() || undefined,
        district: form.district.trim() || undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-200 ease-out',
        'px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
        'md:p-5',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admission-popup-title"
    >
      <div
        className="absolute inset-0 bg-[#0f1c33]/70"
        onClick={handleDismiss}
        aria-hidden
      />

      <div
        className={cn(
          'admission-popup-mobile-shell relative z-[1] flex w-full flex-col overflow-hidden rounded-none transition-opacity duration-200 ease-out',
          'h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)]',
          'max-w-[min(100%,22.5rem)]',
          'md:h-[min(92vh,760px)] md:max-h-[min(92vh,760px)] md:max-w-[980px]',
          'md:border-2 md:border-[#9a4a0a] md:shadow-[6px_6px_0_rgba(154,74,10,0.18)]',
          visible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Left — image (desktop only) */}
          <div className="relative hidden h-full shrink-0 md:block md:w-[42%]">
            <AdmissionImageCarousel images={images} />
          </div>

          {/* Form panel */}
          <div className="campus-craft-panel campus-craft-panel--orange admission-popup-form-panel flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 shadow-none md:border-l-2 md:border-l-[#9a4a0a]">
            <div className="campus-craft-header campus-craft-header--orange relative z-[3] flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 pr-2.5 md:gap-3 md:px-[1.15rem] md:py-[0.85rem]">
              <div className="min-w-0">
                <h2 id="admission-popup-title" className="campus-craft-header-title text-[0.72rem] md:text-[0.8rem]">
                  Student enquiry form
                </h2>
                <p className="mt-0.5 text-[10px] font-medium tracking-wide text-white/85 md:mt-1 md:text-[11px]">
                  <span className="hidden md:inline">Fields marked with </span>
                  <span className="md:hidden">Required </span>
                  <span className="font-bold text-white">*</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 md:h-8 md:w-8"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>

            <div className="relative z-[3] min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-2.5 md:px-5 md:py-5">
              {submitted ? (
                <div className="flex min-h-[200px] flex-col items-start justify-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#76B82A]/15">
                    <CheckCircle2 className="h-6 w-6 text-[#76B82A]" />
                  </div>
                  <h3 className="mt-4 font-[Montserrat] text-lg font-bold text-[#7a3b08]">
                    Thank you for your interest
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#4D545D]">
                    Your details have been received. Our admissions team will contact you shortly.
                  </p>
                  <Button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-5 rounded-none bg-[#F58220] font-semibold text-white hover:bg-[#e07418]"
                  >
                    Continue browsing
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col space-y-2 md:space-y-3.5">
                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-2 md:gap-3.5">
                    <div className="md:col-span-2">
                      <Label htmlFor="adm-name" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Full name <span className="text-[#F58220]">*</span>
                      </Label>
                      <Input
                        id="adm-name"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="adm-mobile" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Mobile number <span className="text-[#F58220]">*</span>
                      </Label>
                      <Input
                        id="adm-mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="10-digit mobile"
                        className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                        autoComplete="tel"
                        maxLength={14}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="adm-email" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Email address
                      </Label>
                      <Input
                        id="adm-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@email.com"
                        className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                        autoComplete="email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Programme interested in <span className="text-[#F58220]">*</span>
                      </Label>
                      <Select
                        value={form.program}
                        onValueChange={(v) => handleChange('program', v)}
                        modal={false}
                      >
                        <SelectTrigger className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base">
                          <SelectValue placeholder="Select a programme" />
                        </SelectTrigger>
                        <SelectContent className="z-[10050] max-h-64 rounded-none" position="popper">
                          {PROGRAMMES.map((group) => (
                            <SelectGroup key={group.group}>
                              <SelectLabel className="text-[11px] font-semibold uppercase tracking-wide text-[#4D545D]">
                                {group.group}
                              </SelectLabel>
                              {group.items.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Qualification
                      </Label>
                      <Select
                        value={form.qualification}
                        onValueChange={(v) => handleChange('qualification', v)}
                        modal={false}
                      >
                        <SelectTrigger className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent className="z-[10050] rounded-none" position="popper">
                          {QUALIFICATIONS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="adm-city" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        City / Town
                      </Label>
                      <Input
                        id="adm-city"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Your city"
                        className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="adm-district" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        District
                      </Label>
                      <Input
                        id="adm-district"
                        value={form.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        placeholder="Your district"
                        className="mt-0.5 h-8 rounded-none border-[#9a4a0a]/20 bg-white px-2 text-sm focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="adm-message" className="text-[10px] font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Message / Query
                      </Label>
                      <Textarea
                        id="adm-message"
                        value={form.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Any specific questions about admission, fees, or hostel?"
                        rows={2}
                        className="mt-0.5 min-h-[3.25rem] resize-none rounded-none border-[#9a4a0a]/20 bg-white px-2 py-1.5 text-sm focus-visible:ring-[#F58220] md:mt-1 md:min-h-[5.5rem] md:px-3 md:text-base"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-600 md:px-3 md:py-2 md:text-sm">
                      {error}
                    </p>
                  )}

                  <div className="mt-auto shrink-0 flex flex-col-reverse gap-2 border-t border-[#9a4a0a]/10 pt-2 md:flex-row md:items-center md:justify-between md:gap-3 md:pt-3">
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="text-xs font-medium text-[#4D545D] transition-colors hover:text-[#7a3b08] md:text-sm"
                    >
                      Maybe later
                    </button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-9 w-full rounded-none bg-[#F58220] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#e07418] md:h-10 md:w-auto md:px-8"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        'Submit enquiry'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdmissionPopupDialog;
