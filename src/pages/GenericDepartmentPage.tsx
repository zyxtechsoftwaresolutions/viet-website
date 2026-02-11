import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DepartmentPageTemplate from '@/components/DepartmentPageTemplate';
import { getDepartmentPageConfig } from '@/lib/departmentPageConfig';

/**
 * Renders a department page by slug (e.g. /programs/department/diploma-civil).
 * Used for Diploma, Engineering PG, and Management department pages.
 * Engineering UG pages that have custom components (CSE, ECE, etc.) still use their own routes.
 */
const GenericDepartmentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getDepartmentPageConfig(slug) : null;

  if (!slug || !config) {
    return <Navigate to="/" replace />;
  }

  return (
    <DepartmentPageTemplate
      slug={config.slug}
      backHref={config.backHref}
      galleryFilter={config.galleryFilter}
      facultyFilter={config.facultyFilter}
    />
  );
};

export default GenericDepartmentPage;
