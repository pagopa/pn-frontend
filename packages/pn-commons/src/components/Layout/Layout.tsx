import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import React from 'react';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';

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
    minHeight: 'calc(100vh - 327px)'
  },
})); 

export default function Layout({ children, assistanceEmail, onExitAction, sideMenu }: Props) {
  const classes = useStyles();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header withSecondHeader={true} onExitAction={onExitAction} />
      <Grid role={'navigation'} container spacing={2} className={classes.root}>
        <Grid item xs={2}>
          {sideMenu}
        </Grid>
        <Grid item xs={10}>{children}</Grid>
      </Grid>
      <Footer assistanceEmail={assistanceEmail} />
    </Box>
  );
}
