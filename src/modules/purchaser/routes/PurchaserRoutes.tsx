import { Routes, Route, Navigate } from 'react-router-dom';
import { CreatePurchaseOrder, DashboardPurchaser } from '../components';
import { useRole } from '@/core/hooks/useRole';
import { ROLE } from '@/core/utils/enums';

export const PurchaserRoutes = () => {
  const { hasRole } = useRole();
  if (!hasRole(ROLE.NEGOCIATOR) && !hasRole(ROLE.BUYER)) return <Navigate to='/' />;

  return (
    <Routes>
      <Route path='' element={<DashboardPurchaser />} />
      <Route path='/crear' element={<CreatePurchaseOrder />} />
      <Route path='/crear/:id' element={<CreatePurchaseOrder />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
