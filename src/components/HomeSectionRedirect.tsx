import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type HomeSectionRedirectProps = {
  sectionId: string;
};

/** Redirects to the homepage and scrolls to a section (e.g. /btech → programs-btech). */
const HomeSectionRedirect = ({ sectionId }: HomeSectionRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (window.location.pathname === '/') {
      scrollToSection();
      return;
    }

    navigate('/', { replace: true });
    const timer = window.setTimeout(scrollToSection, 400);
    return () => window.clearTimeout(timer);
  }, [navigate, sectionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
};

export default HomeSectionRedirect;
