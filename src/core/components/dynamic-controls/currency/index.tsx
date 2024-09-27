import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { FormComponentType } from '../../../types/FormComponentType';
import { NumericFormat } from 'react-number-format';

type Props = {
  component: FormComponentType;
  control: Control;
  errors: { [x: string]: any };
  removePrefix?: boolean;
};

export const DynamicCurrency = ({ component, control, errors, removePrefix }: Props) => {
  const { properties } = component;
  const { pct } = properties ?? {};

  const pctValidation = (str: string) => {
    if (!str) return true;
    const val = parseFloat(str.replace('%', '').replaceAll(',', ''));
    return val >= 0 && val <= 100;
  };

  return (
    <>
      <label>
        {component.label} {component.validate?.required && <span>*</span>}
      </label>
      <div className='form-control'>
        <Controller
          name={component.key}
          control={control}
          rules={{
            required: component.validate?.required ? component.validate.customMessage : undefined,
            validate: {
              ...(pct && {
                pctValidation: (val) => pctValidation(val) || 'Debe ser un valor entre 0 y 100',
              }),
            },
          }}
          render={({ field: { ref, ...rest } }) => (
            <NumericFormat
              thousandSeparator=','
              decimalSeparator='.'
              prefix={!removePrefix ? (pct ? '' : '$ ') : undefined}
              suffix={!removePrefix ? (pct ? ' %' : '') : undefined}
              decimalScale={2}
              fixedDecimalScale={pct ? undefined : true}
              getInputRef={ref}
              placeholder={component.placeholder as string}
              customInput={TextField}
              {...rest}
            />
          )}
        />
      </div>
      {errors[component.key] && <small className='text-danger'>{errors[component.key]?.message as string}</small>}
    </>
  );
};
