import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('automobile')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('automobile') || d.includes('ame');
};

const AutomobileEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="automobile"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default AutomobileEngineering;
