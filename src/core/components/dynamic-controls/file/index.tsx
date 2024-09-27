import { FormComponentType } from '../../../types/FormComponentType';
import { Control, Controller } from 'react-hook-form';
import { MuiFileInput } from 'mui-file-input';
import { CustomTooltip } from '../..';
import styles from './styles.module.scss';

type Props = {
  component: FormComponentType;
  control: Control;
  formats?: string;
};

export const DynamicFile = ({ component, control, formats }: Props) => {
  const accept = formats ? formats : {};

  return (
    <>
      <div className={styles.customLabel}>
        <label>
          {component.label} {component.validate?.required && <span className='required'>*</span>}
        </label>
        {component.tooltip && <CustomTooltip content={component.tooltip} />}
      </div>
      <Controller
        name={component.key}
        defaultValue=''
        rules={{ required: component.validate?.required ? component.validate.customMessage : undefined }}
        control={control}
        render={({ field, fieldState }) => (
          <MuiFileInput {...field} helperText={fieldState.error?.message} placeholder={component.description as string} inputProps={{ accept }} />
        )}
      />
    </>
  );
};
