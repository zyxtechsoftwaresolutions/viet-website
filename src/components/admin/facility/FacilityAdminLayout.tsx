import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Save } from 'lucide-react';

type FacilityAdminLayoutProps = {
  title: string;
  publicRoute: string;
  loading: boolean;
  saving: boolean;
  onSave: () => void;
  children: ReactNode;
};

const FacilityAdminLayout = ({
  title,
  publicRoute,
  loading,
  saving,
  onSave,
  children,
}: FacilityAdminLayoutProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">Edit each section to match the public page layout.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={publicRoute} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View page
            </a>
          </Button>
          <Button size="sm" onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default FacilityAdminLayout;
