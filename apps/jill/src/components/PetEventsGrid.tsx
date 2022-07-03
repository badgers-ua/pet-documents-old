import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getEventLabel } from '../utils/factory.utils';
import { EVENT } from '@pdoc/types';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const PetEventsGrid = (props: any) => {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid {...data} components={{ Toolbar: Toolbar }} />
    </div>
  );
};

export default PetEventsGrid;

const Toolbar = () => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
      {Object.values(EVENT)
        .filter((v: string | number) => Number.isInteger(v))
        .map((e: any) => {
          return <Tab key={e} label={getEventLabel(e)} />;
        })}
    </Tabs>
  );
};
