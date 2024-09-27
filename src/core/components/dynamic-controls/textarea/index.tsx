import { TextField } from '@mui/material';
import { FormComponentType } from '../../../types/FormComponentType';

type Props = {
  component: FormComponentType;
  setValue: Function;
  register: Function;
  errors: { [x: string]: any };
  disabled?: boolean;
};

export const DynamicTextArea = ({ component, setValue, register, errors, disabled }: Props) => {
  return (
    <>
      <label>
        {component.label} {component.validate?.required && <span>*</span>}
      </label>
      <TextField
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue(component.key, e.target.value.trimStart())}
        placeholder={component.placeholder as string}
        disabled={disabled}
        multiline
        rows={4}
        {...register(component.key, {
          required: component.validate?.required ? component.errors?.required : undefined,
          minLength: component.validate?.minLength
            ? {
                value: component.validate?.minLength as number,
                message: component.errors?.minLength as string,
              }
            : undefined,
          maxLength: component.validate?.maxLength
            ? {
                value: component.validate?.maxLength as number,
                message: component.errors?.maxLength as string,
              }
            : undefined,
        })}
      />
      {errors[component.key] && (
        <small className='text-danger' style={{ bottom: '0' }}>
          {errors[component.key]?.message as string}
        </small>
      )}
    </>
  );
};
