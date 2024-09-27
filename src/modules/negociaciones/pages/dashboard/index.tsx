import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../../core/services';
import { DataTable, NegociationsListResponse } from './types';
import { CircularProgress } from '@mui/material';
import { getDateString } from '../../../../core/utils/functions';
import { useErrorHandling } from '../../../../core/hooks';
import { useStateColor } from '../../../../core/hooks';
import { NegotiationContext } from '../../context';
import styles from './styles.module.scss';

export const DashboardNegociacionesPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<DataTable[]>([]);
  const [rowsCopy, setRowsCopy] = useState<DataTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleApiError } = useErrorHandling();
  const { getColor } = useStateColor();
  const { setApprovedProposal } = useContext(NegotiationContext);

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TÍTULO', flex: 1 },
    { field: 'grouper', headerName: 'AGRUPADOR', flex: 1 },
    { field: 'category', headerName: 'CATEGORÍA', flex: 1 },
    { field: 'type', headerName: 'TIPO', flex: 1 },
    {
      field: 'amount',
      headerName: 'CUANTÍA',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ cursor: 'pointer' }}>
            <p style={{ color: '#00aec7', fontWeight: 'bold' }}>{params.row.amount}</p>
          </div>
        );
      },
    },
    { field: 'fecha', headerName: 'CREADA EL' },
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
      width: 50,
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleAction(params);
            }}
          >
            <i className='fas fa-eye'></i>
          </div>
        );
      },
    },
  ];

  const handleAction = (params: { row: DataTable }) => {
    const { row } = params;
    const { _id } = row;
    navigate(`/negociaciones/detalle/${_id}/solicitudes`, { replace: true });
  };

  const filterTable = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const searchString = value.toLowerCase();
    setRows(
      rowsCopy?.filter((item) =>
        !value
          ? true
          : item.title.toLowerCase().includes(searchString) ||
            item.grouper.toLowerCase().includes(searchString) ||
            item.category.toLowerCase().includes(searchString) ||
            item.type.toLowerCase().includes(searchString) ||
            item.amount.toLowerCase().includes(searchString) ||
            item.fecha?.toLowerCase().includes(searchString) ||
            item.status.toLowerCase().includes(searchString)
      )
    );
  };

  const fillTable = (data: NegociationsListResponse[]) => {
    const rows = data.map((e, i) => ({
      id: i,
      title: e.title,
      grouper: e.grouper?.description || '',
      category: e.category?.description || '',
      type: e.type || '',
      amount: e.amount?.description || '',
      fecha: getDateString(e.createdAt || ''),
      status: e.status || '',
      _id: e._id,
    }));

    setRows(rows);
    setRowsCopy(rows);
  };

  const onLoad = async () => {
    setLoading(true);
    const { data: resp, error } = await apiService.getNegociations();
    handleApiError(error);
    fillTable(resp.data);
    setLoading(false);
    setApprovedProposal(null);
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
        <div
          className={styles.back}
          onClick={() => {
            navigate('/principal', { replace: true });
          }}
        >
          <i className='fas fa-arrow-left'></i>
          <h2>Principal</h2>
        </div>

        {loading ? (
          <div className='loading mt-4'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className={styles.row}>
              <div className='form-group search' style={{ margin: 0, marginTop: '12px' }}>
                <Search />
                <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
              </div>

              <div
                className='btn-secondary'
                onClick={() => {
                  navigate('/negociaciones/crear', { replace: true });
                }}
              >
                NUEVA NEGOCIACIÓN
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
