import { MenuItem, Select } from '@mui/material';
import { FormComponentType } from '../../../types/FormComponentType';
import { Control, Controller } from 'react-hook-form';
import { useEffect } from 'react';

type Catalogos = {
  [key: string]: any;
};

type Props = {
  component: FormComponentType;
  control: Control;
  catalogos?: Catalogos;
  watchFields?: any;
  setValue: Function;
  errors: { [x: string]: any };
  disabled?: boolean;
};

export const DynamicSelect = ({ component, control, catalogos, errors, watchFields, setValue, disabled }: Props) => {
  const { data } = component ?? {};
  const { values } = data ?? {};
  const arrayFormIO = values?.filter((e: any) => e.value)?.map((e: any) => ({ key: e.value, description: e.label })) ?? [];
  const array = arrayFormIO.length > 0 ? arrayFormIO : catalogos?.[component?.properties?.catalogo];

  useEffect(() => {
    const value = watchFields?.[component.key];
    if (!array?.find((e: any) => e.key == value) && component.key && value) {
      setValue(component.key, '');
    }
  }, [watchFields]);

  return (
    <>
      <label>
        {component.label} {component.validate?.required && <span>*</span>}
      </label>
      <div className='form-control'>
        <Controller
          control={control}
          name={component.key}
          defaultValue=''
          rules={{ required: component.validate?.required ? component.validate.customMessage : undefined }}
          render={({ field }) => (
            <Select
              {...field}
              fullWidth
              displayEmpty
              disabled={disabled}
              renderValue={(value) =>
                value ? array?.find((e: any) => e.key == value)?.description : <span className='placeholder'>{component.placeholder as string}</span>
              }
            >
              {array?.map((item: any, i: number) => (
                <MenuItem value={item.key} key={item.key + i}>
                  {item.description}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </div>
      {errors[component.key] && <small className='text-danger'>{errors[component.key]?.message as string}</small>}
    </>
  );
};
