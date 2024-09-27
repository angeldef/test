export interface DataTableSuppliers {
  id?: number;
  rfc?: string;
  name?: string;
  type?: string;
  email?: string;
  supplierData?: any;
}

export interface SuppliersResponse {
  _id?: string;
  b2cId?: string;
  email?: string;
  privacyNotice?: Date;
  termsAndCondition?: Date;
  conflictOfInterest?: boolean;
  risksDetected?: boolean;
  register?: Register;
  infoSupplier?: InfoSupplier;
}

export interface InfoSupplier {
  personType?: string;
  nameNaturalPerson?: string;
  surnameNaturalPerson?: string;
  fullName?: string;
  savedRfc?: string;
  countryNaturalPerson?: string;
  countryLegalPerson?: string;
  countryRepresentative?: string;
  employee?: string;
  employeeRelative?: string;
  association?: string;
  secondNameNaturalPerson?: string;
  secondSurnameNaturalPerson?: string;
  rfcNaturalPerson?: string;
  curpNaturalPerson?: string;
  ocupationNaturalPerson?: number;
  currentStep?: number;
  preloadedDocs?: null;
  countryDescription?: string;
  countryDescriptionRepresentative?: string;
  ocupationDescription?: string;
  stepBarCurrent?: number;
  nameExemployee?: string;
  secondNameExemployee?: string;
  surnameExemployee?: string;
  secondSurnameExemployee?: string;
  positionExemployee?: string;
  relationshipExemployee?: string;
  departmentExemployee?: string;
  state?: State;
  wizardStep?: string;
  birthDateLegalPerson?: Date;
  nameLegalPerson?: string;
  tradeNameLegalPerson?: string;
  rfcLegalPerson?: string;
  ocupationLegalPerson?: number;
  nameRepresentative?: string;
  secondNameRepresentative?: string;
  surnameRepresentative?: string;
  secondSurnameRepresentative?: string;
  rfcRepresentative?: string;
  taxIdLegalPerson?: string;
  idNumberRepresentative?: string;
  idNumberNaturalPerson?: string;
  repse?: string;
  icsoe?: string;
  sisub?: string;
}

export interface State {
  currentStep?: number;
  stepBarCurrent?: number;
}

export interface Register {
  birthdate?: Date | null;
  country?: string;
  street?: string;
  internal_number?: string;
  external_number?: string;
  zip_code?: string;
  city?: string;
  municipality?: string;
  colony?: string;
  foreign_state?: string;
  foreign_city?: string;
  mexican_regulations?: boolean;
  addressString1?: string;
  addressString2?: string;
  countryDescription?: string;
  tradeName?: string;
  genre?: string;
  phone_natural_person?: string;
  rcPolicy?: boolean;
  nameBusinessContact?: string;
  phoneBusinessContact?: string;
  emailBusinessContact?: string;
  nameOperativeContact?: string;
  phoneOperativeContact?: string;
  emailOperativeContact?: string;
  nameFinancialContact?: string;
  phoneFinancialContact?: string;
  emailFinancialContact?: string;
  branches?: Branch[];
  finalized?: boolean;
  bankAccounts?: BankAccount[];
  birhdate?: Date;
  currency?: string;
  acceptTerms?: boolean;
  bank?: string;
  clabe?: string;
  phone_legal_person?: string;
  add_branch?: boolean;
  direct_employees?: string;
  employees_quantity?: string;
  annual_income?: string;
  clabe2?: string;
  countryBank?: string;
  accountNumber?: string;
  accountNumber2?: string;
  code?: string;
  swift?: string;
  swift2?: string;
  effectiveDateStart?: Date;
  effectiveDateEnd?: Date;
  aba?: string;
  aba2?: string;
  annual_income_label?: string;
  key?: string;
  active?: boolean | null;
  accountNumberConfirm?: string;
  swiftConfirm?: string;
  street_branch?: string;
  internal_number_branch?: string;
  external_number_branch?: string;
  zip_code_branch?: string;
  city_branch?: string;
  municipality_branch?: string;
  colony_branch?: string;
  phone_branch?: string;
}

export interface BankAccount {
  currency?: string;
  countryBank?: string;
  accountNumber?: string;
  accountNumberConfirm?: string;
  code?: string;
  swift?: string;
  swiftConfirm?: string;
  key?: string;
  analystApproval?: AnalystApproval;
  aba?: string;
  abaConfirm?: string;
  acceptTerms?: boolean;
  clabe?: string;
  clabeConfirm?: string;
  active?: boolean | null;
}

export interface AnalystApproval {
  approved?: boolean;
  reasonReturned?: string | null;
  createdAt?: Date;
  analystEmail?: string;
}

export interface Branch {
  street_branch?: string;
  internal_number_branch?: string;
  external_number_branch?: string;
  zip_code_branch?: string;
  foreign_state_branch?: string;
  foreign_city_branch?: string;
  phone_branch?: string;
  addressString1?: string;
  addressString2?: string;
  id?: number;
  city_branch?: string;
  municipality_branch?: string;
  colony_branch?: string;
}
