import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import NavigationCard from '../components/NavigationCard';
import { getPetPreviewAvatarBySpecies } from '../utils/formatter.utils';
import { getAge } from '../utils/date.utils';
import usePetsAndUpcomingEventsGQL from '../hooks/api/usePetsAndUpcomingEventsGQL';
import { useTranslation } from 'react-i18next';
import { IPetPreviewResDto } from '@pdoc/types';

const PetListContainer = () => {
  const { pets } = usePetsAndUpcomingEventsGQL();

  const { t } = useTranslation();

  return (
    <>
      {!!pets.length && (
        <Box pt={2}>
          <Typography variant="h6">{t('pets')}</Typography>
          <Grid container spacing={2} pt={2}>
            {pets.map(
              ({ _id, species, name, dateOfBirth }: IPetPreviewResDto) => (
                <Grid item xs={12} sm={6} md={4} key={_id}>
                  {/* TODO: Ripple effect */}
                  <Link
                    component={RouterLink}
                    to={`/pet/${_id}`}
                    underline="none"
                  >
                    <NavigationCard
                      avatar={getPetPreviewAvatarBySpecies(species)}
                      title={name}
                      subTitle={getAge(dateOfBirth ?? '')}
                    />
                  </Link>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default PetListContainer;
