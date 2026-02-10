import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('computer science') || d.includes('cse') || d.includes('engineering ug - computer');
};

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
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default ComputerScience;
