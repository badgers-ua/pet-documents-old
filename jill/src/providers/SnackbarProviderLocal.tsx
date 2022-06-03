import NotistackCloseButton from '../components/NotistackCloseButton';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import { Children } from '../types';

const SnackbarProviderLocal = ({ children }: Children) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      variant="error"
      autoHideDuration={3000}
      preventDuplicate
      action={(key: SnackbarKey) => (
        <NotistackCloseButton notificationKey={key} />
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarProviderLocal;
