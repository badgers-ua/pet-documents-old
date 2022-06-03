import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarKey, useSnackbar } from 'notistack';

export type NotistackCloseButtonProps = {
  notificationKey: SnackbarKey;
};

const NotistackCloseButton = ({
  notificationKey,
}: NotistackCloseButtonProps) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      onClick={() => {
        closeSnackbar(notificationKey);
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default NotistackCloseButton;
