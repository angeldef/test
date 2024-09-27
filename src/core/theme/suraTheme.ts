import { createTheme } from '@mui/material';
import { esES } from '@mui/material/locale';
import { red } from '@mui/material/colors';

export const suraTheme = createTheme(
  {
    palette: {
      primary: {
        main: '#e3e829',
        contrastText: '#0033a0',
      },
      secondary: {
        main: '#0033a0',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: ['Arial'].join(','),
      fontSize: 12,
      allVariants: {
        color: '#707070',
      },
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  },
  esES
);
