import { Button, Dialog, DialogContent } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalConfirmCancel({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogContent>
          <div className={styles.modalBody}>
            <div className={styles.title}>Confirmación Requerida</div>

            <p>¿Está seguro de que desea cancelar la generación de la orden de compra?</p>

            <div className={styles.buttons}>
              <div className={styles.cancel} onClick={onClose}>
                CANCELAR
              </div>
              <Button variant='outlined' onClick={onConfirm}>
                ACEPTAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
