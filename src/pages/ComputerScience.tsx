import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('cse')!;

const ComputerScience: React.FC = () => (
  <DepartmentPageTemplate
    slug="cse"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={config.facultyFilter}
  />
);

export default ComputerScience;
