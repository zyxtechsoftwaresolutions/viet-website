import { useState, useEffect, useRef } from 'react';
import { admissionPopupSettingsAPI } from '@/lib/api';
import { preloadAdmissionPopupImages } from '@/lib/admissionPopupImages';
import AdmissionPopupDialog from './AdmissionPopupDialog';

const INTRO_EVENT = 'introComplete';

function waitForIntro(maxMs = 2500): Promise<void> {
  return new Promise((resolve) => {
    if (!document.getElementById('root')?.querySelector('.invisible.overflow-hidden')) {
      resolve();
      return;
    }
    const finish = () => resolve();
    window.addEventListener(INTRO_EVENT, finish, { once: true });
    setTimeout(finish, maxMs);
  });
}

const AdmissionPopup = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<{
    title: string;
    subtitle: string;
    images?: string[];
  } | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;

    const run = async () => {
      await waitForIntro();
      if (cancelled || closedRef.current) return;

      try {
        const data = await admissionPopupSettingsAPI.get();
        if (cancelled || closedRef.current || !data.is_enabled) return;

        const images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
        if (images.length) preloadAdmissionPopupImages(images);

        const config = {
          title: data.title || 'Admissions Open 2025–26',
          subtitle:
            data.subtitle ||
            'Share your details and our admissions team will contact you shortly.',
          images,
        };
        const delayMs = Math.max(data.delay_seconds ?? 2, 0) * 1000;

        setSettings(config);
        delayTimer = setTimeout(() => {
          if (!cancelled && !closedRef.current) setOpen(true);
        }, delayMs);
      } catch {
        // API unavailable — do not block the site
      }
    };

    run();

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, []);

  const handleClose = () => {
    closedRef.current = true;
    setOpen(false);
  };

  if (!open || !settings) return null;

  return <AdmissionPopupDialog settings={settings} onClose={handleClose} />;
};

export default AdmissionPopup;
