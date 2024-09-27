import { GET, PATCH, POST } from '../utils/http';
import { apiBaseUrlConfig } from '../utils/constants';

const getProposals = async (negotationId: string) => {
  const url = `${apiBaseUrlConfig}/negotiations/${negotationId}/suppliers`;
  const res = await GET(url);
  return res;
};

const getProposal = async (proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId} `;
  const res = await GET(url);
  return res;
};

const getReasons = async () => {
  const url = `${apiBaseUrlConfig}/reasons-rejection-docs`;
  const res = await GET(url);
  return res;
};

const docApprovals = async (body: object, proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/doc-approvals`;
  const res = await POST(url, body);
  return res;
};

const deleteContract = async (body: object) => {
  const url = `${apiBaseUrlConfig}/contract/delete`;
  const res = await POST(url, body);
  return res;
};

const sendEmailApprovalRequest = async (body: object, proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/send-email-approval-request`;
  const res = await POST(url, body);
  return res;
};

const getNegociationInfoByToken = async (negotiationSupplierId: string, token: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${negotiationSupplierId}/check-supplier?token=${token}`;
  const res = await GET(url);
  return res;
};

const getPurchasePublic = async (purchaseId: string, token: string) => {
  const url = `${apiBaseUrlConfig}/purchases/${purchaseId}/public?token=${token}`;
  const res = await GET(url);
  return res;
};

const approveSupplier = async (body: object, negotiationSupplierId: string, token: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${negotiationSupplierId}/process-supplier-approval-request?token=${token}`;
  const res = await POST(url, body);
  return res;
};

const approveSupplierApprovals = async (body: object, negotiationSupplierId: string, token: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${negotiationSupplierId}/process-supplier-approval?token=${token}`;
  const res = await POST(url, body);
  return res;
};

const approvePurchase = async (body: object, purchaseId: string, token: string) => {
  const url = `${apiBaseUrlConfig}/purchases/${purchaseId}/approver-response?token=${token}`;
  const res = await POST(url, body);
  return res;
};

const quotationApproval = async (body: object, proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/process-quotation`;
  const res = await POST(url, body);
  return res;
};

const saveEvaluation = async (body: object, proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/save-negotiation-evaluation`;
  const res = await POST(url, body);
  return res;
};

const approvePreregister = async (body: object, proposalId: string) => {
  const url = `${apiBaseUrlConfig}/negotiation-supplier/${proposalId}/approve-preregister`;
  const res = await POST(url, body);
  return res;
};

const getApproveds = async (negotationId: string, flag?: boolean) => {
  let url = `${apiBaseUrlConfig}/negotiations/${negotationId}/approved-suppliers`;
  if (flag) url += '?inApprovalFlow=true';
  const res = await GET(url);
  return res;
};

const sendEmailApprovers = async (negotationId: string, body: object) => {
  const url = `${apiBaseUrlConfig}/negotiations/${negotationId}/send-email-to-approvers`;
  const res = await POST(url, body);
  return res;
};

const saveContract = async (body: object, negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/contract/${negotiationSupplierId}/negotiator`;
  const res = await POST(url, body);
  return res;
};

const sendSupplier = async (negotiationSupplierId: string) => {
  const url = `${apiBaseUrlConfig}/complete-registration`;
  const res = await POST(url, { negotiationSupplierId });
  return res;
};

export const proposalService = {
  getProposals,
  getProposal,
  getReasons,
  docApprovals,
  sendEmailApprovalRequest,
  getNegociationInfoByToken,
  approveSupplier,
  quotationApproval,
  saveEvaluation,
  approvePreregister,
  getApproveds,
  sendEmailApprovers,
  approveSupplierApprovals,
  deleteContract,
  saveContract,
  sendSupplier,
  getPurchasePublic,
  approvePurchase,
};
