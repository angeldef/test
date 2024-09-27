import { useNavigate } from 'react-router-dom';
import { ViewMessageError } from '../utils/viewMessageError';

export const useErrorHandling = () => {
  const navigate = useNavigate();

  const handleApiError = (error?: any) => {
    const errorCode = error?.errors ? error.errors?.[0]?.code : undefined;
    if (error) navigate('/error', { state: ViewMessageError(errorCode) });
  };

  return { handleApiError };
};
