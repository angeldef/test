import { Checkbox } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { FormComponentType } from '../../../types/FormComponentType';

type Props = {
  component: FormComponentType;
  control: Control;
};

export const DynamicCheckbox = ({ component, control }: Props) => {
  return (
    <>
      {component.properties?.label && <label style={{ marginRight: '20px' }}>{component.properties?.label}</label>}
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Controller
          name={component.key}
          control={control}
          render={({ field: props }) => <Checkbox {...props} checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />}
        />
        <p style={{ marginRight: '20px' }}>
          {component.label} {component.validate?.required && <span>*</span>}
        </p>
      </div>
    </>
  );
};
