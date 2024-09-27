import { useEffect, useReducer, useState } from 'react';
import { AuthContext, User, authReducer } from './';
import { authService } from '../../../core/services/auth';
import { types } from '../types/types';
import { useErrorHandling } from '../../../core/hooks';
import { apiService, serviceGetTokenMicrosoft } from '../../../core/services';
import { decryptTokenMicrosoft } from '../../../core/utils/encrypt-decrypt';

const init = () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  return {
    logged: !!token,
    user: user ? JSON.parse(user) : null,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {}, init);
  const { handleApiError } = useErrorHandling();
  const [loading, setLoading] = useState(true);

  const login = (user: User) => {
    const action = { type: types.login, payload: user };
    dispatch(action);
    const { token, userToken } = user;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user-token', userToken);
    sessionStorage.setItem('user', JSON.stringify(user));
    getStatusColors();
  };

  const logout = () => {
    const action = { type: types.logout };
    dispatch(action);
    sessionStorage.clear();
  };

  const getStatusColors = async () => {
    const { data: resp } = await apiService.getStatusColors();
    if (!resp?.data) return;
    const payload = resp.data;
    const action = { type: types.colors, payload };
    dispatch(action);
  };

  const getImages = async () => {
    const { data: resp } = await apiService.getImagesFormIO();
    setLoading(false);
    const images = resp?.data?.components?.map((e: any) => ({ key: e.key, url: e.label }));
    const payload = images.reduce((acc: any, item: any) => {
      acc[item.key] = item.url;
      return acc;
    }, {});

    const action = { type: types.img, payload };
    dispatch(action);
  };

  const refreshToken = async () => {
    const response = await serviceGetTokenMicrosoft();
    if (response?.data) {
      decryptTokenMicrosoft(response.data.data);
    }

    const token = sessionStorage.getItem('user-token');
    if (!token) return;
    const { data: resp, error } = await authService.refreshToken({ token });
    handleApiError(error);
    if (resp) {
      sessionStorage.setItem('user-token', resp.data);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    await refreshToken();
    setInterval(() => {
      refreshToken();
    }, 8 * 60 * 1000);

    await getImages();
    setLoading(false);

    const userToken = sessionStorage.getItem('user-token');
    if (userToken) getStatusColors();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {loading ? <></> : children}
    </AuthContext.Provider>
  );
};
