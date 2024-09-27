import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalRR9({ open, onClose, onConfirm }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '-15px',
            color: '#707070',
          }}
        >
          Confirmación de
        </p>

        <DialogTitle style={{ lineHeight: '22px' }}>Firma de Contrato</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>¿Este contrato aplica RR9?</p>

            <div className={styles.buttons}>
              <Button variant='outlined' onClick={onClose}>
                NO
              </Button>
              <Button variant='contained' onClick={onConfirm}>
                SI
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
