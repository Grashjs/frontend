import { useLocation, useRoutes } from 'react-router-dom';
import router from 'src/router';

import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import AppInit from './components/AppInit';
import { CustomSnackBarProvider } from './contexts/CustomSnackBarContext';
import ReactGA from 'react-ga';
import { googleTrackingId, IS_LOCALHOST } from './config';
import { useEffect } from 'react';

ReactGA.initialize(googleTrackingId);
function App() {
  const content = useRoutes(router);
  const auth = useAuth();
  let location = useLocation();
  useEffect(() => {
    if (!IS_LOCALHOST) ReactGA.pageview(location.pathname + location.search);
  }, [location]);
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CustomSnackBarProvider>
            <CssBaseline />
            {auth.isInitialized ? content : <AppInit />}
          </CustomSnackBarProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
