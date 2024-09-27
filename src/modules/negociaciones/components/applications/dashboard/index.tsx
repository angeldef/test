import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { proposalService } from '../../../../../core/services/proposals';
import { Button, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { View } from '..';
import { currencyPipe } from '../../../../../core/utils/pipes';
import { NegotiationContext } from '../../../context';
import { useFileDownloader, useStateColor } from '../../../../../core/hooks';
import { formatDate } from '../../../../../core/utils/functions';
import styles from './styles.module.scss';

export interface DataTable {
  id: number;
  supplier: string;
  type: string;
  responseDate: string;
  price: string;
  status: string;
  url: string | undefined;
}

type Props = {
  setCurrentView: Function;
  setProposalId: Function;
  id: string;
  canSelectSupplier: boolean;
};

export enum Status {
  NEW = 'NUEVA',
  EVALUATED = 'EVALUADO',
  REJECTED_BY_NEGOTIATOR = 'RECHAZADO POR NEGOCIADOR',
  SENT_TO_RISKS = 'ENVIADA A RIESGOS',
  APPROVED_WITH_RISKS = 'APROBADA CON RIESGOS',
  REJECTED_BY_RISKS = 'RECHAZADA POR RIESGOS',
  SENT_TO_ETHICS_LINE = 'ENVIADA A LÍNEA ÉTICA',
  REJECTED_BY_ETHICS_LINE = 'RECHAZADA POR LÍNEA ÉTICA',
  APPROVED_BY_ETHICS_LINE = 'APROBADO POR LÍNEA ÉTICA',
  WAITING_FOR_CONSIDERATION = 'EN ESPERA DE PONDERACIÓN',
  IN_APPROVAL_FLOW = 'EN FLUJO DE APROBACIONES',
  APPROVED = 'APROBADA',
  REQUEST_FOR_INFORMATION = 'SOLICITUD DE INFORMACIÓN',
  REVIEW_OF_INFORMATION = 'REVISIÓN DE INFORMACIÓN',
  CLOSED = 'CERRADA',
}

export const ApplicationsDashboard = ({ setCurrentView, setProposalId, id, canSelectSupplier }: Props) => {
  const [rows, setRows] = useState<DataTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableResp, setTableResp] = useState<DataTable[]>([]);
  const { setApprovedProposal } = useContext(NegotiationContext);
  const { getColor } = useStateColor();
  const [approvedChecked, setApprovedChecked] = useState(false);
  const { downloadFileGlobal } = useFileDownloader();

  const columns: GridColDef[] = [
    { field: 'supplier', headerName: 'PROVEEDOR', flex: 1 },
    { field: 'type', headerName: 'TIPO', flex: 1 },
    { field: 'responseDate', headerName: 'FECHA DE RESPUESTA', flex: 1 },
    { field: 'price', headerName: 'PRECIO', flex: 1 },
    {
      field: 'status',
      headerName: 'ESTADO',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { status } = params.row;
        return (
          <div style={{ cursor: 'pointer' }} title={params.row.status}>
            <p style={{ color: getColor(params.row.status), fontWeight: 'bold', textTransform: 'uppercase' }}>{status}</p>
          </div>
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
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleAction(params, 'detail');
              }}
            >
              <i className='fas fa-eye'></i>
            </div>
          </div>
        );
      },
    },
  ];

  const fillTable = async (queryParams?: DataTable) => {
    setApprovedChecked(false);
    const { data: resp } = await proposalService.getProposals(id);
    setApprovedChecked(true);

    if (!resp) return;

    const dataTable = resp.data.map((e: any) => {
      const { proposalId, date, supplier, type, price, status, url } = e;
      const formattedPrice = currencyPipe(price?.split(' ')[0]);
      const currency = price?.split(' ')[1];

      return {
        id: proposalId,
        supplier,
        type,
        responseDate: formatDate(date, 'dd/MM/yyyy HH:mm:ss'),
        price: `${formattedPrice ?? ''} ${currency ?? ''}`,
        status: status ? status : '-',
        url,
      };
    });

    const { id: proposalId } = dataTable.find((e: any) => e?.status?.toLowerCase() === 'aprobada') ?? {};
    setApprovedProposal(proposalId);
    setTableResp(dataTable);
    setRows(dataTable);
  };

  useEffect(() => {
    setLoading(!approvedChecked);
  }, [approvedChecked]);

  const filterTable = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const searchString = value.toLowerCase();
    setRows(
      tableResp?.filter((item) =>
        !value
          ? true
          : item.supplier?.toLowerCase().includes(searchString) ||
            item.type?.toLowerCase().includes(searchString) ||
            item.responseDate?.toLowerCase().includes(searchString) ||
            item.price?.toLowerCase().includes(searchString) ||
            item.status?.toLowerCase().includes(searchString)
      )
    );
  };

  const handleAction = async (params: { row: DataTable }, action: string) => {
    const { row } = params;

    switch (action) {
      case 'download':
        const { url } = row;
        downloadFileGlobal(url);
        break;

      case 'detail':
        const { id } = row;
        setCurrentView(View.DETAIL);
        setProposalId(id);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    fillTable();
  }, []);

  return (
    <>
      <div className={styles.container}>
        {loading ? (
          <div className='loading mt-4'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <h2 className='joey mb-2'>
              Gestión <br /> de Cotización
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
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                disableColumnMenu
                disableRowSelectionOnClick
                columnHeaderHeight={40}
                localeText={{ ...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: 'Sin resultados' }}
              />
            </div>

            {canSelectSupplier && (
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setCurrentView(View.SELECTION);
                  }}
                >
                  SELECCIONAR PROVEEDOR
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
