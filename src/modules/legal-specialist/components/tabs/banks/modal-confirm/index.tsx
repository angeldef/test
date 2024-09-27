import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalConfirm({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogTitle style={{ lineHeight: '22px' }}>
          Confirmación de Aprobación <br /> de Cuenta Bancaria
        </DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>
              ¿Está seguro que desea aprobar esta cuenta bancaria? Está cuenta se marcará como cuenta principal para realizar los pagos a este
              proveedor.
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
