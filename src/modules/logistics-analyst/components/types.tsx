export type DetailResponse = {
  supplier: Supplier;
  preregister: Preregister;
  documentation: Array<Documentation | null>;
  documents: Array<Documentation | null>;
  quotation: Array<Quotation | null>;
  negotiationSupplier: NegotiationSupplier;
  contestAnswers: ContestAnswer[];
  negotiatorFormalization: object;
  register: object;
  contract: boolean;
  registerFinalized: boolean;
  proposalContract: { readyToHigh: boolean };
  readyToHigh: boolean;
  sentToAlea: boolean;
  allowModifySupplierData: boolean;
  highError?: boolean;
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
  _id: string;
  b2cId: string;
  email: string;
  privacyNotice: Date;
  termsAndCondition: Date;
  infoSupplier: InfoSupplier;
  conflictOfInterest: boolean;
  risksDetected: boolean;
  register: any;
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

export interface InfoSupplier {
  countryNaturalPerson: string;
  countryLegalPerson: string;
  countryRepresentative: string;
  employee: string;
  employeeRelative: string;
  association: string;
  personType: string;
  nameNaturalPerson: string;
  secondNameNaturalPerson: string;
  surnameNaturalPerson: string;
  secondSurnameNaturalPerson: string;
  rfcNaturalPerson: string;
  curpNaturalPerson: string;
  ocupationNaturalPerson: number;
  currentStep: number;
  preloadedDocs: null;
  countryDescription: string;
  countryDescriptionRepresentative: string;
  ocupationDescription: string;
  stepBarCurrent: number;
}
