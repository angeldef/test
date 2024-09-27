import { useEffect, useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataTable } from './types';
import { legalSpecialistService } from '../../services/legalSpecialist';
import { useStateColor } from '@/core/hooks';
import { getDateString } from '@/core/utils/functions';
import { useNavigate } from 'react-router-dom';
import { NegociationsListResponse } from '@/modules/negociaciones/pages/dashboard/types';
import styles from './styles.module.scss';

export const DashboardLegalSpecialist = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DataTable[]>([]);
  const [rowsCopy, setRowsCopy] = useState<DataTable[]>([]);
  const { getColor } = useStateColor();
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TÍTULO', flex: 1 },
    { field: 'area', headerName: 'ÁREA', flex: 1 },
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
    { field: 'negotiatorName', headerName: 'NEGOCIADOR', flex: 1 },

    {
      field: 'rr9',
      headerName: 'RR9',
      sortable: false,
      width: 50,
      renderCell: (params) => {
        const { rrNine } = params.row;
        if (rrNine == null) return 'N/A';
        return (
          <div className={`${styles.rr9} ${rrNine ? styles.active : ''}`}>
            <i className='fas fa-check-circle'></i>
          </div>
        );
      },
    },
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
            item.negotiatorName?.toLowerCase().includes(searchString) ||
            item.area?.toLowerCase().includes(searchString) ||
            item.status.toLowerCase().includes(searchString)
      )
    );
  };

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleAction = (params: { row: DataTable }) => {
    const { row } = params;
    const {
      proposalData: { negotiationSupplierId },
    } = row;

    navigate(`/especialista-legal/detalle/${negotiationSupplierId}`, { replace: true });
  };

  const onLoad = async () => {
    setLoading(true);
    const { data: resp } = await legalSpecialistService.getProposals();
    fillTable(resp.data);
    setLoading(false);
  };

  const fillTable = (data: NegociationsListResponse[]) => {
    const rows = data.map((e, i) => ({
      ...e,
      id: i,
      title: e.title,
      grouper: e.grouper?.description || '',
      category: e.category?.description || '',
      type: e.type || '',
      amount: e.amount?.description || '',
      fecha: getDateString(e.updateAt || ''),
      negotiatorName: e.negotiatorName || 'N/A',
      area: e.area ? capitalize(e.area) : 'N/A',
      status: e.status || '',
      _id: e._id,
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
            <h2 className='joey mb-2'>
              Cotizaciones <br /> y Contrataciones
            </h2>

            <div className={styles.row}>
              <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '200px', marginRight: '15px' }}>
                <Search />
                <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
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
