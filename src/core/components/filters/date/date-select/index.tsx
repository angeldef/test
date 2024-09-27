import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';

type Props = {
  name: string;
  setValue: Function;
  open: boolean;
  setOpen: Function;
  minDate?: Date | null;
  maxDate?: Date | null;
};

export const DateSelect = ({ name, setValue, open, setOpen, minDate, maxDate }: Props) => {
  const { control } = useForm({
    mode: 'all',
  });

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { ref, onBlur, name, value = null, ...field } }) => (
          <DatePicker
            {...field}
            open={open}
            minDate={minDate}
            maxDate={maxDate}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={(e) => setValue(e)}
            value={value}
            inputRef={ref}
            inputFormat='dd/MM/yyyy'
            renderInput={(params) => <TextField {...params} name={name} style={{ visibility: 'hidden', position: 'absolute', top: 15 }} />}
          />
        )}
      />
    </>
  );
};
