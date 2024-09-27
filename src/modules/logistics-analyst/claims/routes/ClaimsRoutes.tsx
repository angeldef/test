import { Routes, Route, Navigate } from 'react-router-dom';
import { SporadicsRoutes } from '../sporadics/routes';
import { NetworkAssistanceRoutes } from '../network-assistance/routes';

export const ClaimsRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<SporadicsRoutes />} />
      <Route path='/esporadicos/*' element={<SporadicsRoutes />} />
      <Route path='/red-asistencia/*' element={<NetworkAssistanceRoutes />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
