import {
  apiBaseUrlConfig,
  apiCatalogs,
  configNecesityFormIO,
  createNecesityFormIO,
  formalizationNegotiator,
  imgFormIO,
  updateSupplierFormIo,
} from '../utils/constants';
import { getQueryString } from '../utils/functions';
import { GET, POST, PUT } from '../utils/http';

const fakeFormCrearNecesidad = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-configuracion-necesidad-dev';
  const res = await GET(url);
  return res;
};

const getFormalizationFake = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-negociador-formalizacion-dev';
  const res = await GET(url);
  return res;
};

const formCrearNecesidad = async () => {
  const url = `${apiBaseUrlConfig}/formio/${createNecesityFormIO}`;
  const res = await GET(url);
  return res;
};

const formConfiguracionNecesidad = async () => {
  const url = `${apiBaseUrlConfig}/formio/${configNecesityFormIO}`;
  const res = await GET(url);
  return res;
};

const getImagesFormIO = async () => {
  const url = `${apiBaseUrlConfig}/formio/${imgFormIO}`;
  const res = await GET(url);
  return res;
};

const formRF = async () => {
  const url = `${apiBaseUrlConfig}/formio/${formalizationNegotiator}`;
  const res = await GET(url);
  return res;
};

const formIoRegister = async () => {
  const url = `${apiBaseUrlConfig}/formio/${updateSupplierFormIo}`;
  const res = await GET(url);
  return res;
};

const getAmounts = async () => {
  const url = `${apiBaseUrlConfig}/amounts`;
  const res = await GET(url);
  return res;
};

const getRisks = async () => {
  const url = `${apiBaseUrlConfig}/risks`;
  const res = await GET(url);
  return res;
};

const getSpecialCases = async () => {
  const url = `${apiBaseUrlConfig}/special-cases`;
  const res = await GET(url);
  return res;
};

const getCategories = async () => {
  const url = `${apiBaseUrlConfig}/categories`;
  const res = await GET(url);
  return res;
};

const getGroupers = async () => {
  const url = `${apiBaseUrlConfig}/category-group-config`;
  const res = await GET(url);
  return res;
};

const getNeeds = async () => {
  const url = `${apiBaseUrlConfig}/need-occurs`;
  const res = await GET(url);
  return res;
};

const createNegociation = async (body: object) => {
  const url = `${apiBaseUrlConfig}/negotiations`;
  const res = await POST(url, body);
  return res;
};

const updateNegociation = async (body: object, id: string) => {
  const url = `${apiBaseUrlConfig}/negotiations/${id}`;
  const res = await PUT(url, body);
  return res;
};

const patchNegociation = async (body: object, id: string) => {
  const url = `${apiBaseUrlConfig}/negotiations/${id}/contest`;
  const res = await POST(url, body);
  return res;
};

const getNegociations = async () => {
  const url = `${apiBaseUrlConfig}/negotiations`;
  const res = await GET(url);
  return res;
};

const getNegociation = async (id: string) => {
  const url = `${apiBaseUrlConfig}/negotiations/${id}`;
  const res = await GET(url);
  return res;
};

const sendInvitation = async (body: object, id: string) => {
  const url = `${apiBaseUrlConfig}/negotiations/${id}/send-invitations`;
  const res = await POST(url, body);
  return res;
};

const getSuppliers = async (queryParams?: object) => {
  const queryString = getQueryString(queryParams);
  const url = `${apiBaseUrlConfig}/suppliers${queryString}`;
  const res = await GET(url);
  return res;
};

const getStatusColors = async () => {
  const url = `${apiBaseUrlConfig}/status-colors`;
  const res = await GET(url);
  return res;
};

const getImages = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-img-dev';
  const res = await GET(url);
  return res;
};

const getCountries = async () => {
  const url = `${apiCatalogs}/api/generic?catalogo=PAISES`;
  const res = await GET(url, true);
  return res;
};

const getColonias = async (codigoPostal: string) => {
  const url = `${apiCatalogs}/zip-codes?codigoPostal=${codigoPostal}&catalogo=colonia`;
  const res = await GET(url, true);
  return res;
};

const getCiudades = async (codigoPostal: string) => {
  const url = `${apiCatalogs}/zip-codes?codigoPostal=${codigoPostal}&catalogo=ciudad`;
  const res = await GET(url, true);
  return res;
};

const getMunicipios = async (codigoPostal: string) => {
  const url = `${apiCatalogs}/zip-codes?codigoPostal=${codigoPostal}&catalogo=municipio`;
  const res = await GET(url, true);
  return res;
};

const getFile = async (fileUrl: string) => {
  const url = `${apiBaseUrlConfig}/files/get`;
  const res = await POST(url, { fileUrl });
  return res;
};

export const apiService = {
  fakeFormCrearNecesidad,
  formCrearNecesidad,
  getAmounts,
  getRisks,
  getSpecialCases,
  getCategories,
  getGroupers,
  getNeeds,
  createNegociation,
  updateNegociation,
  patchNegociation,
  getNegociations,
  getNegociation,
  sendInvitation,
  getSuppliers,
  getFormalizationFake,
  getStatusColors,
  formRF,
  getImages,
  getImagesFormIO,
  getCountries,
  getColonias,
  getCiudades,
  getMunicipios,
  formIoRegister,
  getFile,
  formConfiguracionNecesidad,
};
