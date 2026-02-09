import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('civil');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('civil');
};

const CivilEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="civil"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default CivilEngineering;
