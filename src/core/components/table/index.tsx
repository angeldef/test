import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridSortModel, esES } from '@mui/x-data-grid';
import { Filters, FiltersBar } from '../filters/bar';

type Props<RowType> = {
  rows: RowType[];
  columns: GridColDef[];
  getData: (params: TableParams) => Promise<number>;
  disableFilters?: boolean;
};

export type TableParams = {
  $limit?: number;
  $init?: number;
  search?: string;
};

export default function ServerPaginationGrid<RowType>({ rows, columns, getData, disableFilters }: Props<RowType>) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const { page, pageSize } = paginationModel;
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [queryString, setQueryString] = useState<TableParams>();

  const setFilters = (filters: Filters) => {
    const { searchString: search } = filters ?? {};
    setQueryString((prev) => ({ ...prev, search }));
  };

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    console.log(sortModel);
  }, []);

  useEffect(() => {
    const $limit = pageSize;
    const $init = page * pageSize;
    setQueryString((prev) => ({ ...prev, $limit, $init }));
  }, [page, pageSize]);

  useEffect(() => {
    (async () => {
      if (!queryString) return;

      setLoading(true);
      const total = await getData(queryString!);
      setLoading(false);
      setRowCount(total);
    })();
  }, [queryString]);

  return (
    <>
      <FiltersBar columns={columns} disableFilters={disableFilters} setFilters={setFilters} />

      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        pageSizeOptions={[5, 10]}
        disableColumnMenu
        disableRowSelectionOnClick
        columnHeaderHeight={40}
        paginationMode='server'
        paginationModel={paginationModel}
        // sortingMode='server'
        onSortModelChange={handleSortModelChange}
        onPaginationModelChange={setPaginationModel}
        sx={{ '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' } }}
        localeText={{ ...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: 'Sin resultados' }}
      />
    </>
  );
}
