import React from 'react';
import usePetsAndUpcomingEventsGQL from '../hooks/api/usePetsAndUpcomingEventsGQL';
import { EventResDto } from '../types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import NavigationCard from '../components/NavigationCard';
import EventIcon from '@mui/icons-material/Event';
import { DateTime } from 'luxon';
import { getUserDateFormat } from '../utils/date.utils';
import { useTranslation } from 'react-i18next';
import { getEventLabel } from '../utils/factory.utils';

const EventListContainer = () => {
  const { todayEvents, upcomingEvents } = usePetsAndUpcomingEventsGQL();
  const { t } = useTranslation();

  return (
    <>
      {!!todayEvents.length && (
        <EventListGrid events={todayEvents} title={t('todayEvents')} />
      )}

      {!!upcomingEvents.length && (
        <EventListGrid events={upcomingEvents} title={t('upcomingEvents')} />
      )}
    </>
  );
};

interface EventsHomeGridProps {
  events: EventResDto[];
  title: string;
}

const EventListGrid = (props: EventsHomeGridProps) => {
  const { events, title } = props;

  return (
    <Box pt={2}>
      <Typography variant="h6">{title}</Typography>
      <Grid container spacing={2} pt={2}>
        {events.map(({ _id, petId, type, date, petName }: EventResDto) => (
          <Grid item xs={12} sm={6} md={4} key={_id}>
            {/* TODO: Ripple effect */}
            <Link
              component={RouterLink}
              to={`/update-event/${petId}/${_id}`}
              underline="none"
            >
              <NavigationCard
                avatar={<EventIcon />}
                title={petName}
                subTitle={
                  <>
                    {getEventLabel(type)}
                    <br />
                    <Box pt={1}>
                      {DateTime.fromISO(date).toFormat(getUserDateFormat())}
                    </Box>
                  </>
                }
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventListContainer;
