import { PetResDto } from '../types';
import List from '@mui/material/List';
import Box, { BoxProps } from '@mui/material/Box';
import { ReactComponent as GenderIcon } from '../icons/gender.svg';
import CakeIcon from '@mui/icons-material/Cake';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PaletteIcon from '@mui/icons-material/Palette';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  getGenderLabel,
  getPetPreviewAvatarBySpecies,
} from '../utils/formatter.utils';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AddUserIcon } from '../icons/add-user.svg';
import { ReactComponent as DeleteUserIcon } from '../icons/delete-user.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import { getAge, getUserDateFormat } from '../utils/date.utils';

type PetInfoProps = {
  pet: PetResDto;
  petActions: PetActionsProps;
} & CardProps;

const PetInfoCard = (props: PetInfoProps) => {
  const { pet, petActions, ...cardProps } = props;
  const {
    species,
    dateOfBirth,
    name,
    colour,
    notes,
    owners,
    weight,
    gender,
    breed,
  } = pet;
  const { t } = useTranslation();

  return (
    <Card {...cardProps}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Box display="flex">
          <Box minWidth="90px">{getPetPreviewAvatarBySpecies(species, 90)}</Box>
          <Box ml={2} flex={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">{name}</Typography>

              <PetActions
                display={{ xs: 'none', sm: 'block' }}
                {...petActions}
              />
            </Box>

            {!!dateOfBirth && (
              <Typography variant="subtitle1">{getAge(dateOfBirth)}</Typography>
            )}
            {!!breed && (
              <Typography variant="subtitle1">{breed.name}</Typography>
            )}
          </Box>
        </Box>
        <Box
          display={{ xs: 'flex', sm: 'none' }}
          justifyContent="center"
          alignItems="center"
          pt={1}
        >
          <PetActions {...petActions} />
        </Box>
      </CardContent>
      <CardContent sx={{ paddingTop: 0 }}>
        <List>
          <Grid container>
            <Grid item xs={12} sm={6} md={12} lg={6}>
              {Number.isInteger(gender) && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <GenderIcon width="40px" height="40px" />
                  </ListItemAvatar>

                  <ListItemText
                    primary={t('gender')}
                    secondary={getGenderLabel(gender!)}
                  />
                </ListItem>
              )}

              {!!dateOfBirth && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <CakeIcon sx={{ width: '40px', height: '40px' }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={t('birthday')}
                    secondary={DateTime.fromISO(dateOfBirth!).toFormat(
                      getUserDateFormat(),
                    )}
                  />
                </ListItem>
              )}

              {owners?.length && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <PeopleIcon sx={{ width: '40px', height: '40px' }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={t('owners')}
                    secondary={owners.map(({ name }) => name).join(', ')}
                  />
                </ListItem>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={12} lg={6}>
              {Number.isInteger(weight) && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <FitnessCenterIcon sx={{ width: '40px', height: '40px' }} />
                  </ListItemAvatar>
                  <ListItemText primary={t('weight')} secondary={weight} />
                </ListItem>
              )}

              {colour && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <PaletteIcon sx={{ width: '40px', height: '40px' }} />
                  </ListItemAvatar>
                  <ListItemText primary={t('color')} secondary={colour} />
                </ListItem>
              )}

              {notes && (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <DescriptionIcon sx={{ width: '40px', height: '40px' }} />
                  </ListItemAvatar>
                  <ListItemText primary={t('description')} secondary={notes} />
                </ListItem>
              )}
            </Grid>
          </Grid>
        </List>
      </CardContent>
    </Card>
  );
};

type PetActionsProps = {
  updatePetLink: string;
  onAddOwnerClick: () => void;
  onRemoveOwnerClick: () => void;
  onDeletePetClick: () => void;
} & BoxProps;

const PetActions = (props: PetActionsProps) => {
  const {
    updatePetLink,
    onAddOwnerClick,
    onRemoveOwnerClick,
    onDeletePetClick,
    display = 'flex',
    ...otherBoxProps
  } = props;
  const { t } = useTranslation();

  return (
    <Box display={display} {...otherBoxProps}>
      <Link
        component={RouterLink}
        to={updatePetLink}
        color="inherit"
        underline="none"
      >
        <Tooltip title={t('editPet').toString()}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Link>

      <Tooltip title={t('addOwner').toString()}>
        <IconButton onClick={onAddOwnerClick}>
          <AddUserIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('removeOwner').toString()}>
        <IconButton onClick={onRemoveOwnerClick}>
          <DeleteUserIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('deletePet').toString()}>
        <IconButton onClick={onDeletePetClick}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default PetInfoCard;
