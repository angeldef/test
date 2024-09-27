import { apiBaseUrlConfig } from '@/core/utils/constants';
import { GET, POST } from '@/core/utils/http';

const getProposals = async () => {
  const url = `${apiBaseUrlConfig}/legal-specialist`;
  const res = await GET(url);
  return res;
};

const getProposalById = async (negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${negotiationSupplierId}`;
  const res = await GET(url);
  return res;
};

const docApprovals = async (body: any, negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${negotiationSupplierId}/documents`;
  const res = await POST(url, body);
  return res;
};

const getFormIOFake = async () => {
  const url = 'https://sqtvwwqxevlbosz.form.io/abastecimiento-analista-dev';
  const res = await GET(url);
  return res;
};

const updateSupplier = async (body: any, supplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${supplierId}/supplier-data`;
  const res = await POST(url, body);
  return res;
};

const approveBankAccount = async (body: any, supplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${supplierId}/approve-bank-account`;
  const res = await POST(url, body);
  return res;
};

const saveContract = async (body: object, negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${negotiationSupplierId}/upload-contract`;
  const res = await POST(url, body);
  return res;
};

const approveContract = async (body: object, negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${negotiationSupplierId}/contract-approval`;
  const res = await POST(url, body);
  return res;
};

const markRrNine = async (proposalId: string, marked: boolean) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/mark-rr-nine`;
  const res = await POST(url, { marked });
  return res;
};

const rejectProposal = async (proposalId: string, skipValidation: boolean) => {
  const url = `${apiBaseUrlConfig}/legal-specialist/${proposalId}/cancel-proposal`;
  const res = await POST(url, { cancel: true, skipValidation });
  return res;
};

export const legalSpecialistService = {
  getProposals,
  getProposalById,
  docApprovals,
  getFormIOFake,
  updateSupplier,
  approveBankAccount,
  saveContract,
  approveContract,
  markRrNine,
  rejectProposal,
};
