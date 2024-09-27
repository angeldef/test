import { SyntheticEvent, forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type Props = {
  open: boolean;
  setOpen: Function;
  children: JSX.Element;
  duration?: number;
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='standard' {...props} />;
});

export function CustomSnackbar({ open, setOpen, children, duration }: Props) {
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={duration || 1500} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose}>{children}</Alert>
      </Snackbar>
    </Stack>
  );
}
