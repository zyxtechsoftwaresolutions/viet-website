import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pagesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Building2, ExternalLink, Pencil } from 'lucide-react';
import { imgUrl } from '@/lib/imageUtils';
import { FACILITY_PAGES, getFacilityAdminPath } from '@/lib/facilityPagesRegistry';

interface PageRecord {
  slug: string;
  content?: Record<string, unknown>;
}

const FacilitiesAdmin = () => {
  const navigate = useNavigate();
  const [pagesBySlug, setPagesBySlug] = useState<Record<string, PageRecord>>({});
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const data = await pagesAPI.getAll();
      const raw = Array.isArray(data) ? data : (data?.pages ?? data?.data ?? []);
      const list = Array.isArray(raw) ? raw : [];
      const map: Record<string, PageRecord> = {};
      for (const p of list) {
        const slug = p.slug || '';
        if (!slug) continue;
        const category = (p.category || '').toLowerCase();
        if (category === 'facilities' || slug === 'campus-life') {
          map[slug] = { slug, content: p.content || {} };
        }
      }
      setPagesBySlug(map);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch facilities';
      toast.error(message);
      setPagesBySlug({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facilities</h1>
        <p className="text-muted-foreground mt-2">
          Manage all campus facility pages — Campus Life, Library, Transport, Hostel, and more. Each page has
          section-wise editing for text and photos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FACILITY_PAGES.map((facility) => {
          const page = pagesBySlug[facility.slug];
          const hero = (page?.content?.hero || {}) as Record<string, string>;
          const heroImage = hero.heroImage || (page?.content?.heroImage as string);

          return (
            <Card key={facility.slug} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 shrink-0" />
                  {facility.title}
                </CardTitle>
                <CardDescription>{facility.route}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-3">
                <p className="text-sm text-muted-foreground flex-1">{facility.description}</p>
                {heroImage && (
                  <img
                    src={imgUrl(heroImage)}
                    alt={facility.title}
                    className="w-full h-24 object-cover rounded"
                  />
                )}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(getFacilityAdminPath(facility.slug))}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit Sections
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(facility.route, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                {!page && (
                  <p className="text-xs text-amber-600">Not saved yet — open editor and save to create.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FacilitiesAdmin;
