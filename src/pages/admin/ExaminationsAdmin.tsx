import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Pencil, GraduationCap } from 'lucide-react';
import { EXAM_PAGES, getExamAdminPath } from '@/lib/examPagesRegistry';

const ExaminationsAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Examinations</h1>
        <p className="text-muted-foreground mt-2">
          Manage Exam Cell pages — notices, documents, results portals, and contacts. Similar to Campus Life
          editing under Facilities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {EXAM_PAGES.map((page) => (
          <Card key={page.slug} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 shrink-0" />
                {page.title}
              </CardTitle>
              <CardDescription>{page.route}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-3">
              <p className="text-sm text-muted-foreground flex-1">{page.description}</p>
              <div className="flex gap-2 pt-1">
                {page.editor === 'ug-pg' ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(getExamAdminPath(page.slug))}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit Sections
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate('/admin/site-pages')}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Open Site Pages
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => window.open(page.route, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExaminationsAdmin;
