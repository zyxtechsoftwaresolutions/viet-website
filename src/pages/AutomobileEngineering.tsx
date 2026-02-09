import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('automobile') || d.includes('ame');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  return d.includes('automobile') || d.includes('ame');
};

const AutomobileEngineering: React.FC = () => (
  <DepartmentPageTemplate
    slug="automobile"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default AutomobileEngineering;
