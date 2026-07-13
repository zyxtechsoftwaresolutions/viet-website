/** Registry for Examinations admin hub (Exam Cell pages). */

export type ExamPageMeta = {
  slug: string;
  title: string;
  route: string;
  description: string;
  editor: 'ug-pg' | 'diploma';
};

export const EXAM_PAGES: ExamPageMeta[] = [
  {
    slug: 'ug-pg-examinations',
    title: 'Exam Cell (UG & PG)',
    route: '/examinations/ug-pg',
    description: 'Notices, calendars, regulations, syllabus, time tables, circulars, results, and contacts.',
    editor: 'ug-pg',
  },
  {
    slug: 'diploma-sbtet',
    title: 'Diploma (SBTET)',
    route: '/examinations/diploma',
    description: 'Diploma examination cell content. Use Site Pages for now, or open the public page.',
    editor: 'diploma',
  },
];

export function getExamAdminPath(slug: string): string {
  return `/admin/examinations/${slug}`;
}
