import { useEffect, useState } from 'react';
import { FileConfig, FileRequest, FileUploader, StatusFileUploader } from '@/core/components/file-uploader';
import { formatDate } from '@/core/utils/functions';
import { Contract } from '../../types';
import { ModalError } from './modal-error';
import { legalSpecialistService } from '@/modules/legal-specialist/services/legalSpecialist';
import { ModalDone } from './modal-done';
import { LoadingButton } from '@mui/lab';
import { ModalRejection } from './modal-rejection';
import { ModalConfig } from './modal-config';
import { ModalRR9 } from './modal-confirm';
import { EventSignature } from '@/modules/negociaciones/components/applications/detail/tabs/contract';
import { DocStatus } from '../documentation';
import { ModalConfirmReject } from './modal-confirm-reject';
import { useFileDownloader } from '@/core/hooks';
import { Status } from '@/modules/negociaciones/components/applications/dashboard';
import { codeErrorApi } from '@/core/utils/enums';
import styles from './styles.module.scss';

type Props = {
  contract?: Contract;
  supplierContract?: boolean;
  id: string;
  getData: Function;
  negotiatorFormalization: NegotiatorFormalization;
  rrNine?: boolean;
  negotiationStatus?: string;
  proposalStatus?: string;
};

enum ProposalStatus {
  REJECTED = 'RECHAZADA',
}

enum ContractSource {
  MARCO = 'MARCO',
  SURA = 'SURA',
  LEGAL = 'LEGAL',
  PROVEEDOR = 'PROVEEDOR',
  NEGOCIADOR = 'NEGOCIADOR',
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
  currency?: string;
  frequencyDescription?: string;
}

export const ContractTab = ({ contract, id, getData, negotiatorFormalization, rrNine, negotiationStatus, proposalStatus }: Props) => {
  const [doc, setDoc] = useState<FileConfig>();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [openError, setOpenError] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openRR9, setOpenRR9] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openRejection, setOpenRejection] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [oneSupplier, setOneSupplier] = useState(false);
  const [logbook, setLogbook] = useState<FileConfig[]>();
  const { accepted, contractSource, history, statusSignature, pdfSigned, pdfSignedDate } = contract ?? {};
  const { status } = statusSignature ?? {};
  const { downloadFileGlobal } = useFileDownloader();

  const disableActions = negotiationStatus == Status.CLOSED || proposalStatus == ProposalStatus.REJECTED;
  const canAcceptReject =
    accepted == undefined && (contractSource == ContractSource.PROVEEDOR || contractSource == ContractSource.NEGOCIADOR) && !disableActions;
  const canUpload = accepted == false && contractSource != ContractSource.PROVEEDOR && contractSource != ContractSource.NEGOCIADOR && !disableActions;

  const [uploadDoc, setUploadDoc] = useState<FileConfig>({
    key: 'contractUpdated',
    name: 'CONTRATO ACTUALIZADO',
  });

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

  function onChangeDocument(document: Partial<FileConfig>) {
    setUploadDoc((prev) => ({ ...prev, ...document }));
  }

  useEffect(() => {
    if (contract && Object.keys(contract).length) {
      const { accepted, reasonRejection, createdAt, fileName, filename, contractSource, status, approvalBy } = contract;
      const contractDate = formatDate(createdAt, 'dd/MM/yyyy');
      const source = contractSource?.replaceAll('MARCO', 'SURA').replaceAll('LEGAL', 'SURA');
      const name = `CONTRATO ENVIADO POR ${source} - ${contractDate}`;

      if (fileName || filename)
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

  useEffect(() => {
    setLogbook(
      history?.map((e: any, i: number) => {
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
    if (status === EventSignature.SIGNED_REQUISITION && rrNine !== false && rrNine !== true) setOpenRR9(true);
  }, [status]);

  const setFlagRR9 = async (marked: boolean) => {
    const { data: resp } = await legalSpecialistService.markRrNine(id, marked);
    if (resp) {
      setFeedback('Se ha aplicado el RR9 correctamente');
      setOpenDone(true);
      getData(true);
    }
  };

  const save = async () => {
    const { base64, file } = uploadDoc ?? {};
    const { name } = file ?? {};

    if (!base64) {
      setOpenError(true);
      return;
    }

    const body = {
      fileName: name,
      basePdf: base64,
    };
    setLoading(true);
    const { data: resp } = await legalSpecialistService.saveContract(body, id);
    setLoading(false);

    if (resp) {
      setFeedback('Se ha enviado el contrato correctamente');
      setOpenDone(true);
      getData(true);
    }
  };

  const approveContract = async () => {
    setLoading(true);
    const { data: resp } = await legalSpecialistService.approveContract({ approved: true }, id);
    setLoading(false);

    if (resp) {
      setFeedback('Se ha aprobado el contrato correctamente');
      setOpenDone(true);
      getData(true);
    }
  };

  const rejectContract = async (reasonRejection: string) => {
    setOpenRejection(false);
    setLoading(true);
    const { data: resp } = await legalSpecialistService.approveContract({ approved: false, reasonRejection }, id);
    setLoading(false);

    if (resp) {
      setFeedback('Se ha rechazado el contrato correctamente');
      setOpenDone(true);
      getData(true);
    }
  };

  const rejectProposal = async () => {
    setLoading(true);
    const { data: resp, error } = await legalSpecialistService.rejectProposal(id, oneSupplier);
    setLoading(false);

    if (resp) {
      setFeedback('Se ha rechazado la contratación correctamente');
      setOpenDone(true);
      getData(true);
    }

    if (error) {
      const { code } = error.errors[0];
      if (code === codeErrorApi.ONE_SUPPLIER_EXISTS) {
        setOneSupplier(true);
        setOpenReject(true);
      }
    }
  };

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

      {canUpload && (
        <div className={styles.files}>
          <FileUploader fileConfig={uploadDoc} saveFile={saveFile} deleteFile={deleteFile} />
        </div>
      )}

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
        {logbook?.reverse().map((doc, i) => (
          <FileUploader
            key={i}
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

      <div className={styles.buttons}>
        {canAcceptReject ? (
          <LoadingButton
            variant='outlined'
            loading={loading}
            onClick={() => {
              setOpenRejection(true);
            }}
          >
            RECHAZAR CONTRATO
          </LoadingButton>
        ) : (
          <div></div>
        )}

        <div className={styles.right}>
          {canAcceptReject && (
            <LoadingButton
              variant='contained'
              loading={loading}
              onClick={() => {
                approveContract();
              }}
            >
              ACEPTAR CONTRATO SUGERIDO
            </LoadingButton>
          )}

          {canUpload && (
            <LoadingButton
              variant='contained'
              loading={loading}
              onClick={() => {
                save();
              }}
            >
              ENVIAR CONTRATO ACTUALIZADO
            </LoadingButton>
          )}
        </div>
      </div>

      {!disableActions && (
        <div className={styles.buttons}>
          <LoadingButton
            variant='outlined'
            loading={loading}
            onClick={() => {
              setOpenReject(true);
            }}
          >
            RECHAZAR CONTRATACIÓN
          </LoadingButton>
        </div>
      )}

      <ModalDone
        feedback={feedback!}
        open={openDone}
        onClose={() => {
          setOpenDone(false);
        }}
        onConfirm={() => {
          setOpenDone(false);
        }}
      />

      <ModalError
        feedback='Debe cargar un archivo para poder continuar'
        open={openError}
        onClose={() => {
          setOpenError(false);
        }}
      />

      <ModalRejection
        open={openRejection}
        rejectContract={rejectContract}
        onClose={() => {
          setOpenRejection(false);
        }}
      />

      <ModalConfig
        negotiatorFormalization={negotiatorFormalization}
        open={openConfig}
        onClose={() => {
          setOpenConfig(false);
        }}
      />

      <ModalRR9
        open={openRR9}
        onConfirm={() => {
          setOpenRR9(false);
          setFlagRR9(true);
        }}
        onClose={() => {
          setOpenRR9(false);
          setFlagRR9(false);
        }}
      />

      <ModalConfirmReject
        oneSupplier={oneSupplier}
        open={openReject}
        onConfirm={() => {
          setOpenReject(false);
          rejectProposal();
        }}
        onClose={() => {
          setOpenReject(false);
        }}
      />
    </>
  );
};
