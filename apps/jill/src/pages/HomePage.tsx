import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import usePetsAndUpcomingEventsGQL from '../hooks/api/usePetsAndUpcomingEventsGQL';
import useSetLoadingStatus from '../hooks/useSetLoadingStatus';
import PetListContainer from '../containers/PetListContainer';
import EventListContainer from '../containers/EventListContainer';

const HomePage = () => {
  const { pets, todayEvents, upcomingEvents, isLoading } =
    usePetsAndUpcomingEventsGQL();

  useSetLoadingStatus({ isLoading });

  const { t } = useTranslation();

  if (!pets.length && !todayEvents.length! && upcomingEvents.length) {
    return <></>;
  }

  return (
    <>
      <Box>
        <PetListContainer />
        <EventListContainer />
        <Link
          sx={{
            position: 'fixed',
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          }}
          component={RouterLink}
          to={'/create-pet'}
          color="inherit"
          underline="none"
        >
          <Tooltip title={t('createPet').toString()}>
            <Fab color="secondary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </Box>
    </>
  );
};

export default HomePage;
