import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Approved } from './types';
import { Search } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { View } from '..';
import { proposalService } from '@/core/services/proposals';
import { currencyPipe } from '@/core/utils/pipes';
import styles from './styles.module.scss';

export type Row = {
  id: string;
  index: number;
  supplier: string;
  status: string;
  quotationPrice: string;
  reason?: string;
  rejected?: boolean;
  caseProvider?: boolean;
  ASG: number;
  ECONOMY: number;
  SERVICES: number;
  TOTAL: number;
};

export enum Status {
  ACCEPTED = 'APROBADO',
  REJECTED = 'RECHAZADO',
  NONE = 'NONE',
}

export enum ProposalStatus {
  REJECTED = 'RECHAZADA',
}

type Props = {
  negotiationId: string;
  approveds: Array<Approved>;
  setCurrentView: Function;
  setContract: Function;
  isContest?: boolean;
  disableInvitations?: Function;
};

export const SelectSupplier = ({ negotiationId, approveds, setCurrentView, setContract, isContest, disableInvitations }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [tableResp, setTableResp] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [name, setName] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [caseProvider, setCaseProvider] = useState(false);
  const [contrato, setContrato] = useState(false);

  const columns: GridColDef[] = [
    { field: 'supplier', headerName: 'PROVEEDOR', flex: 1 },
    { field: 'price', headerName: 'PRECIO', flex: 1 },
    { field: 'ASG', headerName: 'AMBIENTALES', flex: 1 },
    { field: 'ECONOMY', headerName: 'ECONÓMICOS', flex: 1 },
    { field: 'SERVICES', headerName: 'TÉCNICOS', flex: 1 },
    { field: 'TOTAL', headerName: 'TOTAL', flex: 1 },
    {
      field: 'status',
      headerName: 'REVISIÓN',
      sortable: false,
      // width: 300,
      renderCell: (params) => {
        const {
          row: { status, locked },
        } = params;

        return (
          <div style={{ display: 'flex', gap: '10px' }} className={styles.statusActions}>
            <div
              className={`${status === Status.ACCEPTED ? styles.accepted : null}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (locked) return;
                onChangeStatus(params.row, Status.ACCEPTED);
              }}
            >
              <i className='fas fa-check-circle'></i>
            </div>
            <div
              className={`${status === Status.REJECTED ? styles.rejected : null}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (locked) return;
                onChangeStatus(params.row, Status.REJECTED);
              }}
            >
              <i className='fas fa-times-circle'></i>
            </div>
          </div>
        );
      },
    },
  ];

  const confirm = () => {
    const isValid = rows.some((e) => e.status === Status.ACCEPTED);
    if (!isValid) {
      setErrorMsg('Debe seleccionar un proveedor');
      setOpenError(true);
      return;
    }

    const { supplier, caseProvider } = rows.find((e) => e.status === Status.ACCEPTED)!;
    setName(supplier);
    setCaseProvider(caseProvider!);
    setOpen(true);
  };

  const save = async () => {
    const suppliers = rows.map((e) => {
      const { id, status, reason, rejected } = e;
      const contract = caseProvider ? contrato : false;
      return {
        id,
        approved: status === Status.ACCEPTED,
        reasonRejection: reason ?? null,
        contract: isContest ? true : contract,
        rejected,
      };
    });

    setLoading(true);
    const { data: resp, error } = await proposalService.sendEmailApprovers(negotiationId, suppliers);
    setLoading(false);
    setOpen(false);

    if (resp) {
      setCurrentView(View.DASHBOARD);
      disableInvitations && disableInvitations();
    }

    if (error) {
      const { errors } = error;
      const { code } = errors[0];

      switch (code) {
        case 'NEGOTIATION_ALREADY_IN_APPROVAL_PROCESS':
          setErrorMsg('Ya se encuentra una propuesta en proceso de aprobación');
          break;
        default:
          setErrorMsg('Ocurrió un error al procesar la solicitud');
          break;
      }

      setOpenError(true);
    }
  };

  const handleSwitch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = target;
    setContrato(checked);
    setContract(checked);
  };

  const onChangeStatus = (row: Row, status: Status) => {
    const { index } = row;
    let array = [...rows];
    if (status === Status.ACCEPTED) {
      array = array.map((e) => (e.status === Status.ACCEPTED ? { ...e, status: Status.NONE } : e));
    }
    array[index] = { ...array[index], status, rejected: status === Status.REJECTED };
    setRows(array);
  };

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = target;
    let array = [...rows];
    array[index] = { ...array[index], reason: value };
    setRows(array);
  };

  const fillTable = async () => {
    let dataTable: Row[] = [];

    dataTable = approveds.map((e, i) => {
      const {
        supplier: { infoSupplier },
        quotationPrice,
        contestEvaluation,
        caseProvider,
        proposalStatus,
      } = e;

      const [price, currency] = quotationPrice.split(' ');
      const { personType } = infoSupplier;
      const { ASG, ECONOMY, SERVICES, TOTAL } = contestEvaluation ?? {};
      const supplier =
        personType == '1'
          ? `${infoSupplier.nameNaturalPerson} ${infoSupplier.surnameNaturalPerson}`
          : `${infoSupplier.nameLegalPerson} ${infoSupplier.tradeNameLegalPerson}`;

      return {
        id: e.negotiationSupplierId,
        index: i,
        supplier,
        quotationPrice,
        price: `${currencyPipe(price)} ${currency}`,
        ASG: ASG ?? 0,
        ECONOMY: ECONOMY ?? 0,
        SERVICES: SERVICES ?? 0,
        TOTAL: TOTAL ?? 0,
        status: e.approvedByNegotiator
          ? Status.ACCEPTED
          : e.rejectedByNegotiator || proposalStatus == ProposalStatus.REJECTED
          ? Status.REJECTED
          : Status.NONE,
        reason: e.reasonRejection,
        locked: e.rejectedByNegotiator || proposalStatus == ProposalStatus.REJECTED,
        caseProvider,
      };
    });

    setTableResp(dataTable);
    setRows(dataTable);
  };

  const filterTable = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const searchString = value.toLowerCase();
    setRows(
      tableResp?.filter((item) =>
        !value ? true : item.supplier?.toLowerCase().includes(searchString) || item.quotationPrice?.toString().toLowerCase().includes(searchString)
      )
    );
  };

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    fillTable();
  };

  return (
    <>
      <h2 className='joey mb-2'>
        Selección Final <br /> de Proveedor
      </h2>

      <div className={styles.searchRow}>
        <div></div>
        <div></div>
        <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '280px' }}>
          <Search />
          <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
        </div>
      </div>
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

      <div className={styles.buttons}>
        <LoadingButton
          variant='contained'
          loading={loading}
          onClick={() => {
            confirm();
          }}
        >
          CONTINUAR
        </LoadingButton>
      </div>

      <div className='modal'>
        <Dialog open={open} className='modal-small'>
          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              marginBottom: '-15px',
            }}
          >
            Confirmación de
          </p>
          <DialogTitle>Selección de Proveedor</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>Por favor confirmas que deseas seleccionar al proveedor</p>

              <div className={styles.name}>{name}</div>
              <p>
                Al hacerlo la selección se enviará a flujo de aprobaciones y en cuanto esté aprobado por SURA, el proveedor podrá continuar con el
                proceso
              </p>

              {caseProvider && (
                <>
                  <p className='bold mt-2'>¿Deseas firmar contrato con el proveedor?</p>
                  <div className={styles.switch}>
                    <p>No</p>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch checked={contrato} onChange={handleSwitch} />}
                        label=''
                        sx={{
                          margin: 0,
                        }}
                      />
                    </FormGroup>
                    <p>Si</p>
                  </div>
                </>
              )}

              <div className={styles.buttons}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(false);
                    save();
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='modal'>
        <Dialog
          open={openError}
          onClose={() => {
            setOpenError(false);
          }}
          className='modal-small'
        >
          <DialogTitle>Alerta</DialogTitle>
          <DialogContent>
            <div className={styles.modalBody}>
              <p>{errorMsg}</p>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenError(false);
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
