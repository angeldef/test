import { numericFormatter } from 'react-number-format';

export const currencyPipe = (val: string | number) => {
  if (!val && val != 0) return;
  const numStr = typeof val == 'string' ? val : val.toString();
  return numericFormatter(numStr, { thousandSeparator: ',', decimalSeparator: '.', decimalScale: 2, fixedDecimalScale: true });
};
