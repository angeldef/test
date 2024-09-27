import { GET, POST } from '../utils/http';
import { apiBaseUrlConfig } from '../utils/constants';

const negotiatiorFormalization = async (body: any, proposalId: string) => {
  let data = new FormData();
  for (let key in body) data.append(key, body[key]);

  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/negotiatior-formalization`;
  const res = await POST(url, null, false, data);
  return res;
};

const getPeriodicity = async () => {
  const url = `${apiBaseUrlConfig}/periodicity`;
  const res = await GET(url);
  return res;
};

export const formalizationService = {
  negotiatiorFormalization,
  getPeriodicity,
};
