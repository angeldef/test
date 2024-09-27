import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  feedback: string;
};

export function ModalInfo({ open, onClose, onConfirm, title, feedback }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <div className='btn-closeModal'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>{feedback}</p>
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
