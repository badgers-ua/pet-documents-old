import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import HeaderContainer from './containers/HeaderContainer';
import { Children } from './types';
import { useUser } from 'reactfire';
import RoutesLocal from './RoutesLocal';
import useSetLoadingStatus from './hooks/useSetLoadingStatus';

const App = () => {
  const theme: any = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppGuard>
      <Router>
        <HeaderContainer />
        <Box pt={`${isXs ? '56px' : '64px'}`}>
          <Container maxWidth="lg">
            <RoutesLocal />
          </Container>
        </Box>
      </Router>
    </AppGuard>
  );
};

const AppGuard = ({ children }: Children) => {
  const { status: userStatus } = useUser();
  const isLoading: boolean = userStatus === 'loading';

  useSetLoadingStatus({ isLoading });

  if (isLoading) {
    return <></>;
  }

  return children;
};

export default App;
