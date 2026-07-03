import DynamicPage from '@/pages/DynamicPage';

/** Renders a CMS page by slug (for static App routes → database content). */
export default function CmsRoutePage({ slug }: { slug: string }) {
  return <DynamicPage slugOverride={slug} />;
}
