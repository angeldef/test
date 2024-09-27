export type Profile = {
  nameNaturalPerson?: string;
  surnameNaturalPerson?: string;
  nameLegalPerson?: string;
  personType: string;
  ocupationDescription: string;
  country: string;
  countryDescription: string;
  rfcNaturalPerson?: string;
  rfcLegalPerson?: string;
  curpNaturalPerson?: string;
  idNumberNaturalPerson?: string | null;
  idNumberLegalPerson?: string | null;
  taxIdLegalPerson?: string | null;
  tradeName: string | null;
  birthDateLegalPerson: string | null;
  genre?: string;
  nameRepresentative?: string;
  secondNameRepresentative?: string;
  surnameRepresentative?: string;
  secondSurnameRepresentative?: string;
  rfcRepresentative?: string;
  countryDescriptionRepresentative?: string;
  personCode?: string;
  supplierCode?: string;
};

export type Header = {
  description: string;
  status: string;
  createdAt: string;
};

export type BankAccount = {
  currency?: string;
  clabe?: string;
  countryBank?: string;
  accountNumber?: string;
  swift?: string;
  aba?: string;
  approved?: boolean;
  analystApproval?: any;
  code?: string;
};
