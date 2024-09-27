import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { BankAccount } from '../../detail/types';
import { RejectReason } from './reject-reason';
import { ModalConfirm } from './modal-confirm';
import { ModalConfirmReject } from './modal-confirm-reject';
import { LoadingButton } from '@mui/lab';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';
import { ModalDone } from './modal-done';
import styles from './styles.module.scss';

export interface Account extends BankAccount {
  index: number;
  id?: number;
  key?: string;
  status?: string;
  code?: string;
  account?: string;
}

export enum AccountStatus {
  ACCEPTED = 'APROBADO',
  REJECTED = 'RECHAZADO',
}

interface ApprovalRequest extends BankAccount {
  approved: boolean;
  reasonReturned: string;
}

type SelectedReason = {
  reason: string;
  index: number;
};

type Props = {
  bankAccounts: Array<BankAccount | null>;
  supplierId: string;
  getData: Function;
};

export const BanksTab = ({ bankAccounts, supplierId, getData }: Props) => {
  const [rows, setRows] = useState<Account[]>([]);
  const [tableResp, setTableResp] = useState<Account[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmReject, setOpenConfirmReject] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SelectedReason>();
  const [completed, setCompleted] = useState(false);

  const columns: GridColDef[] = [
    { field: 'currency', headerName: 'MONEDA', flex: 1 },
    { field: 'countryBank', headerName: 'PAÍS', flex: 1 },
    { field: 'account', headerName: 'CUENTA', width: 150 },
    { field: 'code', headerName: 'SWIFT/ABA', flex: 1 },
    {
      field: 'review',
      headerName: 'REVISIÓN',
      sortable: false,
      width: 220,
      renderCell: (params) => {
        const {
          row: { status, reason, locked },
        } = params;

        return (
          <>
            <div style={{ display: 'flex', gap: '10px' }} className={styles.statusActions}>
              <div
                className={`${status === AccountStatus.ACCEPTED ? styles.accepted : null}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (locked) return;
                  onChangeStatus(params.row, AccountStatus.ACCEPTED);
                }}
              >
                <i className='fas fa-check-circle'></i>
              </div>
              <div
                className={`${status === AccountStatus.REJECTED ? styles.rejected : null}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (locked) return;
                  onChangeStatus(params.row, AccountStatus.REJECTED);
                }}
              >
                <i className='fas fa-times-circle'></i>
              </div>
              {params.row.status === AccountStatus.REJECTED && reason}
            </div>
          </>
        );
      },
    },
    {
      field: 'status',
      headerName: 'ESTADO',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const {
          row: { active },
        } = params;
        return <>{active && <div className={styles.active}>ACTIVA</div>}</>;
      },
    },
  ];

  const updateApprovalRequest = (index: number, approved: boolean, reasonReturned: string) => {
    const array = [...approvalRequest];
    array[index] = { ...array[index], approved, reasonReturned };
    setApprovalRequest(array);
  };

  const onChangeStatus = (row: Account, status: AccountStatus) => {
    const { index } = row;
    const array = [...rows];
    array[index] = { ...array[index], status };
    setRows(array);

    updateApprovalRequest(index, status === AccountStatus.ACCEPTED, '');
  };

  const onSelectReason = (reason: string, index: number) => setSelectedReason({ reason, index });

  const fillTable = async () => {
    let dataTable = bankAccounts.map((e, i) => {
      const { analystApproval, currency, countryBank } = e ?? {};
      const { reasonReturned } = analystApproval ?? {};
      const processed = e?.analystApproval?.approved === true || e?.analystApproval?.approved === false;
      const account = currency === 'USD' && countryBank === 'INTERNACIONAL' ? e?.accountNumber : e?.clabe;
      const code = e?.code === 'SWIFT' ? e.swift : e?.code === 'ABA' ? e.aba : 'N/A';

      return {
        ...e,
        id: i,
        index: i,
        code,
        countryBank: e?.countryBank ?? 'N/A',
        account,
        locked: processed,
        status: processed ? (e?.analystApproval.approved === true ? AccountStatus.ACCEPTED : AccountStatus.REJECTED) : undefined,
        reason: <RejectReason index={i} onSelectReason={onSelectReason} preload={reasonReturned} disabled={processed} />,
      };
    });

    setTableResp(dataTable);
    setRows(dataTable);
  };

  const confirmSave = async () => {
    const invalidStatus = approvalRequest.some((item) => item.approved === undefined);
    if (invalidStatus) {
      setError('Debe aprobar o rechazar la cuenta');
      setOpen(true);
      return;
    }

    const invalidReasons = approvalRequest.some((item) => item?.approved === false && !item?.reasonReturned);
    if (invalidReasons) {
      setError('Debe escribir un motivo para la cuenta rechazada');
      setOpen(true);
      return;
    }

    const { approved } = approvalRequest[0];
    approved ? setOpenConfirm(true) : setOpenConfirmReject(true);
  };

  const save = async () => {
    setLoading(true);
    const { data: resp } = await logisticsAnalystService.approveBankAccount(approvalRequest, supplierId);
    if (resp) setOpenDone(true);
    setLoading(false);
  };

  const onLoad = async () => {
    const array = [...bankAccounts] as ApprovalRequest[];
    setApprovalRequest(
      array.map((e) => {
        const processed = e?.analystApproval?.approved === true || e?.analystApproval?.approved === false;
        return { ...e, approved: processed ? e?.analystApproval?.approved : undefined };
      })
    );
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

    setCompleted(
      bankAccounts.every((item) => {
        const { analystApproval } = item ?? {};
        const { approved } = analystApproval ?? {};
        return analystApproval && (approved === true || approved === false);
      })
    );
  }, [bankAccounts]);

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
          <LoadingButton
            className='btn-icon-outlined'
            variant='outlined'
            type='submit'
            loading={loading}
            onClick={() => {
              confirmSave();
            }}
          >
            GUARDAR REVISIÓN
          </LoadingButton>
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

      <ModalConfirm
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          setOpenConfirm(false);
          save();
        }}
      />

      <ModalConfirmReject
        open={openConfirmReject}
        onClose={() => {
          setOpenConfirmReject(false);
        }}
        onConfirm={() => {
          setOpenConfirmReject(false);
          save();
        }}
      />

      <ModalDone
        open={openDone}
        onClose={() => {
          setOpenDone(false);
          getData();
        }}
        onConfirm={() => {
          setOpenDone(false);
          getData();
        }}
      />
    </>
  );
};
