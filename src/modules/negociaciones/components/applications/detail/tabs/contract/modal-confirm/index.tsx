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

        <DialogTitle style={{ lineHeight: '22px' }}>Firma de Contrato</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>¿Está seguro que desea detener la firma del contrato?</p>

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
