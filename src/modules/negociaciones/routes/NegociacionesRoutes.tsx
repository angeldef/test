import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardNegociacionesPage, DetailNegociationPage } from '..';
import { NegotiationProvider } from '../context';
import { useRole } from '@/core/hooks/useRole';
import { ROLE } from '@/core/utils/enums';

export const NegociacionesRoutes = () => {
  const { hasRole } = useRole();
  if (!hasRole(ROLE.NEGOCIATOR)) return <Navigate to='/' />;

  return (
    <NegotiationProvider>
      <Routes>
        <Route path='' element={<DashboardNegociacionesPage />} />
        <Route path='/crear' element={<DetailNegociationPage />} />
        <Route path='/detalle' element={<DetailNegociationPage />} />
        <Route path='/detalle/:id' element={<DetailNegociationPage />} />
        <Route path='/detalle/:id/solicitudes' element={<DetailNegociationPage />} />
        <Route path='/*' element={<Navigate to='/negociaciones' />} />
      </Routes>
    </NegotiationProvider>
  );
};
