import { Search } from '@mui/icons-material';
import { DateFilters } from '../date';
import { FilterActive, MultiFilters } from '../multi';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getFilterColumns } from '@/core/utils/functions';
import styles from './styles.module.scss';

type Props = {
  columns: GridColDef[];
  disableFilters?: boolean;
  setFilters: (filters: Filters) => void;
};

export type Filters = {
  searchString?: string;
  filtersActive?: FilterActive[];
  rangeSelected?: RangeSelected;
};

export type RangeSelected = {
  period: string;
  from?: Date | null;
  to?: Date | null;
};

export const FiltersBar = ({ columns, disableFilters, setFilters }: Props) => {
  const [value, setValue] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
  const [filtersActive, setFiltersActive] = useState<FilterActive[]>([]);
  const [rangeSelected, setRangeSelected] = useState<RangeSelected>();
  const filterColumns = getFilterColumns(columns);

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    if (keyCode === 13) setSearchString(value);
  };

  useEffect(() => {
    setFilters({ searchString, filtersActive, rangeSelected });
  }, [searchString, filtersActive, rangeSelected]);

  return (
    <>
      <div className={styles.filters}>{!disableFilters && <DateFilters setRangeSelected={setRangeSelected} />}</div>
      <div className={styles.filters}>
        {disableFilters ? <div></div> : <MultiFilters columns={filterColumns} filtersActive={filtersActive} setFiltersActive={setFiltersActive} />}

        <div className={styles.row}>
          <div className='form-group search' style={{ margin: 0, padding: 0, width: '200px' }}>
            <Search style={{ bottom: '10px' }} />
            <input type='text' className='form-control' placeholder='Buscar' onChange={onChange} value={value} onKeyDown={handleKeyDown} />
          </div>
        </div>
      </div>
    </>
  );
};
