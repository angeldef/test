import { useContext } from 'react';
import { AuthContext } from '../../modules/auth';
import { ROLE } from '../utils/enums';

export const useRole = () => {
  const { user } = useContext(AuthContext);
  const { roles } = user ?? {};

  const hasRole = (role: ROLE) => (roles?.includes(role) ? roles : null);

  return { roles, hasRole };
};
