import { GET, POST } from '@/core/utils/http';
import { TableParams } from '@/core/components';
import { apiBaseUrlConfig } from '@/core/utils/constants';
import { getQueryString } from '@/core/utils/functions';

const getProposals = async (queryParams?: TableParams) => {
  const queryString = getQueryString(queryParams);
  const url = `${apiBaseUrlConfig}/analyst${queryString}`;
  const res = await GET(url);
  return res;
};

const getProposalsSporadics = async () => {
  const url = `${apiBaseUrlConfig}/sporadic-claims`;
  const res = await GET(url);
  return res;
};

const getProposalSporadics = async (id: string) => {
  const url = `${apiBaseUrlConfig}/sporadic-claims/${id}`;
  const res = await GET(url);
  return res;
};

const getAreas = async () => {
  const url = `${apiBaseUrlConfig}/claim-areas`;
  const res = await GET(url);
  return res;
};

const getGroupers = async () => {
  const url = `${apiBaseUrlConfig}/claim-category-groupers`;
  const res = await GET(url);
  return res;
};

const getProposalById = async (negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/analyst/${negotiationSupplierId}`;
  const res = await GET(url);
  return res;
};

const docApprovals = async (body: any, negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/analyst/${negotiationSupplierId}/documents`;
  const res = await POST(url, body);
  return res;
};

const getFormIOFake = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-analista-dev';
  const res = await GET(url);
  return res;
};

const updateSupplier = async (body: any, supplierId: string) => {
  const url = `${apiBaseUrlConfig}/analyst/${supplierId}/supplier-data`;
  const res = await POST(url, body);
  return res;
};

const approveBankAccount = async (body: any, supplierId: string) => {
  const url = `${apiBaseUrlConfig}/analyst/${supplierId}/approve-bank-account`;
  const res = await POST(url, body);
  return res;
};

const sendInvitation = async (body: object, id: string) => {
  const url = `${apiBaseUrlConfig}/sporadic-claims/${id}/send-invitations`;
  const res = await POST(url, body);
  return res;
};

export const logisticsAnalystService = {
  getProposals,
  getProposalById,
  docApprovals,
  getFormIOFake,
  updateSupplier,
  approveBankAccount,
  getProposalsSporadics,
  getProposalSporadics,
  getAreas,
  getGroupers,
  sendInvitation,
};
