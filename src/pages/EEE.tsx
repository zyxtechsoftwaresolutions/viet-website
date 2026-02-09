import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('eee') || d.includes('electrical') || d.includes('electronics');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('eee') || d.includes('electrical');
};

const EEE: React.FC = () => (
  <DepartmentPageTemplate
    slug="eee"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default EEE;
