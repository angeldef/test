import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

type SelectPeriodProp = {
  setPeriodSelected: Function;
  periodSelected?: string;
};

export const periodCatalog = [
  { label: 'Hoy', value: 'today' },
  { label: 'Esta semana', value: 'this_week' },
  { label: 'Este mes', value: 'this_month' },
  { label: 'Personalizado', value: 'custom' },
  { label: 'Todo', value: 'all' },
];

export const SelectPeriod = ({ periodSelected, setPeriodSelected }: SelectPeriodProp) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPeriodSelected(value);
  };

  return (
    <FormControl>
      <RadioGroup value={periodSelected} onChange={handleChange}>
        {periodCatalog.map((e, i) => (
          <FormControlLabel key={i} value={e.value} control={<Radio />} label={e.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
