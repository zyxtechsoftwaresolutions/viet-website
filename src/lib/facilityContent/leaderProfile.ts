import { asString } from './helpers';

export type FacilityLeaderProfile = {
  label: string;
  title: string;
  name: string;
  designation: string;
  qualification: string;
  intro: string;
  image: string;
  message: string;
  phone: string;
  email: string;
};

export function normalizeLeaderProfile(
  raw: unknown,
  fallback: FacilityLeaderProfile
): FacilityLeaderProfile {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    label: asString(value.label, fallback.label),
    title: asString(value.title, fallback.title),
    name: asString(value.name, fallback.name),
    designation: asString(value.designation, fallback.designation),
    qualification: asString(value.qualification, fallback.qualification),
    intro: asString(value.intro, fallback.intro),
    image: asString(value.image, fallback.image),
    message: asString(value.message, fallback.message),
    phone: asString(value.phone, fallback.phone),
    email: asString(value.email, fallback.email),
  };
}
