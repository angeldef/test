import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CustomTooltip } from '..';
import styles from './styles.module.scss';
import { useFileDownloader } from '@/core/hooks';

export enum StatusFileUploader {
  FILE_UPLOADED = 'FILE_UPLOADED',
  EMPTY = 'EMPTY',
  UPLOADING = 'UPLOADING',
  REJECTED = 'REJECTED',
}

export type FileRequest = {
  key: string;
  type: string;
  base64: string;
  file?: File;
  fileName?: string;
};

export type FileConfig = {
  key: string;
  name: string;
  status?: StatusFileUploader;
  file?: File;
  url?: string;
  base64?: string;
  type?: string;
  types?: string;
  maxSize?: string;
  rejected?: { reason: string; feedback: string };
  uploadFeedback?: string;
  tooltip?: string;
};

type Preloaded = {
  url: string;
  filename: string;
};

type Props = {
  fileConfig: FileConfig;
  saveFile: (fileRequest: FileRequest) => void;
  deleteFile: (key: string) => void;
  disableDelete?: boolean;
  customDownload?: Function;
  contract?: boolean;
};

export const FileUploader = ({ fileConfig, saveFile, deleteFile, disableDelete, contract, customDownload }: Props) => {
  const ref = useRef<any>();
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [preloaded, setPreloaded] = useState<Preloaded>();
  const [status, setStatus] = useState<StatusFileUploader>(StatusFileUploader.EMPTY);
  const { rejected, uploadFeedback } = fileConfig;
  const { downloadFileGlobal } = useFileDownloader();

  useEffect(() => {
    const { file, status, url } = fileConfig;
    setFile(file);
    setStatus(status ?? StatusFileUploader.EMPTY);
    if (url) {
      const filename = url.substring(url.lastIndexOf('/') + 1);
      setPreloaded({ url, filename });
      setStatus(status === StatusFileUploader.REJECTED ? StatusFileUploader.REJECTED : StatusFileUploader.FILE_UPLOADED);
    }
  }, [fileConfig]);

  const fileChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    const file = files ? files[0] : undefined;
    ref.current.value = null;

    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInKB = fileSizeInBytes / 1024; // Convert to KB
      const fileSizeInMB = fileSizeInKB / 1024; // Convert to MB
      const fileName = file.name;
      const type = fileName.split('.').pop()!;
      const { types } = fileConfig;
      const array = types ? types?.split('/') : ['PDF', 'JPG'];

      if (!array.includes(type.toUpperCase())) {
        setError('El formato del archivo es inválido');
        setOpen(true);
        return;
      }

      if (fileSizeInMB > 5) {
        setError('El tamaño del archivo debe ser menor a 5 MB');
        setOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function (event) {
        const base64 = event?.target?.result?.toString().split(',')[1]!;
        const { key } = fileConfig;

        saveFile({
          key,
          type,
          base64,
          file,
          fileName,
        });
      };
    }
  };

  const downloadFile = () => {
    if (file) {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(file);
      downloadLink.download = file.name;
      downloadLink.click();
    } else downloadFileGlobal(preloaded?.url);
  };

  const onDeleteFile = () => {
    const { key } = fileConfig;
    deleteFile(key);
  };

  return (
    <>
      <div className={styles.row}>
        {(status == StatusFileUploader.EMPTY || status === StatusFileUploader.UPLOADING) && (
          <>
            <div className={styles.icon}>
              {status == StatusFileUploader.EMPTY && <i className='far fa-circle'></i>}
              {status === StatusFileUploader.UPLOADING && <i className='fas fa-spinner fa-spin'></i>}
            </div>
            <div className={styles.info}>
              <div className={`${styles.name} ${contract ? styles.contract : ''}`}>
                <p title={fileConfig.name}>{fileConfig.name}</p>
                {fileConfig.tooltip && <CustomTooltip content={fileConfig.tooltip} />}
              </div>
              <div className={styles.description}>{`${fileConfig.types ?? 'JPG/PDF'} MÁX. ${fileConfig.maxSize ?? '5MB'}`}</div>
            </div>
            <div className={styles.upload}>
              <div className={`${styles.left} ${contract ? styles.contract : ''}`}>
                <div className={styles.top}>Haz click</div>
                <p>PARA AGREGAR UN ARCHIVO</p>
              </div>
              <div
                className={styles.right}
                onClick={() => {
                  ref.current.click();
                }}
              >
                <i className='fas fa-cloud-upload-alt'></i>
              </div>
            </div>
          </>
        )}

        {status == StatusFileUploader.FILE_UPLOADED && (
          <>
            <div className={styles.icon}>
              <i className='far fa-check-circle'></i>
            </div>
            <div className={styles.info}>
              <div className={`${styles.name} ${contract ? styles.contract : ''}`}>
                <p title={fileConfig.name}>{fileConfig.name}</p>
                {fileConfig.tooltip && <CustomTooltip content={fileConfig.tooltip} />}
              </div>
              <div className={styles.description}>{`${fileConfig.types ?? 'JPG/PDF'} MÁX. ${fileConfig.maxSize ?? '5MB'}`}</div>
            </div>
            <div className={styles.upload}>
              <div className={`${styles.left} ${contract ? styles.contract : ''}`}>
                <div className={styles.top} title={file?.name ?? preloaded?.filename}>
                  {file?.name ?? preloaded?.filename}
                </div>
                {uploadFeedback ? <p>{uploadFeedback}</p> : <p>EN REVISIÓN</p>}
              </div>
              <div
                className={styles.right}
                onClick={() => {
                  customDownload ? customDownload() : downloadFile();
                }}
              >
                <i className='fas fa-cloud-download-alt'></i>
              </div>
            </div>

            {!disableDelete && (
              <div
                className={styles.delete}
                onClick={() => {
                  onDeleteFile();
                }}
              >
                <i className='fas fa-trash-alt'></i>
              </div>
            )}
          </>
        )}
        {status == StatusFileUploader.REJECTED && (
          <>
            <div className={styles.icon}>
              <i className='far fa-times-circle'></i>
            </div>
            <div className={styles.info}>
              <div className={`${styles.name} ${contract ? styles.contract : ''}`}>
                <p title={fileConfig.name}>{fileConfig.name}</p>
                {fileConfig.tooltip && <CustomTooltip content={fileConfig.tooltip} />}
              </div>
              <div className={styles.description}>{`${fileConfig.types ?? 'JPG/PDF'} MÁX. ${fileConfig.maxSize ?? '5MB'}`}</div>
            </div>
            <div className={`${styles.upload} ${styles.rejected}`}>
              <div className={`${styles.left} ${contract ? styles.contract : ''}`}>
                <div className={styles.top} title={file?.name ?? preloaded?.filename}>
                  {file?.name ?? preloaded?.filename}
                </div>
                <p className='text-danger'>{rejected?.feedback ?? uploadFeedback}</p>
              </div>
              <div
                className={styles.right}
                onClick={() => {
                  customDownload ? customDownload() : downloadFile();
                }}
              >
                <i className='fas fa-cloud-download-alt'></i>
              </div>
            </div>
            {!disableDelete && (
              <div
                className={styles.delete}
                onClick={() => {
                  onDeleteFile();
                }}
              >
                <i className='fas fa-trash-alt'></i>
              </div>
            )}
          </>
        )}
      </div>

      {rejected && (
        <div className={styles.row} style={{ marginTop: '-12px', paddingTop: '8px' }}>
          <div className={styles.reason}>
            <p className='text-danger'>{rejected?.reason}</p>
          </div>
        </div>
      )}

      <input type='file' name='file' ref={ref} onChange={fileChangeEvent} className='file-input' />

      <div className='modal'>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          className='modal-small'
        >
          <DialogTitle>Alerta</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>{error}</p>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
