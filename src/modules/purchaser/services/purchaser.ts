import { apiBaseUrlConfig, purchaseOrderSlug } from '@/core/utils/constants';
import { getQueryString } from '@/core/utils/functions';
import { GET, POST } from '@/core/utils/http';

const getPurchases = async () => {
  const url = `${apiBaseUrlConfig}/purchases`;
  const res = await GET(url);
  return res;
};

const formIoPurchaseOrder = async () => {
  const url = `${apiBaseUrlConfig}/formio/${purchaseOrderSlug}`;
  const res = await GET(url);
  return res;
};

const getFormIOFake = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-orden-compra-dev';
  const res = await GET(url);
  return res;
};

const getPurchaseOrders = async () => {
  const url = `${apiBaseUrlConfig}/purchases`;
  const res = await GET(url);
  return res;
};

const getPurchaseOrder = async (id: string) => {
  const url = `${apiBaseUrlConfig}/purchases/${id}`;
  const res = await GET(url);
  return res;
};

const getPurchaseSuppliers = async (queryParams: object) => {
  const queryString = getQueryString(queryParams);
  const url = `${apiBaseUrlConfig}/purchase-suppliers${queryString ?? ''}`;
  const res = await GET(url);
  return res;
};

const getNegotiations = async (supplierId: string) => {
  const url = `${apiBaseUrlConfig}/purchases/${supplierId}/negotiations`;
  const res = await GET(url);
  return res;
};

const savePurchase = async (body: object) => {
  const url = `${apiBaseUrlConfig}/purchases`;
  const res = await POST(url, body);
  return res;
};

export const purchaserService = {
  getPurchases,
  formIoPurchaseOrder,
  getPurchaseOrders,
  getPurchaseSuppliers,
  getNegotiations,
  getFormIOFake,
  savePurchase,
  getPurchaseOrder,
};
