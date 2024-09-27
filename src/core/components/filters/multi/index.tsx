import { Button, ClickAwayListener, Popper } from '@mui/material';
import { useState } from 'react';
import { BadgeFilter } from './badge-filter';
import { GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import styles from './styles.module.scss';

type Props = {
  columns: GridColDef[];
  filtersActive: FilterActive[];
  setFiltersActive: Function;
};

export type FilterActive = {
  field: string;
  value: string;
};

export const MultiFilters = ({ columns, filtersActive, setFiltersActive }: Props) => {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [filterSelected, setFilterSelected] = useState<GridColDef[]>([]);

  const handleSelect = (e: GridColDef) => {
    if (filterSelected.indexOf(e) > -1) return;
    let array = [...filterSelected];
    array.push(e);
    setFilterSelected(array);
  };

  const deleteFilter = (filter: GridColDef) => {
    const selected = [...filterSelected];
    setFilterSelected(selected.filter((e) => e.field !== filter.field));

    const active = [...filtersActive];
    setFiltersActive(active.filter((e) => e.field !== filter.field));
  };

  const handleSearch = (filter: FilterActive) => {
    if (filtersActive.find((e) => e.field === filter.field)) {
      let array = filtersActive.filter((e) => e.field !== filter.field);
      array.push(filter);
      setFiltersActive(array);
      return;
    }

    let array = [...filtersActive];
    array.push(filter);
    setFiltersActive(array);
  };

  return (
    <>
      <div className={styles.row}>
        <div className={styles.filters}>
          <span className='bold'>Filtros:</span>

          <div className={styles.badges}>
            {filterSelected.map((e, i) => (
              <BadgeFilter key={`filter-${i}`} filter={e} deleteFilter={deleteFilter} handleSearch={handleSearch} />
            ))}
          </div>
        </div>

        <div className={styles.filterBtn}>
          <Button
            className={styles.btn}
            variant='outlined'
            onClick={(e) => {
              setAnchor(e.currentTarget);
              setOpen(true);
            }}
            startIcon={<AddIcon />}
          >
            FILTRAR
          </Button>
        </div>

        <ClickAwayListener
          onClickAway={() => {
            if (!clicked) {
              setClicked(true);
            } else {
              setOpen(false);
              setAnchor(null);
              setClicked(false);
            }
          }}
        >
          <Popper sx={{ zIndex: 1000 }} open={open} anchorEl={anchor}>
            <div className={styles.popper}>
              <ul>
                {columns.map((e, i) => (
                  <li onClick={() => handleSelect(e)} key={i}>
                    {e.headerName}
                  </li>
                ))}
              </ul>
            </div>
          </Popper>
        </ClickAwayListener>
      </div>
    </>
  );
};
