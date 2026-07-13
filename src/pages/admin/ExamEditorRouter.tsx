import { Navigate, useParams } from 'react-router-dom';
import UGPGExaminationsAdmin from '@/pages/admin/UGPGExaminationsAdmin';

const ExamEditorRouter = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'ug-pg-examinations') {
    return <UGPGExaminationsAdmin />;
  }

  return <Navigate to="/admin/examinations" replace />;
};

export default ExamEditorRouter;
