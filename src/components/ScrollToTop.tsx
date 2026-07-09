import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToHashSection, scrollToPageTop } from '@/lib/scrollToHashSection';

/** Scroll to top on route change, or to a hash section when the URL includes a hash. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      scrollToHashSection(hash, 150);
    } else {
      scrollToPageTop();
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
