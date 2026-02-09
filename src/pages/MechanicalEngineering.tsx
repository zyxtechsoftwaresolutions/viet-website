import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('mechanical');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('mechanical');
};

const MechanicalEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="mechanical"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default MechanicalEngineering;
