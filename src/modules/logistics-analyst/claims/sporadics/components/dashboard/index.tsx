import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataTable, ProposalsResponse } from './types';
import { useStateColor } from '@/core/hooks';
import { formatDate } from '@/core/utils/functions';
import { useNavigate } from 'react-router-dom';
import { logisticsAnalystService } from '@/modules/logistics-analyst/services/logisticsAnalyst';
import { CustomSnackbar, GlobalFooter, GlobalHeader } from '@/core/components';
import { ModalInvitation } from '../modal-invitation';
import { urlEmailInvitationSporadics } from '@/core/utils/constants';
import styles from './styles.module.scss';

export const DashboardSporadics = () => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState<string>();
  const [rows, setRows] = useState<DataTable[]>([]);
  const [rowsCopy, setRowsCopy] = useState<DataTable[]>([]);
  const [successInvitation, setSuccessInvitation] = useState(false);
  const { getColor } = useStateColor();
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TÍTULO', flex: 1 },
    { field: 'area', headerName: 'ÁREA', flex: 1 },
    { field: 'grouperDesc', headerName: 'AGRUPADOR', flex: 1 },
    {
      field: 'amountDesc',
      headerName: 'CUANTÍA',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ cursor: 'pointer' }}>
            <p style={{ color: '#00aec7', fontWeight: 'bold' }}>{params.row.amountDesc}</p>
          </div>
        );
      },
    },
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
      width: 85,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div
              title='Detalle'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleAction(params, 'detail');
              }}
            >
              <i className='fas fa-eye'></i>
            </div>
            <div
              title='Copiar enlace'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleAction(params, 'copyLink');
              }}
            >
              <i className='fas fa-link'></i>
            </div>
            <div
              title='Invitar por correo'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleAction(params, 'email');
              }}
            >
              <i className='far fa-envelope'></i>
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
          : item.title?.toLowerCase().includes(searchString) ||
            item.grouper?.description.toLowerCase().includes(searchString) ||
            item.amount?.description.toLowerCase().includes(searchString) ||
            item.createdAt?.toLowerCase().includes(searchString) ||
            item.status?.toLowerCase().includes(searchString)
      )
    );
  };

  const handleAction = async (params: { row: DataTable }, action: string) => {
    const { row } = params;
    const { id } = row;

    switch (action) {
      case 'detail':
        navigate(`/analista-logistica/siniestros/esporadicos/detalle/${id}`, { replace: true });
        break;

      case 'email':
        setOpenModal(true);
        setId(id);
        break;

      case 'copyLink':
        setCopied(true);
        // copyToClipboard(`${urlEmailInvitationSporadics}/${id}`);
        break;

      default:
        break;
    }
  };

  const onLoad = async () => {
    setLoading(true);
    const { data: resp } = await logisticsAnalystService.getProposalsSporadics();
    fillTable(resp.data);
    setLoading(false);
  };

  const fillTable = (data: ProposalsResponse[]) => {
    const rows = data.map((e, i) => ({
      ...e,
      id: e._id,
      createdAt: formatDate(e.createdAt, 'dd/MM/yyyy'),
      amountDesc: e.amount?.description,
      grouperDesc: e.grouper?.description,
    }));

    setRows(rows);
    setRowsCopy(rows);
  };

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
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
                <h2>Necesidades preconfiguradas</h2>
              </div>

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

      <ModalInvitation
        id={id}
        open={openModal}
        setSuccessInvitation={setSuccessInvitation}
        onClose={() => {
          setOpenModal(false);
        }}
        onConfirm={() => {
          setOpenModal(false);
        }}
      />

      <CustomSnackbar open={successInvitation} setOpen={setSuccessInvitation} duration={4000}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>CORREOS ENVIADOS</div>
            <p>Los correos han sido enviados satisfactoriamente</p>
          </div>
        </div>
      </CustomSnackbar>

      <CustomSnackbar open={copied} setOpen={setCopied} duration={4000}>
        <div className={styles.alertBody}>
          <i className='far fa-check-circle'></i>
          <div className={styles.wrapper}>
            <div className={styles.title}>EL ENLACE HA SIDO COPIADO</div>
            <p>Utiliza el enlace copiado para invitar a los proveedores que desees</p>
          </div>
        </div>
      </CustomSnackbar>
    </>
  );
};
