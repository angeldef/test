import { useState } from 'react';
import { Search } from '@mui/icons-material';
import { ClickAwayListener, Popper, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles.module.scss';

type Props = {
  filter: GridColDef;
  deleteFilter: Function;
  handleSearch: Function;
};

export const BadgeFilter = ({ filter, deleteFilter, handleSearch }: Props) => {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState<string>('contains');
  const [searchString, setSearchString] = useState<string>('');

  const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchString(value);
  };

  const closePopup = () => {
    setOpen(false);
    setAnchor(null);
    setClicked(false);
  };

  const search = () => {
    closePopup();
    const { field } = filter;
    handleSearch({ field, searchString });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    if (keyCode === 13) search();
    if (keyCode === 27) closePopup();
  };

  return (
    <>
      <div className={styles.badge}>
        <div
          className={styles.name}
          onClick={(e) => {
            setAnchor(e.currentTarget);
            setOpen(true);
          }}
        >
          {filter.headerName}
        </div>
        <div className={styles.close}>
          <CloseIcon
            className={styles.icon}
            onClick={() => {
              deleteFilter(filter);
            }}
          />
        </div>
      </div>

      <ClickAwayListener
        onClickAway={() => {
          if (!clicked) {
            setClicked(true);
          } else {
            closePopup();
          }
        }}
      >
        <Popper sx={{ zIndex: 1000, left: '8px !important' }} open={open} anchorEl={anchor}>
          <div className={styles.popper}>
            {/* <FormControl>
              <RadioGroup className={styles.radio} value={value} onChange={handleRadio}>
                <FormControlLabel value='contains' control={<Radio />} label='Contiene' />
                <div className={`${styles.formGroup} ${styles.search}`} style={{ width: '150px' }}>
                  <Search className={styles.icon} onClick={handleSearch} />
                  <input type='text' className={styles.formControl} placeholder='Buscar' onChange={handleInput} />
                </div>
                <FormControlLabel value='equals' control={<Radio />} label='Igual a' />
              </RadioGroup>
            </FormControl> */}
            <div className={`${styles.formGroup} ${styles.search}`} style={{ width: '150px' }}>
              <Search className={styles.icon} onClick={search} />
              <input
                autoFocus
                type='text'
                className={styles.formControl}
                placeholder='Buscar'
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                value={searchString}
              />
            </div>
          </div>
        </Popper>
      </ClickAwayListener>
    </>
  );
};
