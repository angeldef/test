import { FormComponentType } from '../../../types/FormComponentType';
import { CustomTooltip } from '../..';
import styles from './styles.module.scss';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type Props = {
  component: FormComponentType;
  control: Control;
  defaultValue?: string;
  errors: { [x: string]: any };
  disabled?: boolean;
};

export const DynamicRadio = ({ component, control, errors, defaultValue, disabled }: Props) => {
  return (
    <>
      <div className={styles.customLabel}>
        <label>
          {component.label} {component.validate?.required && <span>*</span>}
        </label>
        {component.tooltip && <CustomTooltip content={component.tooltip} />}
      </div>
      <div className='form-control' style={{ flex: '0 0 auto' }}>
        <FormControl>
          <Controller
            rules={{ required: component.validate?.required ? component.validate.customMessage : undefined }}
            control={control}
            name={component.key}
            defaultValue={defaultValue ? defaultValue : ''}
            render={({ field }) => (
              <RadioGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} {...field}>
                {component.values?.map((e, i) => (
                  <FormControlLabel value={e.value} control={<Radio disabled={disabled} />} label={e.label} key={i} />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </div>
      {errors[component.key] && <small className='text-danger'>{errors[component.key]?.message as string}</small>}
    </>
  );
};
