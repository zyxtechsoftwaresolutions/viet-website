import type { ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FacilityPageEditor from './FacilityPageEditor';
import CampusLifeAdmin from './CampusLifeAdmin';
import TransportAdmin from './TransportAdmin';
import NssAdmin from './facilities/NssAdmin';
import HostelAdmin from './facilities/HostelAdmin';
import LibraryAdmin from './facilities/LibraryAdmin';
import LaboratoryAdmin from './facilities/LaboratoryAdmin';
import SportsAdmin from './facilities/SportsAdmin';
import CafeteriaAdmin from './facilities/CafeteriaAdmin';
import { getFacilityBySlug } from '@/lib/facilityPagesRegistry';

const DEDICATED_EDITORS: Record<string, ComponentType> = {
  'campus-life': CampusLifeAdmin,
  transport: TransportAdmin,
  nss: NssAdmin,
  hostel: HostelAdmin,
  library: LibraryAdmin,
  laboratory: LaboratoryAdmin,
  sports: SportsAdmin,
  cafeteria: CafeteriaAdmin,
};

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

  const DedicatedEditor = DEDICATED_EDITORS[slug];
  if (DedicatedEditor) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/facilities')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Facilities
        </Button>
        <DedicatedEditor />
      </div>
    );
  }

  return <FacilityPageEditor slug={slug} />;
};

export default FacilityEditorRouter;
