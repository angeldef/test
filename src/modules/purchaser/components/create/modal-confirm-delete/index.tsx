import { Button, Dialog, DialogContent } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  suppyName: string;
};

export function ModalConfirmDelete({ open, onClose, onConfirm, suppyName }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogContent>
          <div className={styles.modalBody}>
            <div className={styles.title}>Confirmación Requerida</div>

            <p>Por favor confirma que deseas eliminar el insumo</p>

            <div className={styles.supply}>
              <div className={styles.name}>{suppyName}</div>
            </div>

            <p>Al hacerlo se elimina de la orden de compra</p>

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
