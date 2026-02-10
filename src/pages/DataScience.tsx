import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('data science') || d.includes('cse') || d.includes('computer');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  // Match only CSD: "CSE DataScience (CSD)" or exact "CSD"
  return d.includes('cse datascience (csd)') || 
         d.includes('datascience (csd)') ||
         (d.includes('data science') && d.includes('(csd)')) ||
         d === 'csd';
};

const DataScience: React.FC = () => (
  <DepartmentPageTemplate
    slug="data-science"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default DataScience;
