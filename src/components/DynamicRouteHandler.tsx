import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pagesAPI } from '@/lib/api';
import DynamicPage from '@/pages/DynamicPage';
import NotFound from '@/pages/NotFound';

// This component checks if the current route matches a page in the database
// and renders it if found, otherwise shows 404
const DynamicRouteHandler = () => {
  const location = useLocation();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const checkPage = async () => {
      // Skip admin routes and known routes
      if (location.pathname.startsWith('/admin') || 
          location.pathname.startsWith('/page/')) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const allPages = await pagesAPI.getAll();
        const matchingPage = allPages.find((p: any) => p.route === location.pathname);
        
        if (matchingPage) {
          setPage(matchingPage);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error checking page:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    checkPage();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound || !page) {
    return <NotFound />;
  }

  // Render the dynamic page with the page data
  return <DynamicPage pageData={page} />;
};

export default DynamicRouteHandler;

