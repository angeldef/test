import { HTMLAttributes } from 'react';
import { FormComponentTypeIdentifier } from './FormComponentTypeIdentifier';

export type FormComponentType = {
  type: FormComponentTypeIdentifier;
  key: string;
  id?: string;
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: string | boolean;
  disabled?: boolean;
  hidden?: boolean;
  validate?: FormComponentValidateType;
  errors?: FormComponentErrorType;
  properties?: FormComponentCustomPropertiesType;
  attributes?: HTMLAttributes<HTMLInputElement>;
  values?: FormRadio[];
  tooltip?: string;
  data?: DataFormIO;
};

type FormComponentValidateType = {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customMessage?: string;
  custom?: string;
};

type FormComponentErrorType = {
  pattern?: string;
  minLength?: string;
  maxLength?: string;
  required?: string;
  min?: string;
  max?: string;
  rfc?: string;
  notFuture?: string;
  notPast?: string;
  valid?: string;
  beforeThan?: string;
  justFuture?: string;
  beforeThanCustom?: string;
  afterThanCustom?: string;
};

type FormComponentCustomPropertiesType = {
  allowedCharacters?: string;
  label?: string;
  catalogo?: any;
  beforeThan?: string;
  pct?: boolean;
};

type FormRadio = {
  label: string;
  value: string;
};

type DataFormIO = {
  values: FormRadio[];
};
