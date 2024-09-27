import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { format } from 'date-fns';
import { NegotiatorFormalization } from '..';
import { FileConfig, FileUploader } from '@/core/components/file-uploader';
import { useEffect, useState } from 'react';
import { currencyPipe } from '@/core/utils/pipes';
import styles from './styles.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
  negotiatorFormalization: NegotiatorFormalization;
  currency?: string;
};

const formatDate = (dateString: string) => format(new Date(dateString), 'dd/MM/yyyy');

export function ModalConfig({ open, onClose, negotiatorFormalization, currency }: Props) {
  const { service, contractDateStart, contractDateEnd, descService, annexDateStart, annexDateEnd, quantity, frequencyDescription } =
    negotiatorFormalization;

  const [doc, setDoc] = useState<FileConfig>();

  useEffect(() => {
    const { confidentialityAgreement } = negotiatorFormalization ?? {};
    if (confidentialityAgreement) {
      setDoc({
        key: 'contract',
        name: 'CONTRATO DE CONFIDENCIALIDAD',
        url: confidentialityAgreement,
        types: 'PDF',
      });
    }
  }, [negotiatorFormalization]);

  return (
    <div className='modal'>
      <Dialog open={open} onClose={onClose}>
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
            color: '#707070',
          }}
        >
          Detalle de
        </p>

        <DialogTitle>Configuración de Contrato</DialogTitle>

        <DialogContent>
          <div className={styles.modalBody}>
            <div className={styles.row}>
              <div className={styles.subtitle}>Objeto del Contrato</div>
              <p>{service}</p>
            </div>
            <div className={styles.row}>
              <div className={styles.subtitle}>Vigencia del Contrato</div>
              <p>
                {formatDate(contractDateStart)} - {formatDate(contractDateEnd)}
              </p>
            </div>
            <div className={styles.row}>
              <div className={styles.subtitle}>Descripción detallada de los servicios</div>
              <p>{descService}</p>
            </div>
            <div className={styles.row}>
              <div className={styles.subtitle}>Vigencia del Anexo</div>
              {formatDate(annexDateStart)} - {formatDate(annexDateEnd)}
            </div>
            {quantity && (
              <div className={styles.row}>
                <div className={styles.subtitle}>Cantidad - Periodicidad</div>
                {`$ ${currencyPipe(quantity)} ${currency}`} - {frequencyDescription}
              </div>
            )}

            <div className={styles.fileContainer}>
              {doc && <FileUploader fileConfig={doc} disableDelete saveFile={() => {}} deleteFile={() => {}} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
