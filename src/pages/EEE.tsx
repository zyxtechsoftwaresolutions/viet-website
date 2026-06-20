import React from 'react';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

const config = getDepartmentPageConfig('eee')!;

const facultyFilter = (department: string) => {
  const d = (department || '').toLowerCase().trim();
  // Match EEE: must include "electrical" AND "electronics", OR exact "eee"
  // Exclude ECE which has "communication" but not "electrical"
  const hasElectrical = d.includes('electrical');
  const hasElectronics = d.includes('electronics');
  const hasCommunication = d.includes('communication');
  
  // Match if: (electrical + electronics) OR exact EEE codes, but NOT communication/ECE
  if (hasCommunication || d.includes('(ece)') || d.includes('ece')) return false;
  if (d === 'eee' || d === 'engineering ug - eee' || d === 'diploma - eee') return true;
  return hasElectrical && hasElectronics;
};

const EEE: React.FC = () => (
  <DepartmentPageTemplate
    slug="eee"
    backHref="/btech"
    galleryFilter={config.galleryFilter}
    facultyFilter={facultyFilter}
  />
);

export default EEE;
