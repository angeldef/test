import { Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import styles from './styles.module.scss';
import { Close } from '@mui/icons-material';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  rejectContract: Function;
};

export function ModalRejection({ open, onClose, rejectContract }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all',
  });

  const onSubmit = async (form: FieldValues) => {
    const { reason } = form;
    rejectContract(reason);
  };

  return (
    <div className='modal'>
      <Dialog open={open} onClose={onClose} className='modal-small'>
        <div className='btn-closeModal'>
          <IconButton
            onClick={() => {
              onClose();
            }}
          >
            <Close />
          </IconButton>
        </div>

        <DialogContent>
          <div className={styles.modalBody}>
            <h2 className={`${styles.modalTitle} joey`}>Rechazo de Contrato</h2>
            <p className='mt-1'>Indique el motivo de rechazo</p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className='form-group'>
                <TextField placeholder='Motivo de rechazo' multiline rows={5} {...register('reason', { required: 'Campo obligatorio' })} />
                {errors.reason && (
                  <small className='text-danger' style={{ bottom: 0 }}>
                    {errors.reason?.message as string}
                  </small>
                )}
              </div>

              <div className={`${styles.buttons} ${styles.centered}`}>
                <LoadingButton type='submit' variant='outlined' loading={loading}>
                  ENVIAR
                </LoadingButton>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
