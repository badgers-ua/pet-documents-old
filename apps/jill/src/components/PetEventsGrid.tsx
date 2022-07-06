import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getEventLabel, getEventOptions } from '../utils/factory.utils';
import { DropDownOption } from '../types';
import { EVENT, IEventResDto } from '@pdoc/types';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { GridColumns } from '@mui/x-data-grid/models/colDef/gridColDef';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import { DateTime } from 'luxon';
import { getUserDateFormat } from '../utils/date.utils';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';

type PetEventsGridProps = {
  petId: string;
  events: IEventResDto[];
  onEventDeleteClick: (event: IEventResDto) => void;
};

const PetEventsGrid = (props: PetEventsGridProps) => {
  const { events, petId, onEventDeleteClick } = props;

  console.log(events);

  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  console.log(data);

  const columns: GridColumns = [
    {
      field: 'event',
      headerName: 'Event',
      disableColumnMenu: true,
      flex: 2,
      valueGetter: ({ value }) => {
        return getEventLabel(value);
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'dateTime',
      disableColumnMenu: true,
      flex: 1,
      valueGetter: ({ value }) => {
        const formattedDate: string = DateTime.fromISO(value).toFormat(
          getUserDateFormat(),
        );
        return formattedDate;
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      disableColumnMenu: true,
      flex: 1,
      renderCell: ({ value }) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      },
    },
  ];

  const rows: GridRowsProp = events.map(
    ({ type, date, description, _id }: IEventResDto) => {
      return {
        id: _id,
        event: type,
        date,
        description,
      };
    },
  );

  const initialState: GridInitialStateCommunity = {};

  const gridData = { columns, rows, initialState };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        onRowClick={({ row }) => {
          console.log(row);
        }}
        {...gridData}
        hideFooter
        components={{ Toolbar }}
      />
    </div>
  );
};

export default PetEventsGrid;

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
    <Box m={1} display="flex" alignItems="flex-end">
      <FormControl size="small">
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
    </Box>
  );
};
