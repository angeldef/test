import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLogisticsAnalyst, DetailLogisticsAnalyst } from '../components';
import { useRole } from '@/core/hooks/useRole';
import { ClaimsRoutes } from '../claims/routes';
import { ROLE } from '@/core/utils/enums';

export const LogisticsAnalystRoutes = () => {
  const { hasRole } = useRole();
  if (!hasRole(ROLE.ANALYST)) return <Navigate to='/' />;

  return (
    <Routes>
      <Route path='' element={<DashboardLogisticsAnalyst />} />
      <Route path='/detalle/:id' element={<DetailLogisticsAnalyst />} />
      <Route path='/siniestros/*' element={<ClaimsRoutes />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
