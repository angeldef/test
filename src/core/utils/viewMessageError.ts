import { codeErrorApi } from './enums';

export const ViewMessageError = (code: codeErrorApi | undefined) => {
  switch (code) {
    case codeErrorApi.INVALID_SP_TOKEN:
      return 'Usuario no autorizado.';
    case codeErrorApi.USER_NOT_A_NEGOTIATOR:
      return 'El usuario no tiene acceso a crear negociación.';
    default:
      return 'En estos momentos no podemos procesar la solicitud. Por favor intente más tarde.';
  }
};
