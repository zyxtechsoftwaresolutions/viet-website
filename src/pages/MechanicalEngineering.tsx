import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('mechanical')!;

const MechanicalEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="mechanical"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={config.facultyFilter}
  />
);

export default MechanicalEngineering;
