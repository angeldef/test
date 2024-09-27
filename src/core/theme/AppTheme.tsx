import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { suraTheme } from './';

interface Props {
  children: React.ReactNode;
}

export const AppTheme = ({ children }: Props) => {
  return (
    <ThemeProvider theme={suraTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
