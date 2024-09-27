import { Button, Dialog, DialogContent } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feedback: string;
};

export function ModalNotification({ open, onClose, onConfirm, feedback }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogContent>
          <div className={styles.modalBody}>
            <div className={styles.title}>Notificación</div>
            <div dangerouslySetInnerHTML={{ __html: feedback! }} />
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
