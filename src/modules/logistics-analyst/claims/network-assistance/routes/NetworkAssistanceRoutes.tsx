import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardNetworkAssistance } from '../components';

export const NetworkAssistanceRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<DashboardNetworkAssistance />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
