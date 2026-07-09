export * from './helpers';
export * from './nssContent';
export * from './hostelContent';
export * from './libraryContent';
export * from './laboratoryContent';
export * from './sportsContent';
export * from './cafeteriaContent';

import { normalizeNssContent } from './nssContent';
import { normalizeHostelContent } from './hostelContent';
import { normalizeLibraryContent } from './libraryContent';
import { normalizeLaboratoryContent } from './laboratoryContent';
import { normalizeSportsContent } from './sportsContent';
import { normalizeCafeteriaContent } from './cafeteriaContent';

export const FACILITY_CONTENT_NORMALIZERS = {
  nss: normalizeNssContent,
  hostel: normalizeHostelContent,
  library: normalizeLibraryContent,
  laboratory: normalizeLaboratoryContent,
  sports: normalizeSportsContent,
  cafeteria: normalizeCafeteriaContent,
} as const;
