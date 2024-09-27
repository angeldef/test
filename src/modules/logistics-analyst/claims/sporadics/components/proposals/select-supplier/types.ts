export type Approved = {
  supplier: Supplier;
  contestEvaluation: ContestEvaluation;
  quotationPrice: string;
  caseProvider: boolean;
  negotiationSupplierId: string;
  approvedByNegotiator?: boolean;
  reasonRejection?: string;
  rejectedByNegotiator?: boolean;
  proposalStatus?: string;
};

export type Supplier = {
  _id: string;
  b2cId: string;
  email: string;
  privacyNotice: string;
  termsAndCondition: string;
  infoSupplier: InfoSupplier;
  conflictOfInterest: boolean;
};

export type InfoSupplier = {
  countryNaturalPerson: string;
  countryLegalPerson: string;
  countryRepresentative: string;
  employee: string;
  employeeRelative: string;
  association: string;
  personType: string;
  nameNaturalPerson: string;
  nameLegalPerson: string;
  secondNameNaturalPerson: string;
  surnameNaturalPerson: string;
  tradeNameLegalPerson: string;
  secondSurnameNaturalPerson: string;
  rfcNaturalPerson: string;
  curpNaturalPerson: string;
  ocupationNaturalPerson: number;
  idNumberNaturalPerson: string;
  currentStep: number;
  preloadedDocs: null;
  countryDescription: string;
  countryDescriptionRepresentative: string;
  ocupationDescription: string;
  wizardStep: string;
};

export type ContestEvaluation = {
  ASG: number;
  ECONOMY: number;
  SERVICES: number;
  TOTAL: number;
};
