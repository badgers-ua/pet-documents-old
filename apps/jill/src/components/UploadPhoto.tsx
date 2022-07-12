import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/system/Box';
import 'cropperjs/dist/cropper.css';
import { useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { useTranslation } from 'react-i18next';
import { dataURLtoFile } from '../utils/formatter.utils';
import './c.css';

type UploadPhotoProps = {
  initialPhoto?: File;
  onAvatarChange: (avatar: File) => void;
} & StackProps;

const Input = styled('input')({
  display: 'none',
});

const UploadPhoto = ({
  onAvatarChange,
  initialPhoto,
  ...stackProps
}: UploadPhotoProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [hover, setHover] = useState(false);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState('');
  const imageRef = useRef<ReactCropperElement>(null);
  const [cropper, setCropper] = useState<Cropper>();

  const { t } = useTranslation();

  useEffect(() => {
    if (!initialPhoto) {
      return;
    }
    readAsDataURL(initialPhoto);
  }, [initialPhoto]);

  const handleChange = (e: any) => {
    setOpenDialog(true);
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const [file] = files;
    readAsDataURL(file);
    e.target.value = '';
  };

  const readAsDataURL = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(file);
  };

  const getCropData = () => {
    if (typeof cropper === 'undefined') {
      return;
    }

    setOpenDialog(false);

    const croppedBase64: any = cropper.getCroppedCanvas().toDataURL();

    setCropData(croppedBase64);

    const croppedFile: File = dataURLtoFile(croppedBase64);

    onAvatarChange(croppedFile);
  };

  const handleDialogClose = () => {
    setImage(undefined);
    setCropData('');
    setOpenDialog(false);
  };

  return (
    <Stack {...stackProps}>
      <label htmlFor="icon-button-file">
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <Cropper
            style={{
              height: 320,
              width: 320,
            }}
            aspectRatio={1 / 1}
            preview=".img-preview"
            guides={true}
            src={image}
            ref={imageRef}
            checkOrientation={true}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
          <DialogActions>
            <Button onClick={handleDialogClose}>{t('cancel')}</Button>
            <Button onClick={getCropData}>{t('submit')}</Button>
          </DialogActions>
        </Dialog>
        {!!cropData && (
          <Box
            onMouseEnter={() => {
              if (hover) {
                return;
              }
              setHover(true);
            }}
            onMouseLeave={() => {
              if (!hover) {
                return;
              }
              setHover(false);
            }}
            sx={{
              width: stackProps.width + 'px',
              height: stackProps.height + 'px',
              position: 'relative',
              cursor: 'pinter',
            }}
          >
            <Avatar
              src={cropData}
              sx={{
                width: stackProps.width,
                height: stackProps.height,
                opacity: hover ? 0.3 : 1,
              }}
            ></Avatar>
            {hover && (
              <Tooltip title={t('uploadPhoto')} arrow>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  position="absolute"
                  left={0}
                  right={0}
                  top={0}
                  bottom={0}
                  m="auto"
                  sx={{ cursor: 'pointer' }}
                >
                  <PhotoCamera />
                </Box>
              </Tooltip>
            )}
          </Box>
        )}

        <>
          <Input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handleChange}
          />
          {!image && (
            <Tooltip title={t('uploadPhoto')} arrow>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </Tooltip>
          )}
        </>
      </label>
    </Stack>
  );
};

export default UploadPhoto;
