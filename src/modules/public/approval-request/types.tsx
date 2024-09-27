export type RespGetNegociationInfoByTokenType = {
  negotiation: Negotiation;
  supplier: Supplier;
  _id: string;
  negotiationId: string;
  supplierId: string;
  considerations: Considerations;
  quotation: Quotation[];
  negotiator: Negotiator;
  conflicts: Conflicts[];
  ethic: Ethic;
  risk: Risk;
  userAlreadyApproved?: boolean;
  purchaseOrder?: PurchaseOrder;
  generatedBy?: Buyer;
};

export type Considerations = {
  repse: string;
  icsoe: string;
  sisub: string;
  infonavit: string;
  imss: string;
  state: State;
  documents: Document[];
};

export type Document = {
  key: string;
  type: Type;
  file: File;
  url: string;
  status: DocumentStatus;
  createdAt: Date;
  reasonReturned: ReasonReturned;
  revisionHistory: RevisionHistory[];
};

export type File = {};

export enum ReasonReturned {
  DocumentoNoCorresponde = 'Documento no corresponde',
  DocumentoVencido = 'Documento vencido',
  Empty = '',
}

export type RevisionHistory = {
  createdAt: Date;
  status: RevisionHistoryStatus;
  reasonReturned: string;
  type: Type;
  url: string;
};

export enum RevisionHistoryStatus {
  Recibido = 'RECIBIDO',
}

export enum Type {
  Jpg = 'jpg',
  PDF = 'pdf',
}

export enum DocumentStatus {
  Aprobado = 'APROBADO',
  Rechazado = 'RECHAZADO',
}

export type State = {
  currentStep: number;
  wizardStep: string;
};

export type Negotiation = {
  _id: string;
  title: string;
  grouper: Grouper;
  category: Category;
  amount: Amount;
  description: string;
  state: null;
  createdBy: string;
  area: string;
  negotiatorType: string;
  status: string;
  createdAt: string;
  updateAt: Date;
  type: string;
  applicantArea: string;
  caseProvider: CaseProvider;
  collaboratorsFacilities: string;
  file: null;
  homeOverseas: string;
  isContest: boolean;
  justification: string;
  riskLevel: CaseProvider;
  signAgreement: string;
  supplierCritic: string;
  supplierSox: string;
  user: string;
  creationDate?: string;
};

export type Amount = {
  _id: string;
  key: string;
  description: string;
  min: number;
  max: null;
};

export type CaseProvider = {
  _id: string;
  key: string;
  description: string;
};

export type Category = {
  key: string;
  description: string;
  ocupations: Ocupation[];
};

export type Ocupation = {
  key: number;
  description: string;
};

export type Grouper = {
  _id: string;
  key: string;
  description: string;
  negotiatorType: string;
  area: string;
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
};

export type InfoSupplier = {
  employee: string;
  employeeRelative: string;
  association: string;
  personType: string;
  currentStep: number;
  preloadedDocs: null;
  countryNaturalPerson: string;
  countryLegalPerson: string;
  nameNaturalPerson: string;
  secondNameNaturalPerson: string;
  surnameNaturalPerson: string;
  secondSurnameNaturalPerson: string;
  rfcNaturalPerson: string;
  curpNaturalPerson: string;
  ocupationNaturalPerson: number;
  idNumberNaturalPerson: string;
  taxIdLegalPerson: string;
  repse: string;
  countryDescription: string;
  nameEmployee: string;
  secondNameEmployee: string;
  surnameEmployee: string;
  secondSurnameEmployee: string;
  positionEmployee: string;
  relationshipEmployee: string;
  departmentEmployee: string;
  state: State;
  icsoe: string;
  sisub: string;
  nameLegalPerson: string;
  tradeNameLegalPerson: string;
  rfcLegalPerson: string;
  ocupationLegalPerson: string;
  nameRepresentative: string;
  secondNameRepresentative: string;
  surnameRepresentative: string;
  secondSurnameRepresentative: string;
  countryRepresentative: string;
  infonavit: string;
  imss: string;
  documents: Document[];
};

export type Quotation = {
  url: string;
  createdAt: string;
  currency: string;
  price: string;
  status: string;
};

export type Negotiator = {
  name: string;
  email: string;
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

export type Conflicts = {
  title: string;
  key: string;
  value: string;
  person: Person;
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

export interface PurchaseOrder {
  totalToPay?: string;
  folio?: string;
  supplierName?: string;
  supplierDNI?: string;
  creationDate?: string;
  url?: string;
  supplierCountry?: string;
  supplierType?: string;
  supplierDni?: string;
}

export interface Buyer {
  name?: string;
  email?: string;
  role?: string;
}
