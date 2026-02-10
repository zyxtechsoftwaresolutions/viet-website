import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';

const galleryFilter = (img: { department?: string }) => {
  const d = (img.department || '').toLowerCase();
  return d.includes('aiml') || d.includes('ai') || d.includes('ml') || d.includes('cse') || d.includes('computer');
};

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  // Match only CSM: "CSE MachineLearning (CSM)" or exact "CSM"
  return d.includes('cse machinelearning (csm)') || 
         d.includes('machinelearning (csm)') ||
         (d.includes('machine learning') && d.includes('(csm)')) ||
         (d.includes('aiml') && d.includes('(csm)')) ||
         d === 'csm';
};

const AIML: React.FC = () => (
  <DepartmentPageTemplate
    slug="aiml"
    backHref="/btech"
    galleryFilter={galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default AIML;
