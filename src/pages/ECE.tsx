import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('ece')!;

const ECE: React.FC = () => (
  <DepartmentPageTemplate
    slug="ece"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={config.facultyFilter}
  />
);

export default ECE;
