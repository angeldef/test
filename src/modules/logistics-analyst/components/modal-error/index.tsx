import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalError({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <div className='btn-closeModal'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <DialogTitle>¡Ups!</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>Falla en derivación de Datos</p>
            <div className={styles.buttons}>
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
