import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('data-science')!;

const DataScience: React.FC = () => (
  <DepartmentPageTemplate
    slug="data-science"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={config.facultyFilter}
  />
);

export default DataScience;
