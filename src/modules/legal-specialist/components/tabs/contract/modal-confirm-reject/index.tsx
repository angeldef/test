import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  oneSupplier: boolean;
};

export function ModalConfirmReject({ open, onClose, onConfirm, oneSupplier }: Props) {
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

        <DialogTitle style={{ lineHeight: '22px' }}>Rechazo de contratación</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            {oneSupplier ? (
              <p>
                La contratación tiene un solo proveedor, si lo rechaza, no será posible continuar con el proceso de la negociación actual. ¿Está
                seguro que desea rechazar la contratación?
              </p>
            ) : (
              <p>¿Está seguro que desea rechazar esta contratación?</p>
            )}

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
