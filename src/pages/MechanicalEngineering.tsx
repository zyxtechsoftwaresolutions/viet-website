import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('mechanical')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('mechanical');
};

const MechanicalEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="mechanical"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default MechanicalEngineering;
