import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('aiml')!;

const AIML: React.FC = () => (
  <DepartmentPageTemplate
    slug="aiml"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={config.facultyFilter}
  />
);

export default AIML;
