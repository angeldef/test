import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ModalSupplierSelected({ open, onClose }: Props) {
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
          Aprobación de
        </p>
        <DialogTitle>Selección de Proveedor</DialogTitle>
        <DialogContent>
          <div className={styles.modalBody}>
            <p>La siguiente selección ha sido confirmada</p>

            <div className={styles.row}>
              <div className={styles.left}>Negociación</div>
              <div className={styles.right}>Reposición de papelería y materiales de oficina de diversa índole</div>
            </div>
            <div className={styles.row}>
              <div className={styles.left}>Proveedor</div>
              <div className={styles.right}>Papeleria y Suministros ABC</div>
            </div>
            <div className={styles.buttons}>
              <Button variant='contained' onClick={onClose}>
                IR A FORMALIZACIÓN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
