import 'typeface-roboto';
import './i18n';
import './index.css';
import './pwa';
import './wdyr';

import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalLinearProgress from './components/GlobalLinearProgress';
import useThemeLocal from './hooks/useThemeLocal';
import ApolloProviderLocal from './providers/ApolloProviderLocal';
import FirebaseProviderLocal from './providers/FirebaseProviderLocal';
import SnackbarProviderLocal from './providers/SnackbarProviderLocal';
import ActivePetProfileTabProvider from './providers/store/active-pet-profile-tab/ActivePetProfileTabProvider';
import LoaderStoreProvider from './providers/store/loader/LoaderStoreProvider';

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
