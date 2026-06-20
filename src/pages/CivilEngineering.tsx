import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('civil')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('civil');
};

const CivilEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="civil"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default CivilEngineering;
