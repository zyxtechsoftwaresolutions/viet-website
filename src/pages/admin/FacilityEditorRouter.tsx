import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FacilityPageEditor from './FacilityPageEditor';
import CampusLifeAdmin from './CampusLifeAdmin';
import TransportAdmin from './TransportAdmin';
import { getFacilityBySlug } from '@/lib/facilityPagesRegistry';

const FacilityEditorRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const facility = slug ? getFacilityBySlug(slug) : undefined;

  if (!slug || !facility) {
    return (
      <div className="space-y-4 text-center py-16">
        <p className="text-muted-foreground">Facility page not found.</p>
        <Button onClick={() => navigate('/admin/facilities')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Facilities
        </Button>
      </div>
    );
  }

  if (facility.editor === 'campus-life') {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/facilities')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Facilities
        </Button>
        <CampusLifeAdmin />
      </div>
    );
  }

  if (facility.editor === 'transport') {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/facilities')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Facilities
        </Button>
        <TransportAdmin />
      </div>
    );
  }

  return <FacilityPageEditor slug={slug} />;
};

export default FacilityEditorRouter;
