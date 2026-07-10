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
    const scrollY = window.scrollY;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
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
        'fixed inset-0 z-[10000] flex transition-opacity duration-200 ease-out',
        'items-stretch justify-stretch md:items-center md:justify-center md:p-5',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Admission Enquiry"
    >
      <div
        className="absolute inset-0 bg-[#0f1c33]/70 max-md:hidden"
        onClick={handleDismiss}
        aria-hidden
      />

      <div
        className={cn(
          'admission-popup-mobile-shell relative z-[1] flex w-full flex-col overflow-hidden rounded-none bg-white transition-opacity duration-200 ease-out',
          'max-md:fixed max-md:inset-0 max-md:h-[100dvh] max-md:max-h-[100dvh] max-md:w-full',
          'md:relative md:h-[min(92vh,760px)] md:max-h-[min(92vh,760px)] md:max-w-[980px] md:bg-transparent',
          'md:border-2 md:border-[#9a4a0a] md:shadow-[6px_6px_0_rgba(154,74,10,0.18)]',
          visible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex h-full min-h-0 w-full flex-1 flex-col max-md:min-h-0 md:flex-row">
          {/* Left — image (tablet & desktop only) */}
          <div className="relative hidden h-full shrink-0 md:block md:w-[42%]">
            <AdmissionImageCarousel images={images} />
          </div>

          {/* Form panel — mobile sheet vs desktop craft panel */}
          <div className="admission-popup-mobile-layout campus-craft-panel campus-craft-panel--orange admission-popup-form-panel flex h-full min-h-0 w-full flex-1 flex-col rounded-none border-0 shadow-none md:overflow-hidden md:border-l-2 md:border-l-[#9a4a0a]">
            {/* Mobile header */}
            <div className="admission-popup-mobile-header relative z-[3] flex shrink-0 items-center justify-between gap-2 border-b border-[#F58220]/20 bg-gradient-to-r from-[#7a3b08] via-[#c45f0a] to-[#7a3b08] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
              <div className="min-w-0 flex-1">
                <h2
                  id="admission-popup-title-mobile"
                  className="font-[Montserrat] text-lg font-bold uppercase leading-tight tracking-wide text-white"
                >
                  Admission Enquiry
                </h2>
                <p className="mt-1 text-xs font-medium text-white/90">
                  Fields marked with <span className="font-bold text-white">*</span> are required
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white active:bg-white/30"
                aria-label="Close admission enquiry"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tablet & desktop header */}
            <div className="campus-craft-header campus-craft-header--orange relative z-[3] hidden shrink-0 items-start justify-between gap-3 px-[1.15rem] py-[0.85rem] md:flex md:items-center">
              <div className="min-w-0 flex-1 pr-1">
                <h2
                  id="admission-popup-title"
                  className="campus-craft-header-title text-[1.05rem] leading-tight tracking-[0.12em]"
                >
                  Admission Enquiry
                </h2>
                <p className="mt-1.5 text-xs font-medium leading-snug text-white/90">
                  Fields marked with <span className="font-bold text-white">*</span> are required
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close admission enquiry"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <div className="relative z-[3] min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-5 md:py-5">
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
              </div>
            ) : (
              <>
                <div className="admission-popup-mobile-scroll relative z-[3] min-h-0 overflow-x-hidden overflow-y-auto max-md:px-4 max-md:py-4 max-md:pb-6 md:flex-1 md:px-5 md:py-5">
                  <form id="admission-enquiry-form" onSubmit={handleSubmit} className="admission-popup-mobile-form">
                    <div className="grid grid-cols-1 gap-3 max-md:gap-y-3.5 md:grid-cols-2 md:gap-3.5">
                    <div className="md:col-span-2">
                      <Label htmlFor="adm-name" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        Full name <span className="text-[#F58220]">*</span>
                      </Label>
                      <Input
                        id="adm-name"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus-visible:ring-[#F58220] md:h-10 md:text-base"
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:contents">
                    <div>
                      <Label htmlFor="adm-mobile" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        <span className="md:hidden">Mobile </span>
                        <span className="hidden md:inline">Mobile number </span>
                        <span className="text-[#F58220]">*</span>
                      </Label>
                      <Input
                        id="adm-mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="10-digit mobile"
                        className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={14}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="adm-email" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        <span className="md:hidden">Email</span>
                        <span className="hidden md:inline">Email address</span>
                      </Label>
                      <Input
                        id="adm-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@email.com"
                        className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                        autoComplete="email"
                      />
                    </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        <span className="md:hidden">Programme </span>
                        <span className="hidden md:inline">Programme interested in </span>
                        <span className="text-[#F58220]">*</span>
                      </Label>
                      <Select
                        value={form.program}
                        onValueChange={(v) => handleChange('program', v)}
                        modal={false}
                      >
                        <SelectTrigger className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base">
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

                    <div className="grid grid-cols-2 gap-3 md:contents">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        Qualification
                      </Label>
                      <Select
                        value={form.qualification}
                        onValueChange={(v) => handleChange('qualification', v)}
                        modal={false}
                      >
                        <SelectTrigger className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base">
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
                      <Label htmlFor="adm-city" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08]">
                        <span className="md:hidden">City</span>
                        <span className="hidden md:inline">City / Town</span>
                      </Label>
                      <Input
                        id="adm-city"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Your city"
                        className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                      />
                    </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="adm-district" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        District
                      </Label>
                      <Input
                        id="adm-district"
                        value={form.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        placeholder="Your district"
                        className="mt-1 h-11 rounded-none border-[#9a4a0a]/20 bg-white px-3 text-base focus-visible:ring-[#F58220] md:mt-1 md:h-10 md:px-3 md:text-base"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="adm-message" className="text-xs font-bold uppercase tracking-wide text-[#7a3b08] md:text-xs">
                        Message / Query
                      </Label>
                      <Textarea
                        id="adm-message"
                        value={form.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Any specific questions about admission, fees, or hostel?"
                        rows={3}
                        className="mt-1 min-h-[5rem] resize-none rounded-none border-[#9a4a0a]/20 bg-white px-3 py-2 text-base focus-visible:ring-[#F58220] md:min-h-[5.5rem] md:text-base"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Mobile sticky footer — submit always visible */}
              <div className="admission-popup-mobile-footer relative z-[3] shrink-0 border-t border-[#e8e8e8] bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
                {error && (
                  <p className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="shrink-0 py-2 text-sm font-medium text-[#4D545D]"
                  >
                    Maybe later
                  </button>
                  <Button
                    type="submit"
                    form="admission-enquiry-form"
                    disabled={submitting}
                    className="h-12 min-w-0 flex-1 rounded-none bg-[#F58220] text-base font-semibold text-white shadow-none hover:bg-[#e07418]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit enquiry'
                    )}
                  </Button>
                </div>
              </div>

              {/* Tablet & desktop footer */}
              <div className="relative z-[3] hidden shrink-0 border-t border-[#9a4a0a]/15 bg-[#fffaf5] px-5 py-4 md:block">
                {error && (
                  <p className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-sm font-medium text-[#4D545D] transition-colors hover:text-[#7a3b08]"
                  >
                    Maybe later
                  </button>
                  <Button
                    type="submit"
                    form="admission-enquiry-form"
                    disabled={submitting}
                    className="h-10 rounded-none bg-[#F58220] px-8 text-sm font-semibold text-white shadow-none hover:bg-[#e07418]"
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
              </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdmissionPopupDialog;
