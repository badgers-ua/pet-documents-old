import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { EVENT, IEventResDto } from '@pdoc/types';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropDownOption } from '../types';
import { getUserDateFormat, isPast } from '../utils/date.utils';
import { getEventLabel, getEventOptions } from '../utils/factory.utils';

type PetEventsGridProps = {
  petId: string;
  events: IEventResDto[];
  onEventDeleteClick: (event: IEventResDto) => void;
};

const PetEventListContainer = (props: PetEventsGridProps) => {
  const { events, petId, onEventDeleteClick } = props;
  const { t } = useTranslation();
  console.log(events);

  return (
    <Box>
      <Toolbar />
      <Stack spacing={2}>
        {events.map(({ type, date, _id, description }) => {
          const isPastEvent: boolean = isPast(date);

          return (
            <Card key={_id} variant={isPastEvent ? 'outlined' : 'elevation'}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {getEventLabel(type)}
                </Typography>
                <Typography variant="subtitle1">
                  {DateTime.fromISO(date).toFormat(getUserDateFormat())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title={t('editEvent').toString()}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('deleteEvent').toString()}>
                  <IconButton onClick={() => {}}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('addToCalendar').toString()}>
                  <IconButton>
                    <EventIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

const eventTypes: DropDownOption<EVENT | string>[] = [
  { label: 'All', value: 'all' },
  ...getEventOptions,
];

const Toolbar = () => {
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedEventType(event.target.value);
  };

  return (
    <Stack mb={2}>
      <Box mb={2} display="flex" alignItems="flex-end">
        <Stack spacing={2} direction="row" flex={1}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              label="Event Type"
              labelId="event-type-label"
              id="event-type-select"
              value={selectedEventType}
              onChange={handleChange}
            >
              {eventTypes.map(({ label, value }) => {
                return (
                  <MenuItem value={value} key={label}>
                    {value === 'all' ? <em>{label}</em> : label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel id="sort-label">Sorting</InputLabel>
            <Select label="Sorting" labelId="sort-label" id="sort-select">
              <MenuItem>ASC</MenuItem>
              <MenuItem>DESC</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <FormControl component="fieldset" size="small" sx={{ flex: 1 }}>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="end"
            control={<Switch color="primary" />}
            label="Show upcoming"
            labelPlacement="end"
          />
        </FormGroup>
      </FormControl>
    </Stack>
  );
};

export default PetEventListContainer;
