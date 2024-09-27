import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplier?: string;
};

export function ModalConfirmFinish({ open, onClose, onConfirm, supplier }: Props) {
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
            <p>
              Esta seguro que desea formalizar la firma de <br /> contrato con el proveedor:
            </p>
            <div className={styles.supplier}>{supplier}</div>

            <div className={styles.buttons}>
              <Button variant='outlined' onClick={onClose}>
                CANCELAR
              </Button>
              <Button variant='contained' onClick={onConfirm}>
                CONFIRMAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
