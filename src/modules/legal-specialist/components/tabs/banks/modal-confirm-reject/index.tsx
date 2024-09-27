import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalConfirmReject({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogTitle style={{ lineHeight: '22px' }}>
          Confirmación de Rechazo <br /> de Cuenta Bancaria
        </DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>
              ¿Está seguro que desea rechazar esta cuenta bancaria? Al hacerlo el proveedor recibirá la notificación y podrá actualizar al información
              correspondiente.
            </p>

            <div className={styles.buttons}>
              <Button variant='outlined' onClick={onClose}>
                CANCELAR
              </Button>
              <Button variant='contained' onClick={onConfirm}>
                ACEPTAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
