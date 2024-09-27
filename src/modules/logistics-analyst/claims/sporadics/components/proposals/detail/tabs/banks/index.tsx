import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { BankAccount } from '@/modules/logistics-analyst/components/detail/types';
import { RejectReason } from '@/modules/logistics-analyst/components/tabs/banks/reject-reason';
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

type Props = {
  bankAccounts: Array<BankAccount | null>;
};

export const BanksTab = ({ bankAccounts }: Props) => {
  const [rows, setRows] = useState<Account[]>([]);
  const [tableResp, setTableResp] = useState<Account[]>([]);

  const columns: GridColDef[] = [
    { field: 'currency', headerName: 'MONEDA', flex: 1 },
    { field: 'countryBank', headerName: 'PAÍS', flex: 1 },
    { field: 'account', headerName: 'CUENTA', width: 150 },
    { field: 'code', headerName: 'SWIFT/ABA', flex: 1 },

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

  const fillTable = async () => {
    let dataTable = bankAccounts.map((e, i) => {
      const { analystApproval, currency, countryBank } = e ?? {};
      const { reasonReturned } = analystApproval ?? {};
      const account = currency === 'USD' && countryBank === 'INTERNACIONAL' ? e?.accountNumber : e?.clabe;
      const code = e?.code === 'SWIFT' ? e.swift : e?.code === 'ABA' ? e.aba : 'N/A';

      return {
        ...e,
        id: i,
        index: i,
        code,
        countryBank: e?.countryBank ?? 'N/A',
        account,
        reason: <RejectReason index={i} onSelectReason={() => {}} preload={reasonReturned} disabled={true} />,
      };
    });

    dataTable = dataTable.map((e) => (e.approved === true || e.approved === false ? { ...e, locked: true } : e));
    setTableResp(dataTable);
    setRows(dataTable);
  };

  const onLoad = async () => {
    fillTable();
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
    </>
  );
};
