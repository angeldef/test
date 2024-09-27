import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalConfirmSaveSupplier({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>¿Desea dar de alta al proveedor?</p>
            <div className={styles.buttons}>
              <Button variant='outlined' onClick={onClose}>
                CANCELAR
              </Button>

              <Button variant='contained' onClick={onConfirm}>
                CONFIRMAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
