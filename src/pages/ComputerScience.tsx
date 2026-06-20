import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('cse')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  // Match only CSE: "Computer Science and Engineering (CSE)" or exact "CSE"
  // Exclude CSC, CSD, CSM which have their own filters
  return (d.includes('computer science and engineering (cse)') || 
          d === 'cse' ||
          (d.includes('computer science') && d.includes('(cse)') && !d.includes('cyber') && !d.includes('datascience') && !d.includes('machinelearning'))) &&
         !d.includes('(csc)') && !d.includes('(csd)') && !d.includes('(csm)');
};

const ComputerScience: React.FC = () => (
  <DepartmentPageTemplate
    slug="cse"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default ComputerScience;
