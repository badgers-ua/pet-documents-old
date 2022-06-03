import './wdyr';
import './index.css';
import './pwa';
import 'typeface-roboto';
import './i18n';

import { createRoot } from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import ApolloProviderLocal from './providers/ApolloProviderLocal';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import GlobalLinearProgress from './components/GlobalLinearProgress';
import FirebaseProviderLocal from './providers/FirebaseProviderLocal';
import useThemeLocal from './hooks/useThemeLocal';
import SnackbarProviderLocal from './providers/SnackbarProviderLocal';
import LoaderStoreProvider from './providers/store/loader/LoaderStoreProvider';
import ActivePetProfileTabProvider from './providers/store/active-pet-profile-tab/ActivePetProfileTabProvider';

const Main = () => {
  const theme = useThemeLocal();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProviderLocal>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <FirebaseProviderLocal>
            <FirebaseProviderLocal>
              <ApolloProviderLocal>
                <LoaderStoreProvider>
                  <ActivePetProfileTabProvider>
                    <>
                      <GlobalLinearProgress />
                      <App />
                    </>
                  </ActivePetProfileTabProvider>
                </LoaderStoreProvider>
              </ApolloProviderLocal>
            </FirebaseProviderLocal>
          </FirebaseProviderLocal>
        </LocalizationProvider>
      </SnackbarProviderLocal>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root') as Element);

root.render(<Main />);
