export interface RF1 {
  country: string;
  street: string;
  internal_number: string;
  external_number: string;
  zip_code: string;
  city: string;
  municipality: string;
  colony: string;
  tradeName: string;
  genre: string;
  birhdate: string;
  phone_natural_person: string;
  rcPolicy: boolean;
  effectiveDateStart: string;
  effectiveDateEnd: string;
  direct_employees: string;
  employees_quantity: string;
  annual_income: string;
  annual_income_label: string;
  finalized: boolean;
  addressString1: string;
  addressString2: string;
  phone_legal_person: string;
  add_branch: boolean;
  branches: any;
}

export interface Formalization {
  country: string;
  nameRepresentative: string;
  secondNameRepresentative: string;
  surnameRepresentative: string;
  secondSurnameRepresentative: string;
  countryRepresentative: string;
  countryRepresentativeDescription: string;
  rfcRepresentative: string;
  phoneRepresentative: string;
  emailRepresentative: string;
  charterDeedNumber: string;
  charterDeedDate: string;
  charterNotaryNumber: string;
  charterNotaryCity: string;
  representativeDeedNumber: string;
  representativeDeedDate: string;
  representativeNotaryNumber: string;
  representativeNotaryCity: string;
  nacionality: string;
  nacionalityDescription: string;
  finalized: boolean;
}
