import FacilityPage from '@/pages/FacilityPage';

/** Renders a facility CMS page by slug (library, transport, hostel, etc.). */
export default function FacilitySlugPage({ slug }: { slug: string }) {
  return <FacilityPage slugOverride={slug} />;
}
