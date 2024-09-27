import { FieldValues, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useEffect } from 'react';
import styles from './styles.module.scss';

type Props = {
  index: number;
  onSelectReason: Function;
  preload: string;
  disabled?: boolean;
};

export const RejectReason = ({ index, onSelectReason, preload, disabled }: Props) => {
  const { handleSubmit, watch, reset, register } = useForm({ mode: 'all' });
  const watchFields = watch();
  const onSubmit = (form: FieldValues) => {};

  useEffect(() => {
    const { reason } = watchFields;
    onSelectReason(reason, index);
  }, [watchFields]);

  useEffect(() => {
    reset({ reason: preload });
  }, [preload]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className='form-group' style={{ padding: 0, width: 250 }}>
        <label>
          MOTIVO DE RECHAZO <span>*</span>
        </label>

        <div
          className='form-control'
          style={{
            width: '100%',
            paddingRight: '15px',
          }}
        >
          <TextField
            placeholder='Motivo de Rechazo'
            disabled={disabled}
            {...register('reason', { required: 'Campo obligatorio' })}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </form>
  );
};
