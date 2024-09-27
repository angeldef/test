import { CustomTooltip } from '../..';
import { FormComponentType } from '../../../types/FormComponentType';
import { isValidRFC_fisica, isValidRFC_moral, stringToRegex, isValidPhone } from '../../../utils/functions';
import styles from './styles.module.scss';

type Props = {
  component: FormComponentType;
  setValue: Function;
  register: Function;
  errors: { [x: string]: any };
  disabled?: boolean;
  setRequired?: boolean;
};

export const DynamicTextField = ({ component, setValue, register, errors, disabled, setRequired }: Props) => {
  const { validate } = component;
  const { custom } = validate ?? {};
  const isPhone = custom === 'phone';

  return (
    <>
      <div className={styles.customLabel}>
        <label>
          {component.label} {(component.validate?.required || setRequired) && <span>*</span>}
        </label>

        {component.tooltip && <CustomTooltip content={component.tooltip} />}
      </div>

      <div className={`${styles.inputContainer} ${isPhone ? styles.isPhone : ''}`}>
        {isPhone && <span>+</span>}
        <input
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue(component.key, e.target.value.trimStart())}
          placeholder={component.placeholder as string}
          disabled={disabled}
          type='text'
          className='form-control'
          {...register(component.key, {
            required: component.validate?.required || setRequired ? component.errors?.required : undefined,
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
            ...(component.validate?.pattern && {
              pattern: {
                value: stringToRegex(component.validate.pattern),
                message: component.errors?.pattern as string,
              },
            }),
            ...(component.validate?.custom == 'rfcFisica' && {
              validate: (val: string) => (isValidRFC_fisica(val) ? undefined : component.errors?.rfc),
            }),
            ...(component.validate?.custom == 'rfcMoral' && {
              validate: (val: string) => (isValidRFC_moral(val) ? undefined : component.errors?.rfc),
            }),
            ...(component.validate?.custom == 'rfc' && {
              validate: (val: string) => (isValidRFC_fisica(val) || isValidRFC_moral(val) ? undefined : component.errors?.rfc),
            }),
            ...(component.validate?.custom == 'phone' && {
              validate: (val: string) => (isValidPhone(val) ? undefined : 'Teléfono no válido'),
            }),
          })}
        />
      </div>
      {errors[component.key] && <small className='text-danger'>{errors[component.key]?.message as string}</small>}
    </>
  );
};
