import { xApiKey } from './constants';
import { getLocal } from './functionsLocalStorage';
import { ValueLocalStorage } from './valueLocalStorage';

export const GET = async (url: string, skipUserToken?: boolean) => {
  const user_token = sessionStorage.getItem('user-token');
  const ACCESSTOKEN = getLocal(ValueLocalStorage.ACCESSTOKEN);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey,
        ...(user_token && !skipUserToken && { 'user-token': user_token }),
        ...(ACCESSTOKEN && {
          Authorization: `bearer ${ACCESSTOKEN}`,
        }),
      },
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const POST = async (url: string, body: object | null, skipUserToken?: boolean, formData?: FormData) => {
  const user_token = sessionStorage.getItem('user-token');
  const ACCESSTOKEN = getLocal(ValueLocalStorage.ACCESSTOKEN);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': xApiKey,
        ...(!formData && { 'Content-Type': 'application/json' }),
        ...(user_token && !skipUserToken && { 'user-token': user_token }),
        ...(ACCESSTOKEN && {
          Authorization: `bearer ${ACCESSTOKEN}`,
        }),
      },
      body: formData ? formData : JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const PUT = async (url: string, body: object, skipUserToken?: boolean) => {
  const user_token = sessionStorage.getItem('user-token');
  const ACCESSTOKEN = getLocal(ValueLocalStorage.ACCESSTOKEN);
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey,
        ...(user_token && !skipUserToken && { 'user-token': user_token }),
        ...(ACCESSTOKEN && {
          Authorization: `bearer ${ACCESSTOKEN}`,
        }),
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
};

export const PATCH = async (url: string, body: object, skipUserToken?: boolean) => {
  const user_token = sessionStorage.getItem('user-token');
  const ACCESSTOKEN = getLocal(ValueLocalStorage.ACCESSTOKEN);
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey,
        ...(user_token && !skipUserToken && { 'user-token': user_token }),
        ...(ACCESSTOKEN && {
          Authorization: `bearer ${ACCESSTOKEN}`,
        }),
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error };
  }
};
