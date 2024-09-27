import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardSporadics, DetailSporadic } from '../components';

export const SporadicsRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<DashboardSporadics />} />
      <Route path='/detalle/:id' element={<DetailSporadic />} />
      <Route path='/*' element={<Navigate to='' />} />
    </Routes>
  );
};
