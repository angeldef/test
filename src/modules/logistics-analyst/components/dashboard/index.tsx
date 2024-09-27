import { useState } from 'react';
import { GlobalFooter, GlobalHeader } from '../../../../core/components';
import { Search } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { DataTable, ProposalsResponse } from './types';
import { logisticsAnalystService } from '../../services/logisticsAnalyst';
import { useStateColor } from '@/core/hooks';
import { formatDate } from '@/core/utils/functions';
import { useNavigate } from 'react-router-dom';
import ServerPaginationGrid, { TableParams } from '@/core/components/table';
import styles from './styles.module.scss';

export const DashboardLogisticsAnalyst = () => {
  const [rows, setRows] = useState<DataTable[]>([]);
  const [rowsCopy, setRowsCopy] = useState<DataTable[]>([]);
  const { getColor } = useStateColor();
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'supplierRfc', headerName: 'RFC DEL PROVEEDOR', flex: 1 },
    { field: 'supplierName', headerName: 'NOMBRE/RAZÓN SOCIAL', flex: 1 },
    { field: 'negotiatorName', headerName: 'NEGOCIADOR', flex: 1 },
    { field: 'grouper', headerName: 'AGRUPADOR', flex: 1 },
    { field: 'createdAt', headerName: 'FECHA Y HORA', flex: 1 },
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
          : item.supplierRfc?.toLowerCase().includes(searchString) ||
            item.supplierName?.toLowerCase().includes(searchString) ||
            item.negotiatorName?.toLowerCase().includes(searchString) ||
            item.grouper?.toLowerCase().includes(searchString) ||
            item.createdAt?.toLowerCase().includes(searchString) ||
            item.status?.toLowerCase().includes(searchString)
      )
    );
  };

  const handleAction = async (params: { row: DataTable }, action: string) => {
    const { row } = params;

    switch (action) {
      case 'detail':
        const { negotiationSupplierId } = row;
        navigate(`/analista-logistica/detalle/${negotiationSupplierId}`, { replace: true });
        break;

      default:
        break;
    }
  };

  const getData = async (params?: TableParams): Promise<number> => {
    const { data: resp } = await logisticsAnalystService.getProposals(params);
    const { total } = resp?.paging ?? {};
    fillTable(resp.data);
    return total;
  };

  const fillTable = (data: ProposalsResponse[]) => {
    const rows = data.map((e, i) => ({
      ...e,
      id: i,
      createdAt: formatDate(e.createdAt, 'dd/MM/yyyy HH:mm:ss'),
      grouper: e.categoryGrouper.description,
    }));

    setRows(rows);
    setRowsCopy(rows);
  };

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
          <h2>Cotizaciones y Contrataciones</h2>
        </div>

        {/* <div className={styles.row}>
          <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '200px', marginRight: '15px' }}>
            <Search />
            <input type='text' className='form-control' placeholder='Buscar' onChange={filterTable} />
          </div>
        </div> */}

        <div
          className='table'
          style={{
            width: 'calc(100vw - 140px)',
            margin: '0 auto',
          }}
        >
          <ServerPaginationGrid disableFilters rows={rows} columns={columns} getData={getData}></ServerPaginationGrid>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};
