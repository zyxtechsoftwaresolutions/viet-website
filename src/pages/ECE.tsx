import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('ece')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase().trim();
  // Match ECE: must include "electronics" AND "communication", OR exact "ece"
  // Exclude EEE which has "electrical" but not "communication"
  const hasElectronics = d.includes('electronics');
  const hasCommunication = d.includes('communication');
  const hasElectrical = d.includes('electrical');
  
  // Match if: (electronics + communication) OR exact ECE codes, but NOT electrical/EEE
  if (hasElectrical || d.includes('(eee)') || d.includes('eee')) return false;
  if (d === 'ece' || d === 'engineering ug - ece' || d === 'diploma - ece') return true;
  return hasElectronics && hasCommunication;
};

const ECE: React.FC = () => (
  <DepartmentPageTemplate
    slug="ece"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default ECE;
