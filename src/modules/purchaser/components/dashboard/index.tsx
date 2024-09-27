import { useEffect, useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataTable, PurchasesResponse } from './types';
import { useFileDownloader, useStateColor } from '@/core/hooks';
import { formatDate } from '@/core/utils/functions';
import { useNavigate } from 'react-router-dom';
import { purchaserService } from '../../services/purchaser';
import { currencyPipe } from '@/core/utils/pipes';
import styles from './styles.module.scss';

export const DashboardPurchaser = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DataTable[]>([]);
  const [rowsCopy, setRowsCopy] = useState<DataTable[]>([]);
  const { downloadFileGlobal } = useFileDownloader();
  const { getColor } = useStateColor();
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'folio', headerName: 'N° FOLIO', flex: 1 },
    { field: 'supplierName', headerName: 'PROVEEDOR', flex: 1 },
    { field: 'supplierRfc', headerName: 'RFC', flex: 1 },
    { field: 'totalLabel', headerName: 'TOTAL A PAGAR', flex: 1 },
    { field: 'createdAt', headerName: 'CREADA EL', flex: 1 },
    {
      field: 'status',
      headerName: 'ESTADO',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ cursor: 'pointer' }} title={params.row.status}>
            <p style={{ color: getColor(params.row.status), fontWeight: 'bold' }}>{params.row.status}</p>
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

  const filterTable = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const searchString = value.toLowerCase();
    setRows(
      rowsCopy?.filter((item) =>
        !value
          ? true
          : item.folio?.toLowerCase().includes(searchString) ||
            item.supplierName?.toLowerCase().includes(searchString) ||
            item.rfc?.toLowerCase().includes(searchString) ||
            item.totalLabel?.toLowerCase().includes(searchString) ||
            item.createdAt?.toLowerCase().includes(searchString) ||
            item.status?.toLowerCase().includes(searchString)
      )
    );
  };

  const handleAction = async (params: { row: DataTable }, action: string) => {
    const { row } = params;

    switch (action) {
      case 'detail':
        const { _id } = row;
        navigate(`/orden-compra/crear/${_id}`, { replace: true });
        break;

      case 'download':
        const { url } = row;
        downloadFileGlobal(url);
        break;

      default:
        break;
    }
  };

  const onLoad = async () => {
    setLoading(true);
    const { data: resp } = await purchaserService.getPurchases();
    fillTable(resp.data);
    setLoading(false);
  };

  const fillTable = (data: PurchasesResponse[]) => {
    const rows = data.map((e, i) => ({
      ...e,
      id: i,
      createdAt: formatDate(e.createdAt, 'dd/MM/yyyy HH:mm:ss'),
      totalLabel: e.totalToPay ? `$ ${currencyPipe(e.totalToPay)} ${e.currency}` : 'N/A',
    }));

    setRows(rows);
    setRowsCopy(rows);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className='container'>
      <div className='header'>
        <GlobalHeader />
      </div>

      <div className='main'>
        {loading ? (
          <div className='loading mt-4'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              className={styles.back}
              onClick={() => {
                navigate('/principal', { replace: true });
              }}
            >
              <i className='fas fa-arrow-left'></i>
              <h2>Órdenes de Compra </h2>
            </div>

            <div className={styles.row}>
              <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '200px', marginRight: '15px' }}>
                <Search />
                <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
              </div>

              <div
                className='btn-secondary'
                onClick={() => {
                  navigate('/orden-compra/crear', { replace: true });
                }}
              >
                NUEVA ORDEN DE COMPRA
              </div>
            </div>

            <div
              className='table'
              style={{
                width: 'calc(100vw - 140px)',
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
                localeText={{ noRowsLabel: 'No se encontraron resultados' }}
              />
            </div>
          </>
        )}
      </div>

      <GlobalFooter />
    </div>
  );
};
