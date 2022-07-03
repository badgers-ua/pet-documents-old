import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DateTime } from 'luxon';
import Card, { CardProps } from '@mui/material/Card';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import { addEventToCalendar } from '../utils/calendar.utils';
import styled from '@mui/material/styles/styled';
import useTheme from '@mui/material/styles/useTheme';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import sortBy from 'lodash/sortBy';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getUserDateFormat } from '../utils/date.utils';
import { getEventLabel } from '../utils/factory.utils';
import { IEventResDto } from '@pdoc/types';

type PetEventsCardProps = {
  petId: string;
} & CollapsibleTableProps &
  CardProps;

const EventsCardContent = styled(CardContent)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const EventsCardHeader = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const PetEventsCard = (props: PetEventsCardProps) => {
  const { events, petId, onEventDeleteClick, ...cardProps } = props;
  const [filteredEvents, setFilteredEvents] = useState<IEventResDto[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    setFilteredEvents(sortBy(events, 'date'));
  }, [events]);

  const handleSearchEvent = (val: string) => {
    const filteredEvents: IEventResDto[] = events.filter(
      ({ date, description, type }) => {
        const descriptionMatched: boolean = (description ?? '')
          .toLowerCase()
          .includes(val.toLowerCase());
        const dateMatched: boolean = DateTime.fromISO(date)
          .toFormat(getUserDateFormat())
          .toLowerCase()
          .includes(val.toLowerCase());
        const typeMatched: boolean = getEventLabel(type)
          .toLowerCase()
          .includes(val.toLowerCase());
        return descriptionMatched || dateMatched || typeMatched;
      },
    );
    setFilteredEvents(filteredEvents);
  };

  return (
    <Card {...cardProps}>
      <EventsCardContent>
        <EventsCardHeader>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6}>
              <Box display="flex" justifyContent="space-between" flex={1}>
                <Typography variant="h5">{t('events')}</Typography>

                <Box>
                  <Link
                    component={RouterLink}
                    to={`/create-event/${petId}`}
                    color="inherit"
                    underline="none"
                  >
                    <Tooltip title={t('createEvent').toString()}>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={t('search')}
                onChange={(event) => {
                  handleSearchEvent(event.target.value);
                }}
              />
            </Grid>
          </Grid>
        </EventsCardHeader>

        <Box>
          <CollapsibleTable
            events={filteredEvents}
            onEventDeleteClick={onEventDeleteClick}
          />
        </Box>
      </EventsCardContent>
    </Card>
  );
};

export default PetEventsCard;

type RowProps = {
  event: IEventResDto;
  onEventDeleteClick: (event: IEventResDto) => void;
};

const Row = (props: RowProps) => {
  const { event, onEventDeleteClick } = props;
  const { type, date, description, _id, petId, petName } = event;

  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const theme: any = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const formattedDate: string = DateTime.fromISO(date).toFormat(
    getUserDateFormat(),
  );

  const dateAndMonth: string = formattedDate.split('/').splice(0, 2).join('/');
  const year: string = formattedDate.split('/')[2];

  const addToCalendar = () => {
    addEventToCalendar({
      petName,
      eventName: getEventLabel(type),
      eventDescription: description,
      eventDate: date,
    });
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset !important' } }}>
        <TableCell sx={{ width: '66px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          padding={isXs ? 'none' : 'normal'}
        >
          {getEventLabel(type)}
        </TableCell>
        <TableCell align="left">
          <Box display={{ xs: 'none', sm: 'flex' }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Box>{dateAndMonth}</Box>
              <Box>{year}</Box>
            </Box>
          </Box>

          <Box display={{ xs: 'block', sm: 'none' }}>{formattedDate}</Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" gutterBottom component="div">
                  {t('description')}
                </Typography>
                <Box>
                  <Tooltip title={t('addToCalendar').toString()}>
                    <IconButton onClick={addToCalendar}>
                      <EventIcon />
                    </IconButton>
                  </Tooltip>

                  <Link
                    component={RouterLink}
                    to={`/update-event/${petId}/${_id}`}
                    color="inherit"
                    underline="none"
                  >
                    <Tooltip title={t('editEvent').toString()}>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>

                  <Tooltip title={t('deleteEvent').toString()}>
                    <IconButton onClick={() => onEventDeleteClick(event)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {description}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

type CollapsibleTableProps = {
  events: IEventResDto[];
  onEventDeleteClick: (event: IEventResDto) => void;
};

const CollapsibleTable = (props: CollapsibleTableProps) => {
  const { events, onEventDeleteClick } = props;
  const { t } = useTranslation();
  const theme: any = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  if (!events.length) {
    return (
      <Box flex={1} display="flex" justifyContent="center" pt={3}>
        {t('noEvents')}
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell padding={isXs ? 'none' : 'normal'}>
              {t('event')}
            </TableCell>
            <TableCell align="left">{t('date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event: IEventResDto) => (
            <Row
              key={event._id}
              event={event}
              onEventDeleteClick={onEventDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
