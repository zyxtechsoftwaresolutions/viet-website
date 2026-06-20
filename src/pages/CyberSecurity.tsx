import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('cyber-security')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase();
  // Match only CSC: "CSE CyberSecurity (CSC)" or exact "CSC"
  return d.includes('cse cybersecurity (csc)') || 
         d.includes('cybersecurity (csc)') ||
         (d.includes('cyber') && d.includes('(csc)')) ||
         d === 'csc';
};

const CyberSecurity: React.FC = () => (
  <DepartmentPageTemplate
    slug="cyber-security"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default CyberSecurity;
