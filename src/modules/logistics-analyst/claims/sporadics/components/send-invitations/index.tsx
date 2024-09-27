import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { urlEmailInvitationSporadics } from '@/core/utils/constants';
import { CustomSnackbar } from '@/core/components';
import { Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';
import styles from './styles.module.scss';

type Props = {
  id?: string;
};

export const SendInvitations = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [successInvitation, setSuccessInvitation] = useState(false);
  const [inviting, setInviting] = useState(false);

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const {
    formState: { errors },
    register,
    setValue,
    getValues,
  } = useForm({
    mode: 'all',
  });

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
    setInviting(true);

    const { data, error } = await logisticsAnalystService.sendInvitation(
      {
        emails: arrayEmails,
      },
      id!
    );
    setInviting(false);
    setOpenModal(false);

    if (!error) setSuccessInvitation(true);
  };

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.centered}>
          <h2>
            Enviar Invitaciones <br /> a proveedores
          </h2>

          <div className={styles.buttons}>
            <div
              className={styles.btn}
              onClick={() => {
                setOpen(true);
                copyToClipboard(`${urlEmailInvitationSporadics}/${id}`);
              }}
            >
              <span>Enlace Público</span>
              <i className='fas fa-link'></i>
            </div>
            <div
              className={styles.btn}
              onClick={() => {
                setValue('emails', null);
                setOpenModal(true);
              }}
            >
              <span>Invitar por correo</span>
              <i className='far fa-envelope'></i>
            </div>
          </div>
        </div>
      </div>

      <div className='modal'>
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenModal(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            <div className={styles.modalBody}>
              <h2 className={`${styles.modalTitle} joey`}>Invitar por correo electrónico</h2>
              <p className='mt-1'>
                Indique las direcciones de correo de los proveedores que desea <br /> invitar, separadas por coma.
              </p>

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

              <div className={styles.btnModal}>
                <LoadingButton
                  variant='outlined'
                  loading={inviting}
                  onClick={() => {
                    sendInvitations();
                  }}
                >
                  INVITAR PROVEEDORES
                </LoadingButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CustomSnackbar open={open} setOpen={setOpen} duration={4000}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>EL ENLACE HA SIDO COPIADO</div>
            <p>Utiliza el enlace copiado para invitar a los proveedores que desees</p>
          </div>
        </div>
      </CustomSnackbar>

      <CustomSnackbar open={successInvitation} setOpen={setSuccessInvitation} duration={4000}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>CORREOS ENVIADOS</div>
            <p>Los correos han sido enviados satisfactoriamente</p>
          </div>
        </div>
      </CustomSnackbar>
    </>
  );
};
