import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onConfirm: () => void;
  feedback: string;
};

export function ModalError({ open, onConfirm, feedback }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small'>
        <DialogTitle>Ups!</DialogTitle>
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
