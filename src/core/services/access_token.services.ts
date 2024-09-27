import { AsyncReturnType, GET } from '../utils/request';

type ObjectResponseServiceTokenMicrosoft = { data: string };
export const serviceGetTokenMicrosoft = async (): AsyncReturnType<ObjectResponseServiceTokenMicrosoft> => {
  const response = await GET<ObjectResponseServiceTokenMicrosoft>('', true);
  return response;
};
