import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  negotiation: string;
  supplier: string;
};

export function ModalWelcome({ open, onClose, negotiation, supplier }: Props) {
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
          Proceso de
        </p>
        <DialogTitle>Config. de Formalización</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p className='text-center mb-3'>Vamos a iniciar el proceso de configuración de contrato de la siguiente contratación y proveedor</p>

            <div className={styles.row}>
              <div className={styles.left}>Negociación</div>
              <div className={styles.right}>{negotiation}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.left}>Proveedor</div>
              <div className={styles.right}>{supplier}</div>
            </div>
            <div className={styles.buttons}>
              <Button variant='contained' onClick={onClose}>
                COMENCEMOS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
