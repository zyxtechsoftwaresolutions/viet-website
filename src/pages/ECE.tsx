import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('ece') || d.includes('electronics') || d.includes('communication');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('ece') || d.includes('electronics') || d.includes('communication');
};

const ECE: React.FC = () => (
  <DepartmentPageTemplate
    slug="ece"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default ECE;
