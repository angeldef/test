import { useContext } from 'react';
import { AuthContext } from '../../modules/auth';

export const useStateColor = () => {
  const { statusColors } = useContext(AuthContext);

  const getColor = (description: string) => {
    const status = statusColors?.find((e) => e.description === description);
    return status?.color ? status.color : '#454c3e';
  };

  return { getColor };
};
