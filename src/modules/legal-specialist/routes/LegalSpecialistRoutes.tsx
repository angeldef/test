import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLegalSpecialist, DetailLegalSpecialist } from '../components';
import { useRole } from '@/core/hooks/useRole';
import { ROLE } from '@/core/utils/enums';

export const LegalSpecialistRoutes = () => {
  const { hasRole } = useRole();
  if (!hasRole(ROLE.LEGAL)) return <Navigate to='/' />;

  return (
    <Routes>
      <Route path='' element={<DashboardLegalSpecialist />} />
      <Route path='/detalle/:id' element={<DetailLegalSpecialist />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
