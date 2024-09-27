import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../core/services/auth';
import { urlPortalOfPortals } from '../../../core/utils/constants';
import { AuthContext } from '..';
import { useErrorHandling } from '../../../core/hooks';
import { ROLE } from '@/core/utils/enums';

export const AuthPage = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { handleApiError } = useErrorHandling();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const token = searchParams.get('token');
    if (!token) window.location.href = urlPortalOfPortals;
    else {
      const { data: resp, error } = await authService.login({ token });
      handleApiError(error);
      if (resp) {
        const { data: userToken, email, displayName, modules, role } = resp;
        // const role = [ROLE.NEGOCIATOR];
        // const role = [ROLE.BUYER];

        login({ token, userToken, email, displayName, modules, roles: role });
        navigate('/principal', { replace: true });
      }
    }
  };

  return <></>;
};
