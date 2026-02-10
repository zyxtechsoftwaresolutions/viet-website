import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { pagesAPI } from '@/lib/api';
import ImageModal from '@/components/ImageModal';
import { User } from 'lucide-react';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      if (!slug) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      try {
        const page = await pagesAPI.getBySlug(slug);
        if (page) {
          setPageContent(page);
        } else {
          setError('Page not found');
        }
      } catch (err: any) {
        console.error('Error fetching page content:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <LeaderPageNavbar backHref="/" />
        <div className="container mx-auto px-4 py-16 pt-56">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading page...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pageContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <LeaderPageNavbar backHref="/" />
        <div className="container mx-auto px-4 py-16 pt-56">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
              <p className="text-muted-foreground">{error || 'The requested page could not be found.'}</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const content = pageContent.content || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/" />
      
      {/* Hero Section */}
      <section className="pt-56 pb-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {content.hero?.title || pageContent.title}
            </h1>
            {content.hero?.description && (
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                {content.hero.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {content.mainContent && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify [&_p]:text-justify"
                dangerouslySetInnerHTML={{ __html: content.mainContent }}
              />
            </CardContent>
          </Card>
        )}

        {content.message && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100 mb-8">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify [&_p]:text-justify"
                dangerouslySetInnerHTML={{ __html: content.message }}
              />
            </CardContent>
          </Card>
        )}

        {/* Images */}
        {content.heroImage && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <img
                src={content.heroImage}
                alt={pageContent.title}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        {/* Tables */}
        {content.tables && Object.keys(content.tables).length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              {Object.entries(content.tables).map(([tableName, tableData]: [string, any]) => (
                <div key={tableName} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">{tableName}</h3>
                  {tableData.headers && tableData.rows && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-slate-300">
                        <thead>
                          <tr>
                            {tableData.headers.map((header: string, idx: number) => (
                              <th
                                key={idx}
                                className="border border-slate-300 px-4 py-2 bg-slate-100 font-semibold text-left"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.rows.map((row: string[], rowIdx: number) => (
                            <tr key={rowIdx}>
                              {row.map((cell: string, cellIdx: number) => (
                                <td
                                  key={cellIdx}
                                  className="border border-slate-300 px-4 py-2"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Content */}
        {content.additional && Object.keys(content.additional).length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              {Object.entries(content.additional).map(([key, value]: [string, any]) => (
                <div key={key} className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{key}</h3>
                  {typeof value === 'string' ? (
                    <div className="text-justify [&_p]:text-justify" dangerouslySetInnerHTML={{ __html: value }} />
                  ) : (
                    <pre className="bg-slate-100 p-4 rounded overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default DynamicPage;

