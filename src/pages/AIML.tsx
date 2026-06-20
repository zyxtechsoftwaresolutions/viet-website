import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('aiml')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  // Match only CSM: "CSE MachineLearning (CSM)" or exact "CSM"
  return d.includes('cse machinelearning (csm)') || 
         d.includes('machinelearning (csm)') ||
         (d.includes('machine learning') && d.includes('(csm)')) ||
         (d.includes('aiml') && d.includes('(csm)')) ||
         d === 'csm';
};

const AIML: React.FC = () => (
  <DepartmentPageTemplate
    slug="aiml"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default AIML;
