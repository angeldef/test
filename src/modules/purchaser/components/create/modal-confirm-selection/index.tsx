import { Button, Dialog, DialogContent } from '@mui/material';
import styles from './styles.module.scss';
import { Wizard } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wizard: Wizard;
};

export function ModalConfirmSelection({ open, onClose, onConfirm, wizard }: Props) {
  const {
    selectSupplier: {
      supplierInfo: { infoSupplier },
    },
    selectNegotiation,
  } = wizard ?? {};
  const { rows, selectionModel } = selectNegotiation ?? {};
  const negotiation = rows?.find((e) => e.id === selectionModel[0]);

  return (
    <div className='modal'>
      <Dialog open={open} className='modal-small' onClose={onClose}>
        <DialogContent>
          <div className={styles.modalBody}>
            <div className={styles.title}>
              Confirmación de Selección <br />
              Proveedor y Negociación
            </div>

            <p>Por favor confirma la información para dar inicio al flujo de orden de compras</p>

            <div className={styles.supplier}>
              <div className={styles.name}>{infoSupplier?.fullName}</div>
              <p>Proveedor</p>
            </div>

            <div className={styles.negotiation}>
              <div className={styles.name}>{negotiation?.title}</div>
              <p>Negociación</p>
            </div>

            <div className={styles.negotiation}>
              <div className={styles.name}>{negotiation?.amount}</div>
              <p>Cuantía</p>
            </div>

            <div className={styles.buttons}>
              <div className={styles.cancel} onClick={onClose}>
                CANCELAR
              </div>
              <Button variant='outlined' onClick={onConfirm}>
                ACEPTAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
