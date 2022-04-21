import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import React from 'react';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  children?: React.ReactNode;
  /** Assistance email for the user */
  assistanceEmail?: string;
  /** Logout/exit action to apply */
  onExitAction?: (() => void) | null;
  /** Side Menu */
  sideMenu?: React.ReactElement;
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    background: '#F2F2F2',

    '& > .MuiGrid-item:last-child': {
      minHeight: 'calc(100vh - 327px)',
    },
  },
}));

export default function Layout({ children, assistanceEmail, onExitAction, sideMenu }: Props) {
  const classes = useStyles();
  return (
    <ErrorBoundary sx={{height: '100vh'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header withSecondHeader={true} onExitAction={onExitAction} data-testid="header" />
        <Grid role={'navigation'} container spacing={2} direction="row" className={classes.root}>
          <Grid item lg={2} xs={12} container direction="column">
            {sideMenu}
          </Grid>
          <Grid item lg={10} xs={12} container direction="column">
            <ErrorBoundary>{children}</ErrorBoundary>
          </Grid>
        </Grid>
        <Footer assistanceEmail={assistanceEmail} />
      </Box>
    </ErrorBoundary>
  );
}
