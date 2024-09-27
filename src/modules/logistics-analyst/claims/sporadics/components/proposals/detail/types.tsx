import { NegotiatorFormalization } from '@/modules/legal-specialist/components/tabs/contract';

export type DetailResponse = {
  supplier: Supplier;
  preregister: Preregister;
  documentation: Array<Documentation | null>;
  documents: Array<Documentation | null>;
  quotation: Array<Quotation | null>;
  negotiationSupplier: NegotiationSupplier;
  contestAnswers: ContestAnswer[];
  negotiatorFormalization: NegotiatorFormalization;
  register: any;
  formalization: any;
  proposalContract: any;
};

export type ContestAnswer = {
  question: string;
  answer: string;
  area: string;
  comment: string;
  value: string;
};

export type Documentation = {
  title: string;
  url: string;
  key: string;
  createdAt: string;
  status: string;
  reasonReturned: string;
  locked?: boolean;
  revisionHistory: any[];
  required?: boolean;
  approvedBy?: any;
  negotiatiorApproval?: any;
  analystApproval?: any;
  allowModify?: boolean;
};

export type Preregister = {
  conflictsQuestions: Question[];
  considerations: Question[];
};

export type Question = {
  title: string;
  key: string;
  value: string;
  person?: Person;
};

export type Supplier = {
  name: string;
  email: string;
  country: string;
  rfc: string;
  birthDateLegal?: string;
  nameRepresentative?: string;
  conflictOfInterest?: string;
  risksDetected?: string;
  countryDescription?: string;
  numId?: string;
  tradeName?: string;
  countryRepresentative?: string;
  countryDescriptionRepresentative?: string;
  rfcRepresentative?: string;
  numIdRepresentative?: string;
  personCode?: string;
  supplierCode?: string;
};

export type Person = {
  name: string;
  secondName: string;
  surname: string;
  secondSurname: string;
  position: string;
  relationship: string;
  department: string;
};

export type Quotation = {
  url: string;
  createdAt: string;
  currency: string;
  price: string;
  status: string;
  updatedAt: string;
  reasonRejection: string;
  approvalEmail: string;
};

export type NegotiationSupplier = {
  ethic: Ethic;
  risk: Risk;
  preregisterApproved?: boolean;
  conflictOfInterest?: boolean;
  quotation?: [{ currency: string }];
};

export type Ethic = {
  approvedByEthic: boolean;
  reasonRejection: string;
  updatedAt: string;
};

export type Risk = {
  approvedByRisk: boolean;
  reasonRejection: string;
  updatedAt: string;
};

export type Reason = {
  key: string;
  description: string;
};
