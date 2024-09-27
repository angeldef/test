import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppTheme } from './core/theme';
import { AppRouter } from './core/routes';
import { AuthProvider } from './modules/auth';
import { es } from 'date-fns/locale';

function App() {
  return (
    <>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <AppTheme>
            <AppRouter />
          </AppTheme>
        </LocalizationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
