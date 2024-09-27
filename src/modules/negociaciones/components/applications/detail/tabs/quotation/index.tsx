import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Quotation } from '../../types';
import { proposalService } from '../../../../../../../core/services/proposals';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { formatDate } from '../../../../../../../core/utils/functions';
import { currencyPipe } from '../../../../../../../core/utils/pipes';
import { FieldValues, useForm } from 'react-hook-form';
import { useFileDownloader } from '@/core/hooks';
import styles from './styles.module.scss';

export type Document = {
  title: string;
  url: string;
  key: string;
  createdAt: string;
  status: string | undefined;
  reasonRejection: string;
  revisionHistory: RevisionHistory[];
  id: string;
  index: number;
};

export type RevisionHistory = {
  createdAt: string;
  status: string;
  reasonRejection: string;
  type: string;
  url: string;
};

export enum DocStatus {
  ACCEPTED = 'APROBADO',
  REJECTED = 'RECHAZADO',
}

type ApprovalRequest = {
  approved: boolean | undefined;
  reasonRejection: string;
};

type SelectedReason = {
  reason: string;
  index: number;
};

type Props = {
  quotation: Array<Quotation | null>;
  proposalId: string;
  getDetail: Function;
};

export const QuotationTab = ({ quotation, proposalId, getDetail }: Props) => {
  const [rows, setRows] = useState<Document[]>([]);
  const [tableResp, setTableResp] = useState<Document[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SelectedReason>();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { downloadFileGlobal } = useFileDownloader();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    mode: 'all',
  });

  const columns: GridColDef[] = [
    { field: 'price', headerName: 'PRECIO', flex: 1 },
    { field: 'currency', headerName: 'MONEDA', flex: 1 },
    { field: 'createdAt', headerName: 'ENVIO', flex: 1 },
    {
      field: 'status',
      headerName: 'REVISIÓN',
      sortable: false,
      width: 300,
      renderCell: (params) => {
        const {
          row: { status, locked, index },
        } = params;

        return index == 0 ? (
          <div style={{ display: 'flex', gap: '10px' }} className={styles.statusActions}>
            <div
              className={`${status === DocStatus.ACCEPTED ? styles.accepted : null}`}
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
                setOpenReject(true);
                reset();
              }}
            >
              <i className='fas fa-times-circle'></i>
            </div>
            {approvalRequest?.reasonRejection && (
              <div className={styles.reason}>
                <p className={styles.label}>Motivo de rechazo</p>
                <p title={approvalRequest?.reasonRejection}>{approvalRequest?.reasonRejection}</p>
              </div>
            )}
          </div>
        ) : (
          <></>
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
          </div>
        );
      },
    },
  ];

  const updateApprovalRequest = (index: number, approved: boolean, reasonRejection: string) => {
    setApprovalRequest({ approved, reasonRejection });
  };

  const onChangeStatus = (row: Document, status: DocStatus) => {
    const { index } = row;
    const array = [...rows];
    array[index] = { ...array[index], status };
    setRows(array);

    updateApprovalRequest(index, status === DocStatus.ACCEPTED, '');
  };

  const fillTable = async () => {
    let dataTable = quotation.map((e: any, i) => {
      const { reasonRejection } = e;
      return {
        ...e,
        id: i,
        index: i,
        reason: '',
        createdAt: formatDate(e.createdAt, 'dd/MM/yyyy HH:mm:ss'),
        price: e.price ? currencyPipe(e.price) : 'N/A',
      };
    });

    dataTable = dataTable.map((e) => (e?.status == DocStatus.ACCEPTED || e?.status == DocStatus.REJECTED ? { ...e, locked: true } : e));

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

      default:
        break;
    }
  };

  const onSubmit = (form: FieldValues) => {
    const { reason } = form;
    onChangeStatus(rows[0], DocStatus.REJECTED);
    setApprovalRequest({ approved: false, reasonRejection: reason });
    setOpenReject(false);
  };

  const confirmSave = async () => {
    if (!approvalRequest) {
      setError('Debe aprobar o rechazar la cotización');
      setOpen(true);
      return;
    }

    if (approvalRequest.approved === false && !approvalRequest.reasonRejection) {
      setError('Debe seleccionar un motivo de rechazo');
      setOpen(true);
      return;
    }

    setHasRejected(!!approvalRequest.reasonRejection);
    setOpenConfirm(true);
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);
    const body = { ...approvalRequest };
    const { data: resp } = await proposalService.quotationApproval(body, proposalId);
    if (resp) getDetail();
    setOpenConfirm(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

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
    const mustPreload = quotation?.some((item) => item?.status === DocStatus.ACCEPTED || item?.status === DocStatus.REJECTED);
    if (mustPreload) {
      const { status, reasonRejection } = quotation[0] ?? {};
      const approved = status == DocStatus.ACCEPTED || status == DocStatus.REJECTED ? status == DocStatus.ACCEPTED : undefined;
      setCompleted(!!approved);
      setApprovalRequest({ approved, reasonRejection: reasonRejection ?? '' });
    }
  }, [quotation]);

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
              paginationModel: { page: 0, pageSize: 10 },
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
                      <div className={styles.listRejected}>
                        <i className='fas fa-times'></i>
                        COTIZACIÓN
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!hasRejected && <p className='mt-2'>¿Confirmas que aceptarás el documento de cotización?</p>}
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
          open={openReject}
          onClose={() => {
            setOpenReject(false);
          }}
          className='modal-small'
        >
          <div className='btn-closeModal'>
            <IconButton
              onClick={() => {
                setOpenReject(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <DialogContent sx={{ minWidth: 400 }}>
            <div className={styles.modalBody}>
              <h2 className={`${styles.modalTitle} joey`}>Rechazar Cotización</h2>
              <p className='mt-1'>Indique el motivo de rechazo</p>

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className='form-group'>
                  <TextField placeholder='Motivo de Rechazo' multiline rows={5} {...register('reason', { required: 'Campo obligatorio' })} />
                  {errors.reason && (
                    <small style={{ bottom: 0 }} className='text-danger'>
                      {errors.reason?.message as string}
                    </small>
                  )}
                </div>

                <div className={styles.buttons}>
                  <Button type='submit' variant='outlined'>
                    ACEPTAR
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
