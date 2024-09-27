import { AES, enc } from 'crypto-js';
import { ValueLocalStorage } from './valueLocalStorage';
import { setLocal } from './functionsLocalStorage';

const decryptCrypto = (text: string, key: string): string => {
  return AES.decrypt(text, key).toString(enc.Utf8);
};

export const decryptTokenMicrosoft = (text: string): void => {
  const token_microsoft = decryptCrypto(text, import.meta.env.VITE_DECRYPT_SECRET_SERVICE_GET_TOKEN_MICROSOFT);
  setLocal(ValueLocalStorage.ACCESSTOKEN, token_microsoft);
};
