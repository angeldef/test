import { useEffect, useState } from 'react';
import { FileConfig, FileRequest, FileUploader, StatusFileUploader } from '@/core/components/file-uploader';
import { formatDate } from '@/core/utils/functions';
import { ModalConfig } from './modal-config';
import { Contract } from '@/modules/legal-specialist/components/types';
import { ModalConfirm } from './modal-confirm';
import { proposalService } from '@/core/services/proposals';
import { ModalDone } from './modal-done';
import { LoadingButton } from '@mui/lab';
import { ModalError } from './modal-error';
import { ModalDoneFinish } from './modal-done-finish';
import { DocStatus } from '../documentation';
import { CustomTooltip } from '@/core/components';
import styles from './styles.module.scss';
import { useFileDownloader } from '@/core/hooks';
import { NegotiationSupplier } from '../../types';

type Props = {
  contract?: Contract;
  supplierContract?: boolean;
  id: string;
  getData: Function;
  negotiatorFormalization: NegotiatorFormalization;
  supplier?: string;
  negotiationSupplier?: NegotiationSupplier;
};

enum ContractSource {
  MARCO = 'MARCO',
  SURA = 'SURA',
  LEGAL = 'LEGAL',
  PROVEEDOR = 'PROVEEDOR',
  NEGOCIADOR = 'NEGOCIADOR',
}

export enum EventSignature {
  SIGNED_REQUISITION = 'SIGNED_REQUISITION',
  REQUISITION_PART_SIGNED = 'REQUISITION_PART_SIGNED',
  REJECTED_REQUISITION = 'REJECTED_REQUISITION',
  CANCEL_REQUISITION = 'CANCEL_REQUISITION',
  CREATE_REQUISITION = 'CREATE_REQUISITION',
}

export interface NegotiatorFormalization {
  service: string;
  contractDateStart: string;
  contractDateEnd: string;
  attachServiceProposal: boolean;
  descService: string;
  annexDateStart: string;
  annexDateEnd: string;
  quantityContract: boolean;
  quantity: string;
  frequency: string;
  confidentialityAgreement: string;
  frequencyDescription?: string;
}

export const ContractTab = ({ contract, id, getData, negotiatorFormalization, supplier, negotiationSupplier }: Props) => {
  const [openConfig, setOpenConfig] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openDoneFinish, setOpenDoneFinish] = useState(false);
  const [logbook, setLogbook] = useState<FileConfig[]>();
  const [doc, setDoc] = useState<FileConfig>();
  const { history, statusSignature, accepted, contractSource, pdfSigned, pdfSignedDate } = contract ?? {};
  const { status, supplierSigned, legalSigned } = statusSignature ?? {};
  const { downloadFileGlobal } = useFileDownloader();
  const [canUpload, setCanUpload] = useState(
    status === EventSignature.CANCEL_REQUISITION || (accepted === false && contractSource == ContractSource.NEGOCIADOR)
  );
  const [canCancel, setCanCancel] = useState(supplierSigned === false && status !== EventSignature.CANCEL_REQUISITION);
  const [uploadDoc, setUploadDoc] = useState<FileConfig>({
    key: 'signedContract',
    name: 'CONTRATO FIRMADO POR LAS PARTES',
    types: 'PDF',
  });
  const { quotation } = negotiationSupplier ?? {};
  const { currency } = quotation?.[0] ?? {};

  const deleteContract = async () => {
    const { data } = await proposalService.deleteContract({ negotiationSupplierId: id });
    if (data) {
      setOpenDone(true);
      setCanCancel(false);
      setCanUpload(true);
    }
  };

  function onChangeDocument(document: Partial<FileConfig>) {
    setUploadDoc((prev) => ({ ...prev, ...document }));
  }

  const saveFile = async (fileRequest: FileRequest) => {
    const { key, file, base64 } = fileRequest;
    onChangeDocument({ key, file, base64, status: StatusFileUploader.FILE_UPLOADED });
  };

  const deleteFile = (key: string) => {
    onChangeDocument({
      key,
      file: undefined,
      base64: undefined,
      status: StatusFileUploader.EMPTY,
      url: undefined,
    });
  };

  const save = async () => {
    const { base64, file } = uploadDoc ?? {};
    const { name } = file ?? {};

    const body = {
      fileName: name,
      baseFile: base64,
    };
    setLoading(true);
    const { data: resp } = await proposalService.saveContract(body, id);
    setLoading(false);

    if (resp) {
      setOpenDoneFinish(true);
      setCanUpload(false);
    }
  };

  useEffect(() => {
    setLogbook(
      history?.reverse().map((e: any, i: number) => {
        const { fileName, filename, accepted, reasonRejection, contractSource, createdAt, approvalBy } = e;
        const contractDate = formatDate(createdAt, 'dd/MM/yyyy');
        const source = contractSource?.replaceAll('MARCO', 'SURA').replaceAll('LEGAL', 'SURA');
        const name = `CONTRATO ENVIADO POR ${source} - ${contractDate}`;

        return {
          key: `contract-${i}`,
          name,
          url: `${fileName ?? filename}.pdf`,
          types: 'PDF',
          uploadFeedback: e.status,
          status: accepted === false ? StatusFileUploader.REJECTED : undefined,
          ...(reasonRejection &&
            Object.keys(reasonRejection).length && {
              rejected: {
                feedback: `RECHAZADO POR ${approvalBy ?? ''}`,
                reason: reasonRejection,
              },
            }),
        };
      })
    );
  }, [history]);

  useEffect(() => {
    if (contract && Object.keys(contract).length) {
      const { accepted, reasonRejection, createdAt, fileName, filename, contractSource, status, approvalBy } = contract;
      const contractDate = formatDate(createdAt, 'dd/MM/yyyy');
      const source = contractSource?.replaceAll('MARCO', 'SURA').replaceAll('LEGAL', 'SURA');
      const name = `CONTRATO ENVIADO POR ${source} - ${contractDate}`;

      setDoc({
        key: 'contract',
        name,
        url: `${fileName ?? filename}.pdf`,
        types: 'PDF',
        uploadFeedback: status,
        status: accepted === false ? StatusFileUploader.REJECTED : undefined,
        ...(reasonRejection &&
          Object.keys(reasonRejection).length && {
            rejected: {
              feedback: `RECHAZADO POR ${approvalBy ?? ''}`,
              reason: reasonRejection,
            },
          }),
      });
    }
  }, [contract]);

  return (
    <>
      <div className={styles.row}>
        <div></div>

        <div
          className={styles.link}
          onClick={() => {
            setOpenConfig(true);
          }}
        >
          Configuración de Contrato
        </div>
      </div>

      <div className={styles.files}>
        {pdfSigned && (
          <FileUploader
            fileConfig={{
              key: 'contractUpdated',
              name: `CONTRATO FIRMADO POR LAS PARTES - ${pdfSignedDate ? formatDate(pdfSignedDate, 'dd/MM/yyyy') : ''}`,
              types: 'PDF',
              url: pdfSigned,
              uploadFeedback: DocStatus.ACCEPTED,
            }}
            saveFile={() => {}}
            deleteFile={() => {}}
            disableDelete
            contract
          />
        )}

        {doc && (
          <FileUploader
            fileConfig={doc}
            saveFile={() => {}}
            deleteFile={() => {}}
            disableDelete
            contract
            customDownload={() => {
              const { contractUrl, fileName } = contract ?? {};
              if (contractUrl) downloadFileGlobal(contractUrl);
            }}
          />
        )}
      </div>

      <div className={styles.history}>
        {logbook?.map((doc) => (
          <FileUploader
            fileConfig={doc}
            saveFile={() => {}}
            deleteFile={() => {}}
            disableDelete
            contract
            customDownload={() => {
              const { contractUrl, fileName } = contract ?? {};
              if (contractUrl) downloadFileGlobal(contractUrl);
            }}
          />
        ))}
      </div>

      {canUpload && (
        <>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <h2 className='joey'>Adjunta el contrato firmado</h2>
            <CustomTooltip content='Si el Contrato se formalizó por firma autógrafa, carga el formato PDF' />
          </div>
          <FileUploader fileConfig={uploadDoc} saveFile={saveFile} deleteFile={deleteFile} />

          <div className={styles.buttons}>
            <LoadingButton
              variant='contained'
              loading={loading}
              onClick={() => {
                const { base64 } = uploadDoc ?? {};
                if (!base64) {
                  setOpenError(true);
                  return;
                }
                save();
              }}
            >
              FINALIZAR
            </LoadingButton>
          </div>
        </>
      )}

      {canCancel && (
        <div
          className={`mt-2 ${styles.link}`}
          onClick={() => {
            setOpenConfirm(true);
          }}
        >
          Detener Firma de Contrato
        </div>
      )}

      <ModalConfig
        negotiatorFormalization={negotiatorFormalization}
        currency={currency}
        open={openConfig}
        onClose={() => {
          setOpenConfig(false);
        }}
      />

      <ModalConfirm
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          deleteContract();
        }}
      />

      <ModalDone
        open={openDone}
        onClose={() => {
          setOpenDone(false);
        }}
        onConfirm={() => {
          setOpenDone(false);
        }}
      />

      <ModalDoneFinish
        open={openDoneFinish}
        onClose={() => {
          setOpenDoneFinish(false);
        }}
        onConfirm={() => {
          setOpenDoneFinish(false);
        }}
      />

      <ModalError
        feedback='Debe cargar un archivo para poder continuar'
        open={openError}
        onClose={() => {
          setOpenError(false);
        }}
      />
    </>
  );
};
