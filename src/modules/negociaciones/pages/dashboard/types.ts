export interface NegociationsListResponse {
  _id: string;
  title: string;
  description?: string;
  grouper?: Amount;
  category?: Amount;
  amount?: Amount;
  status?: string;
  applicantArea?: string;
  caseProvider?: Amount;
  collaboratorsFacilities?: string;
  file?: null;
  frequency?: Amount;
  homeOverseas?: string;
  justification?: string;
  riskLevel?: Amount;
  signAgreement?: string;
  supplierCritic?: string;
  supplierSox?: string;
  user?: string;
  contest?: Contest;
  type?: string;
  updateAt?: string;
  createdAt?: string;
  proposalId?: string;
  negotiatorName?: string;
  negotiationArea?: string;
  area?: string;
}

export interface Amount {
  _id: string;
  key: string;
  description: string;
}

export interface Contest {
  deadlineDate: Date;
  criterias: Criteria[];
}

export interface Criteria {
  name: string;
  questions: string[];
}

export interface DataTable {
  id: number;
  title: string;
  grouper: string;
  category: string;
  type: string;
  amount: string;
  fecha: string;
  status: string;
  _id: string;
}
