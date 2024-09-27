import { Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';
import styles from './styles.module.scss';

type Props = {
  id?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setSuccessInvitation: Function;
};

export function ModalInvitation({ open, onClose, setSuccessInvitation, id }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    getValues,
  } = useForm({
    mode: 'all',
  });

  const onSubmit = (form: FieldValues) => {};

  const validateEmails = (val: string) => {
    if (!val) return;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emails = val.split(',');

    if (val == '') return;

    let invalid = false;
    emails.forEach((e, i) => {
      if (!e.match(emailRegex)) {
        invalid = true;
      }
    });

    if (invalid) return 'Deben ser correos separados por comas y sin espacios';
  };

  const sendInvitations = async () => {
    const { emails } = getValues();
    if (errors.emails || !emails) return;
    const arrayEmails = emails.split(',');

    setLoading(true);
    const { data } = await logisticsAnalystService.sendInvitation(
      {
        emails: arrayEmails,
      },
      id!
    );

    setLoading(false);
    if (data) {
      setSuccessInvitation(true);
      reset();
      onClose();
    }
  };

  return (
    <div className='modal'>
      <Dialog open={open} onClose={onClose} className='modal-small'>
        <div className='btn-closeModal'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        <DialogContent>
          <div className={styles.modalBody}>
            <h2 className={`${styles.modalTitle} joey`}>Invitar por correo electrónico</h2>
            <p className='mt-1'>
              Indique las direcciones de correo de los proveedores que desea <br /> invitar, separadas por coma.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className='form-group'>
                <TextField
                  placeholder='Separar correos por comas y sin espacios. Ejemplo: soynegociadormexico@segurosura.com.mx, mxproveedores@segurossura.com.mx'
                  multiline
                  rows={5}
                  {...register('emails', {
                    validate: validateEmails,
                  })}
                />
                {errors.emails && (
                  <small className='text-danger' style={{ bottom: 0 }}>
                    {errors.emails?.message as string}
                  </small>
                )}
              </div>

              <div className={styles.buttons}>
                <LoadingButton variant='outlined' loading={loading} onClick={sendInvitations}>
                  INVITAR PROVEEDORES
                </LoadingButton>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
