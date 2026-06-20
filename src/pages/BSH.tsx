import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('bsh')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('bsh') || d.includes('basic science') || d.includes('humanities');
};

const BSH: React.FC = () => (
  <DepartmentPageTemplate
    slug="bsh"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default BSH;
