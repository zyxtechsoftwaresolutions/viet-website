import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('bsh') || d.includes('basic science') || d.includes('humanities');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('bsh') || d.includes('basic science') || d.includes('humanities');
};

const BSH: React.FC = () => (
  <DepartmentPageTemplate
    slug="bsh"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default BSH;
