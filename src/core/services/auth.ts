import { POST } from '../utils/http';
import { apiBaseUrlConfig } from '../utils/constants';

const login = async (body: object) => {
  const url = `${apiBaseUrlConfig}/login`;
  const res = await POST(url, body);
  return res;
};

const refreshToken = async (body: object) => {
  const url = `${apiBaseUrlConfig}/refresh-token`;
  const res = await POST(url, body);
  return res;
};

export const authService = {
  login,
  refreshToken,
};
