import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalDone({ open, onClose, onConfirm }: Props) {
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
          Cancelación de
        </p>
        <DialogTitle> Firma de Contrato</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>Se ha detenido la firma del contrato exitosamente</p>
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
