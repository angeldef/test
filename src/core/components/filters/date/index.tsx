import { useEffect, useState } from 'react';
import { SelectPeriod, periodCatalog } from './select-period';
import { DateSelect } from './date-select';
import { isAfter } from 'date-fns';
import { RangeSelected } from '../bar';
import { formatDate } from '@/core/utils/functions';
import styles from './styles.module.scss';
import { ClickAwayListener, Popper } from '@mui/material';

type Props = {
  setRangeSelected: (range: RangeSelected) => void;
};

export const DateFilters = ({ setRangeSelected }: Props) => {
  const [openPeriod, setOpenPeriod] = useState(false);
  const [clickedPeriod, setClickedPeriod] = useState(false);
  const [anchorElPeriod, setAnchorElPeriod] = useState<null | HTMLElement>(null);
  const [periodSelected, setPeriodSelected] = useState<string>(periodCatalog[periodCatalog.length - 1].value);
  const { label: periodLabel } = periodCatalog.find((e) => e.value === periodSelected) ?? {};
  const [dateFrom, setDateFrom] = useState<Date | null>();
  const [dateTo, setDateTo] = useState<Date | null>();
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  useEffect(() => {
    periodSelected === 'custom' && setOpenPeriod(false);
  }, [periodSelected]);

  useEffect(() => {
    dateFrom && setOpenFrom(false);
    dateFrom && dateTo && isAfter(dateFrom, dateTo) && setDateTo(null);
  }, [dateFrom]);

  useEffect(() => {
    dateTo && setOpenTo(false);
  }, [dateTo]);

  useEffect(() => {
    if (periodSelected === 'custom' && (!dateFrom || !dateTo)) return;
    setRangeSelected({ period: periodSelected, from: dateFrom, to: dateTo });
  }, [periodSelected, dateFrom, dateTo]);

  const resetFilters = () => {
    setPeriodSelected('all');
    setClickedPeriod(false);
    setDateFrom(null);
    setDateTo(null);
    setOpenFrom(false);
    setOpenTo(false);
  };

  return (
    <>
      {periodSelected === 'custom' ? (
        <div className={styles.row}>
          <div className={styles.icon} onClick={() => resetFilters()}>
            <i className='fas fa-times'></i>
          </div>

          <div
            className={styles.box}
            onClick={() => {
              setOpenFrom(true);
            }}
          >
            <p className={styles.bold}>Desde:</p>
            <p>{dateFrom ? formatDate(dateFrom, 'dd/MM/yyyy') : 'DD/MM/AAAA'}</p>
            <DateSelect name='from' setValue={setDateFrom} open={openFrom} setOpen={setOpenFrom} />
          </div>

          <div
            className={styles.box}
            onClick={() => {
              dateFrom && setOpenTo(true);
            }}
          >
            <p className={styles.bold}>Hasta:</p>
            <p>{dateTo ? formatDate(dateTo, 'dd/MM/yyyy') : 'DD/MM/AAAA'}</p>
            <DateSelect name='to' setValue={setDateTo} open={openTo} setOpen={setOpenTo} minDate={dateFrom} />
          </div>
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.icon}>
            <i className='far fa-calendar-alt'></i>
          </div>
          <div
            className={styles.box}
            onClick={(e) => {
              setAnchorElPeriod(e.currentTarget);
              setOpenPeriod(true);
            }}
          >
            <p className={styles.bold}>Período:</p>
            <p>{periodLabel}</p>
          </div>
        </div>
      )}

      <ClickAwayListener
        onClickAway={() => {
          if (!clickedPeriod) {
            setClickedPeriod(true);
          } else {
            setOpenPeriod(false);
            setAnchorElPeriod(null);
            setClickedPeriod(false);
          }
        }}
      >
        <Popper sx={{ zIndex: 1000 }} open={openPeriod} anchorEl={anchorElPeriod}>
          <div className={styles.popper}>
            <SelectPeriod periodSelected={periodSelected} setPeriodSelected={setPeriodSelected} />
          </div>
        </Popper>
      </ClickAwayListener>
    </>
  );
};
