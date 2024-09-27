import { decryptTokenMicrosoft } from './encrypt-decrypt';
import { ValueLocalStorage } from './valueLocalStorage';
import { apiManagementUrl, xApiKey } from './constants';
import { serviceGetTokenMicrosoft } from '../services';
import { codeErrorApi } from './enums';
import { getLocal } from './functionsLocalStorage';

interface errorApi {
  errors: {
    code: codeErrorApi;
  }[];
}

export type AsyncReturnType<T = unknown> = Promise<{ data: T | null; error: errorApi | null }>;

async function GET<T = unknown>(url: string, useAccessToken?: boolean, key?: string, dontRepeatRequest?: boolean): AsyncReturnType<T> {
  try {
    const response = await fetch(apiManagementUrl + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(useAccessToken &&
          getLocal(ValueLocalStorage.ACCESSTOKEN) && {
            Authorization: `bearer ${getLocal(ValueLocalStorage.ACCESSTOKEN)}`,
          }),
        Accept: '*/*',
        'x-api-key': xApiKey,
      },
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    if (response.status === 401 && !dontRepeatRequest) {
    }
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error as errorApi };
  }
}

async function POST<T = unknown, P = object | string | number>(url: string, body: P, key?: string, dontRepeatRequest?: boolean): AsyncReturnType<T> {
  try {
    const response = await fetch(apiManagementUrl + url, {
      method: 'POST',
      headers: {
        ...(getLocal(ValueLocalStorage.ACCESSTOKEN) && {
          Authorization: `bearer ${getLocal(ValueLocalStorage.ACCESSTOKEN)}`,
        }),
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-api-key': xApiKey,
      },

      body: JSON.stringify(body),
    });
    const json: T = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    if (response.status === 401 && !dontRepeatRequest) {
      const response = await serviceGetTokenMicrosoft();
      if (response?.data) {
        decryptTokenMicrosoft(response.data.data);
        const request = await POST<T>(url, body as object | string | number, key, true);
        return request;
      } else return { data: null, error: response.error };
    }
    return { data: null, error: json as errorApi };
  } catch (error) {
    return { data: null, error: error as errorApi };
  }
}

async function PUT<T = unknown, P = object | string | number>(url: string, body: P, key?: string, dontRepeatRequest?: boolean): AsyncReturnType<T> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...(getLocal(ValueLocalStorage.ACCESSTOKEN) && {
          Authorization: `bearer ${getLocal(ValueLocalStorage.ACCESSTOKEN)}`,
        }),
        'x-api-key': xApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    if (response.status === 401 && !dontRepeatRequest) {
      const response = await serviceGetTokenMicrosoft();
      if (response?.data) {
        decryptTokenMicrosoft(response.data.data);
        const request = await PUT<T>(url, body as object | string | number, key, true);
        return request;
      } else return { data: null, error: response.error };
    }
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: body as errorApi };
  }
}

async function DELETE<T = unknown>(url: string, key?: string, dontRepeatRequest?: boolean): AsyncReturnType<T> {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(key && { 'x-api-key': key }),
        ...(getLocal(ValueLocalStorage.ACCESSTOKEN) && {
          Authorization: `bearer ${getLocal(ValueLocalStorage.ACCESSTOKEN)}`,
        }),
        'Content-type': 'application/json',
        'x-api-key': xApiKey,
      },
    });
    const json = await response.json();
    if (response.status <= 299) return { data: json, error: null };
    if (response.status === 401 && !dontRepeatRequest) {
      const response = await serviceGetTokenMicrosoft();
      if (response?.data) {
        decryptTokenMicrosoft(response.data.data);
        const request = await DELETE<T>(url, key, true);
        return request;
      } else return { data: null, error: response.error };
    }
    return { data: null, error: json };
  } catch (error) {
    return { data: null, error: error as errorApi };
  }
}

export { GET, POST, PUT, DELETE };
