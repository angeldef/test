import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../modules/auth';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { logged } = useContext(AuthContext);
  return !logged ? children : <Navigate to='/' />;
};
