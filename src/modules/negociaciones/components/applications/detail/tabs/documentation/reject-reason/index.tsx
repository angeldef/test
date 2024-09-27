import { Controller, FieldValues, useForm } from 'react-hook-form';
import { MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';
import { Reason } from '../../../types';
import styles from './styles.module.scss';

type Props = {
  index: number;
  onSelectReason: Function;
  reasons: Reason[];
  preload: string;
  disabled?: boolean;
};

export const RejectReason = ({ index, onSelectReason, reasons, preload, disabled }: Props) => {
  const { handleSubmit, control, watch, reset } = useForm({ mode: 'all' });
  const watchFields = watch();
  const onSubmit = (form: FieldValues) => {};

  useEffect(() => {
    const { reason: key } = watchFields;
    const reason = reasons.find((e: any) => e.key == key)?.description;
    if (reason && !preload) onSelectReason(reason, index);
  }, [watchFields]);

  useEffect(() => {
    const { key } = reasons.find((e) => e.description == preload) ?? {};
    reset({ reason: key });
  }, [preload]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className='form-group' style={{ padding: 0, width: 250 }}>
        <label>
          MOTIVO DE RECHAZO <span>*</span>
        </label>

        <div className='form-control'>
          <Controller
            control={control}
            name='reason'
            defaultValue=''
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                className='text-left'
                displayEmpty
                disabled={disabled}
                renderValue={(value) =>
                  value ? reasons.find((e: any) => e.key == value)?.description : <span className='placeholder'>Elige motivo</span>
                }
              >
                {reasons.map((item: any, i: number) => (
                  <MenuItem value={item.key} key={item.key + i}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
    </form>
  );
};
