import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import React from 'react';
import { useLoaderStore } from '../providers/store/loader/LoaderStoreProvider';

const GlobalLinearProgress = () => {
  const { isLoading } = useLoaderStore();

  if (!isLoading) {
    return <></>;
  }

  return (
    <LinearProgress
      sx={{ position: 'fixed', left: 0, right: 0 }}
      className="global-linear-progress"
    />
  );
};

export default GlobalLinearProgress;
