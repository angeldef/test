import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ModalConfirm({ open, onClose }: Props) {
  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <div className='btn-closeModal'>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '-15px',
          }}
        >
          Excelente
        </p>
        <DialogTitle>Contrato Configurado</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>
              El contrato ha sido configurado, y el proveedor recibió la notificación para completar la información requerida. Una vez que el
              proveedor la complete continuará la revisión del contrato correspondiente.
            </p>

            <div className={styles.buttons}>
              <Button variant='contained' onClick={onClose}>
                ENTENDIDO
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
