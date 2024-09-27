import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Documentation, Reason } from '../../types';
import { RejectReason } from './reject-reason';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { BtnHistory } from './btn-history';
import { useFileDownloader } from '@/core/hooks';
import styles from './styles.module.scss';
import { formatDate } from '@/core/utils/functions';
import { proposalService } from '@/core/services/proposals';

export type Document = {
  title: string;
  url: string;
  key: string;
  createdAt: string;
  status: string | undefined;
  reasonReturned: string;
  revisionHistory: RevisionHistory[];
  originalStatus?: string;
  id: string;
  index: number;
  approvedByNegociator?: any;
};

export type RevisionHistory = {
  createdAt: string;
  status: string;
  reasonReturned: string;
  type?: string;
  url?: string;
};

export enum DocStatus {
  ACCEPTED = 'APROBADO',
  REJECTED = 'RECHAZADO',
}

type ApprovalRequest = {
  key: string;
  approval: boolean;
  reasonReturned: string;
};

type SelectedReason = {
  reason: string;
  index: number;
};

type Props = {
  documentation: Array<Documentation | null>;
  proposalId: string;
  getDetail: Function;
  reasons: Reason[];
};

export const DocsTab = ({ documentation, proposalId, getDetail, reasons }: Props) => {
  const [rows, setRows] = useState<Document[]>([]);
  const [tableResp, setTableResp] = useState<Document[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SelectedReason>();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistory[]>([]);
  const [docHistory, setDocHistory] = useState<string>();
  const [completed, setCompleted] = useState(false);
  const { downloadFileGlobal } = useFileDownloader();

  const columns: GridColDef[] = [
    { field: 'fileName', headerName: 'DOCUMENTO', flex: 1 },
    {
      field: 'approvers',
      headerName: 'APROBADORES',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const {
          row: { mustApproveNegociator, mustApproveAnalyst, approvedByNegociator, approvedByAnalyst },
        } = params;
        return (
          <>
            <div style={{ display: 'flex', gap: '10px' }} className={styles.statusActions}>
              {mustApproveNegociator && (
                <div className={`${approvedByNegociator ? styles.accepted : null}`} style={{ cursor: 'pointer' }}>
                  <i className='fas fa-check' title='Aprobación del negociador'></i>
                </div>
              )}
              {mustApproveAnalyst && (
                <div className={`${approvedByAnalyst ? styles.accepted : null}`} style={{ cursor: 'pointer' }}>
                  <i className='fas fa-check' title='Aprobación del analista de logística'></i>
                </div>
              )}
            </div>
          </>
        );
      },
    },
    {
      field: 'status',
      headerName: 'REVISIÓN',
      sortable: false,
      width: 300,
      renderCell: (params) => {
        const {
          row: { status, reason, locked, url, mustApproveNegociator, approvedByNegociator },
        } = params;

        return (
          <>
            {url && mustApproveNegociator && (
              <div style={{ display: 'flex', gap: '10px' }} className={styles.statusActions}>
                <div
                  className={`${approvedByNegociator ? styles.accepted : null}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (locked) return;
                    onChangeStatus(params.row, DocStatus.ACCEPTED);
                  }}
                >
                  <i className='fas fa-check-circle'></i>
                </div>
                <div
                  className={`${status === DocStatus.REJECTED ? styles.rejected : null}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (locked) return;
                    onChangeStatus(params.row, DocStatus.REJECTED);
                  }}
                >
                  <i className='fas fa-times-circle'></i>
                </div>

                {params.row.status === DocStatus.REJECTED && reason}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      width: 60,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            {params.row.url && (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleAction(params, 'download');
                }}
              >
                <i className='fas fa-download'></i>
              </div>
            )}
            {!!params.row.revisionHistory?.length && (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleAction(params, 'detail');
                }}
              >
                <i className='fas fa-eye'></i>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const updateApprovalRequest = (index: number, approval: boolean, reasonReturned: string) => {
    const { key } = documentation[index]!;
    const array = [...approvalRequest];
    array[index] = { approval, key, reasonReturned };
    setApprovalRequest(array);
  };

  const onChangeStatus = (row: Document, status: DocStatus) => {
    const { index } = row;
    const array = [...rows];
    array[index] = { ...array[index], status, approvedByNegociator: status === DocStatus.ACCEPTED };
    setRows(array);

    updateApprovalRequest(index, status === DocStatus.ACCEPTED, '');
  };

  const onSelectReason = (reason: string, index: number) => setSelectedReason({ reason, index });

  const fillTable = async () => {
    let dataTable = documentation.map((e: any, i) => {
      const { reasonReturned, createdAt, approvedBy, negotiatiorApproval, analystApproval, status } = e;
      const rejected = negotiatiorApproval?.approved === false || analystApproval?.approved === false;
      return {
        ...e,
        id: i,
        index: i,
        fileName: e.fileName?.toString().toUpperCase(),
        originalStatus: status,
        reason: <RejectReason index={i} onSelectReason={onSelectReason} reasons={reasons} preload={reasonReturned} disabled={rejected} />,
        date: formatDate(createdAt, 'dd/MM/yyyy HH:mm:ss'),
        mustApproveNegociator: approvedBy?.includes('NEGOCIADOR'),
        mustApproveAnalyst: approvedBy?.includes('ANALISTA'),
        approvedByAnalyst: analystApproval?.approved,
        approvedByNegociator: negotiatiorApproval
          ? negotiatiorApproval?.approved
          : status === DocStatus.ACCEPTED && approvedBy?.length === 1
          ? true
          : status === DocStatus.REJECTED
          ? false
          : undefined,
      };
    });

    dataTable = dataTable.map((e) => (e.approvedByNegociator === true || e.approvedByNegociator === false ? { ...e, locked: true } : e));
    setTableResp(dataTable);
    setRows(dataTable);
  };

  const handleAction = async (params: { row: Document }, action: string) => {
    const { row } = params;

    switch (action) {
      case 'download':
        const { url } = row;
        downloadFileGlobal(url);
        break;

      case 'detail':
        const { revisionHistory, title, createdAt, status, reasonReturned, originalStatus } = row;
        const array = [...[{ createdAt, status: originalStatus!, reasonReturned }], ...revisionHistory];
        setOpenHistory(true);
        setDocHistory(title);
        setRevisionHistory(array);
        break;

      default:
        break;
    }
  };

  const confirmSave = async () => {
    const invalidStatus = approvalRequest.some((item) => !item);
    if (invalidStatus) {
      setError('Debe aprobar o rechazar todos los documentos');
      setOpen(true);
      return;
    }

    const invalidReasons = approvalRequest.some((item) => item?.approval === false && !item?.reasonReturned);
    if (invalidReasons) {
      setError('Debe seleccionar un motivo para los documentos rechazados');
      setOpen(true);
      return;
    }

    setHasRejected(!!approvalRequest.some((item) => item?.approval === false));
    setOpenConfirm(true);
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);
    const { data: resp } = await proposalService.docApprovals({ documents: approvalRequest.filter((item) => item.key) }, proposalId);
    setOpenConfirm(false);
    if (resp) getDetail();
  };

  const onLoad = async () => {
    fillTable();
  };

  useEffect(() => {
    if (selectedReason) {
      const { index, reason } = selectedReason;
      updateApprovalRequest(index, false, reason);
    }
  }, [selectedReason]);

  useEffect(() => {
    onLoad();

    const array = documentation.map((e) => {
      const { approvedBy, negotiatiorApproval } = e ?? {};
      if ((e?.status === DocStatus.ACCEPTED || e?.status === DocStatus.REJECTED) && e.allowModify !== false) {
        if (e?.status === DocStatus.REJECTED) return {};
        return {
          approval: e?.status === DocStatus.ACCEPTED,
          key: e?.key,
          reasonReturned: e?.reasonReturned,
        };
      } else return !approvedBy?.includes('NEGOCIADOR') || negotiatiorApproval?.approved ? {} : null;
    }) as ApprovalRequest[];
    setApprovalRequest(array);

    setCompleted(
      !documentation.some((item) => {
        const { negotiatiorApproval, approvedBy, status } = item ?? {};
        const { approved } = negotiatiorApproval ?? {};
        const mustApproveNegociator = approvedBy?.includes('NEGOCIADOR');
        return (
          (mustApproveNegociator && (!negotiatiorApproval || (negotiatiorApproval && approved !== true && approved !== false))) ||
          (status !== DocStatus.ACCEPTED && status !== DocStatus.REJECTED && approvedBy?.length === 1)
        );
      })
    );
  }, [documentation]);

  return (
    <>
      <div
        className='table'
        style={{
          margin: '0 auto',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[10]}
          disableColumnMenu
          disableRowSelectionOnClick
          columnHeaderHeight={40}
          rowHeight={60}
          localeText={{ ...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: 'Sin resultados' }}
        />
      </div>

      {!completed && (
        <div className='text-right mt-2'>
          <Button
            className='btn-icon-outlined'
            variant='outlined'
            type='submit'
            onClick={() => {
              confirmSave();
            }}
          >
            GUARDAR REVISIÓN
          </Button>
        </div>
      )}

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

      <div className='modal'>
        <Dialog
          open={openConfirm}
          onClose={() => {
            setOpenConfirm(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenConfirm(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            <div className={`${styles.modalBodyConfirm} text-center`}>
              <div className={`${styles.titleSecondary} joey`}>Confirmación de Revisión</div>

              {hasRejected && (
                <>
                  <p className='mt-2'>El proveedor recibirá notificación de las siguientes acciones:</p>
                  <div className={styles.rejected}>
                    <p className={styles.bold}>Documentos rechazados</p>
                    <div className='mt-1'>
                      {rows.map((item, i) =>
                        item.status === DocStatus.REJECTED ? (
                          <div className={styles.listRejected} key={i}>
                            <i className='fas fa-times'></i>
                            {item.title}
                          </div>
                        ) : undefined
                      )}
                    </div>
                  </div>
                </>
              )}
              {!hasRejected && <p className='mt-2'>¿Confirmas que aceptarás todos los documentos?</p>}
            </div>

            {!loading ? (
              <div className={`${styles.buttonsConfirm} ${styles.centered}`}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setOpenConfirm(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    save();
                  }}
                >
                  Aceptar
                </Button>
              </div>
            ) : (
              <div className='loading mt-4'>
                <CircularProgress />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className='modal'>
        <Dialog
          open={openHistory}
          onClose={() => {
            setOpenHistory(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenHistory(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent>
            <div className={`${styles.modalBodyConfirm} text-center`}>
              <div className={`${styles.titleSecondary} joey`}>{docHistory}</div>
              <div className={`${styles.titleSecondary} joey`}>Histórico de Revisiones</div>
            </div>

            <div className='mt-2'>
              {revisionHistory.map((e, i) => (
                <BtnHistory key={i} {...e} />
              ))}
            </div>

            <div className={`${styles.buttonsConfirm} ${styles.centered}`}>
              <Button
                variant='outlined'
                onClick={() => {
                  setOpenHistory(false);
                }}
              >
                Aceptar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
