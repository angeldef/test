import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { proposalService } from '../../../../../../core/services/proposals';
import { Approved } from '../../../../../negociaciones/components/applications/select-supplier/types';
import { Status } from '../../../../../negociaciones/components/applications/select-supplier';
import { styled } from '@mui/material/styles';
import { currencyPipe } from '../../../../../../core/utils/pipes';
import styles from './styles.module.scss';

type Row = {
  id: string;
  index: number;
  supplier: string;
  price: string;
  ASG: number;
  ECONOMY: number;
  SERVICES: number;
  TOTAL: number;
};

type Props = {
  id?: string;
};

export const SuppliersTable = ({ id }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [tableResp, setTableResp] = useState<Row[]>([]);

  const columns: GridColDef[] = [
    { field: 'supplier', headerName: 'PROVEEDOR', flex: 1 },
    { field: 'price', headerName: 'PRECIO', flex: 1 },
    { field: 'ASG', headerName: 'AMBIENTALES', flex: 1 },
    { field: 'ECONOMY', headerName: 'ECONÓMICOS', flex: 1 },
    { field: 'SERVICES', headerName: 'TÉCNICOS', flex: 1 },
    { field: 'TOTAL', headerName: 'TOTAL', flex: 1 },
  ];

  const StyledDataGrid = styled(DataGrid)(() => ({
    '& .selected': {
      backgroundColor: '#e9f5fc',
      '&:hover': {
        backgroundColor: '#e9f5fc',
      },
      '.MuiDataGrid-cellContent': {
        color: '#00aec7',
        fontWeight: 'bold',
      },
    },
  }));

  const onLoad = async () => {
    if (id) {
      const { data: resp } = await proposalService.getApproveds(id, true);
      fillTable(resp.data ?? []);
    }
  };

  const fillTable = async (approveds: Array<Approved>) => {
    let dataTable: Row[] = [];

    dataTable = approveds.map((e, i) => {
      const {
        supplier: { infoSupplier },
        quotationPrice,
        contestEvaluation,
        caseProvider,
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
        price: `${currencyPipe(price)} ${currency}`,
        ASG: ASG ?? 0,
        ECONOMY: ECONOMY ?? 0,
        SERVICES: SERVICES ?? 0,
        TOTAL: TOTAL ?? 0,
        status: Status.NONE,
        caseProvider,
        selected: e.approvedByNegotiator,
      };
    });

    setTableResp(dataTable);
    setRows(dataTable);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <div
        className='table'
        style={{
          margin: '0 auto',
        }}
      >
        <StyledDataGrid
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
          getRowClassName={(params) => (params.row.selected ? 'selected' : '')}
        />
      </div>
    </>
  );
};
