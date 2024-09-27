import { Demo } from '../../demo';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages';
import { NegociacionesRoutes } from '../../negociaciones/routes';
import { LogisticsAnalystRoutes } from '../../logistics-analyst';
import { LegalSpecialistRoutes } from '@/modules/legal-specialist';
import { PurchaserRoutes } from '@/modules/purchaser';
import { useRole } from '@/core/hooks/useRole';
import { ROLE } from '@/core/utils/enums';

export const HomeRoutes = () => {
  const redirectDefault = () => {
    const { roles, hasRole } = useRole();
    switch (roles) {
      case hasRole(ROLE.NEGOCIATOR):
        return <Navigate to='/principal' />;
      case hasRole(ROLE.ANALYST):
        return <Navigate to='/principal' />;
      case hasRole(ROLE.LEGAL):
        return <Navigate to='/principal' />;
      case hasRole(ROLE.BUYER):
        return <Navigate to='/principal' />;
    }
  };

  return (
    <Routes>
      <Route path='demo' element={<Demo />} />
      <Route path='principal' element={<DashboardPage />} />
      <Route path='negociaciones/*' element={<NegociacionesRoutes />} />
      <Route path='analista-logistica/*' element={<LogisticsAnalystRoutes />} />
      <Route path='especialista-legal/*' element={<LegalSpecialistRoutes />} />
      <Route path='orden-compra/*' element={<PurchaserRoutes />} />
      <Route path='/*' element={redirectDefault()} />
    </Routes>
  );
};
