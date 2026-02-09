import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('computer science') || d.includes('cse') || d.includes('engineering ug - computer');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('computer') || d.includes('cse');
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
