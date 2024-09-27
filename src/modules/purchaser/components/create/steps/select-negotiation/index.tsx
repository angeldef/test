import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { DataTableNegotiations } from './types';
import { Search } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SideBar } from '../../side-bar';
import { SuppliersResponse } from '../select-supplier/form-builder/types';
import { purchaserService } from '@/modules/purchaser/services/purchaser';
import { NegociationsListResponse } from '@/modules/negociaciones/pages/dashboard/types';
import { getDateString } from '@/core/utils/functions';
import { Wizard } from '../../types';
import { ModalConfirmSelection } from '../../modal-confirm-selection';
import styles from './styles.module.scss';

type Props = {
  next: Function;
  back: Function;
  supplierInfo: SuppliersResponse;
  wizard: Wizard;
  updateWizard: Function;
};

export const SelectNegotiation = ({ next, back, supplierInfo, wizard, updateWizard }: Props) => {
  const { selectNegotiation } = wizard;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<DataTableNegotiations[]>(selectNegotiation?.rows || []);
  const [rowsCopy, setRowsCopy] = useState<DataTableNegotiations[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>(selectNegotiation?.selectionModel || []);
  const columns: GridColDef[] = [
    { field: 'title', headerName: 'TÍTULO', flex: 1 },
    { field: 'grouper', headerName: 'AGRUPADOR', flex: 1 },
    { field: 'category', headerName: 'CATEGORIA', flex: 1 },
    { field: 'type', headerName: 'TIPO', flex: 1 },
    { field: 'amount', headerName: 'CUANTÍA', flex: 1 },
  ];

  const onSelect = (selectedRows: GridRowSelectionModel) => {
    const selectionSet = new Set(selectionModel);
    const result = selectedRows.filter((s) => !selectionSet.has(s));
    setSelectionModel(result);

    const id = result[0];
    const selected = rows.find((e) => e.id === id);
    const { currency } = selected ?? {};
    updateWizard({ currency });
  };

  useEffect(() => {
    const { _id } = supplierInfo ?? {};
    if (_id) getNegotiations(_id);
  }, [supplierInfo]);

  const getNegotiations = async (id: string) => {
    setLoading(true);
    const { data: resp } = await purchaserService.getNegotiations(id);
    setLoading(false);

    if (resp?.data) {
      const negotiations = resp.data.map((e: any) => {
        const { quotation } = e;
        const { currency } = quotation?.[0];
        const { negotiation, _id } = e;
        return { ...negotiation, proposalId: _id, currency };
      });
      fillTable(negotiations);
    }
  };

  const fillTable = (data: NegociationsListResponse[]) => {
    const rows = data.map((e, i) => {
      return {
        ...e,
        id: i,
        title: e.title,
        grouper: e.grouper?.description || '',
        category: e.category?.description || '',
        type: e.type || '',
        amount: e.amount?.description || '',
        fecha: getDateString(e.updateAt || ''),
        status: e.status || '',
        _id: e._id,
        proposalId: e.proposalId,
      };
    });

    setRows(rows);
    setRowsCopy(rows);
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
            item.amount.toLowerCase().includes(searchString)
      )
    );
  };

  const getProposalId = () => {
    const id = selectionModel[0];
    return rows.find((e) => e.id === id)?.proposalId;
  };

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.left}>
          <SideBar supplierInfo={supplierInfo} wizard={wizard} />
        </div>
        <div className={styles.right}>
          <h2 className='joey mb-2'>Selección de negociaciones vigentes</h2>

          {loading ? (
            <div className='loading mt-4'>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className={styles.row}>
                <div className='form-group search' style={{ margin: 0, marginTop: '12px', width: '200px', marginRight: '15px' }}>
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
                  checkboxSelection
                  onRowSelectionModelChange={onSelect}
                  rowSelectionModel={selectionModel}
                  sx={{
                    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                      display: 'none',
                    },
                  }}
                />
              </div>

              <div className={styles.buttons}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    updateWizard({ selectNegotiation: { ...selectNegotiation, rows, selectionModel, proposalId: getProposalId() } });
                    back();
                  }}
                >
                  REGRESAR
                </Button>

                <LoadingButton
                  variant='contained'
                  disabled={selectionModel.length === 0}
                  onClick={() => {
                    updateWizard({ selectNegotiation: { ...selectNegotiation, rows, selectionModel, proposalId: getProposalId() } });
                    setOpen(true);
                  }}
                >
                  CONTINUAR
                </LoadingButton>
              </div>
            </>
          )}
        </div>
      </div>

      <ModalConfirmSelection
        open={open}
        wizard={wizard}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          setOpen(false);
          next();
        }}
      />
    </>
  );
};
