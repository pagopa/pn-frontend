import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

type Props = {
  children?: React.ReactNode;
  /** Assistance email for the user */
  assistanceEmail?: string;
  /** Logout/exit action to apply */
  onExitAction?: (() => void) | null;
};

export default function Layout({ children, assistanceEmail, onExitAction }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* <Header withSecondHeader={!!party} subHeaderChild={party && <DashboardMenuContainer />} /> */}
      <Header withSecondHeader={true} onExitAction={onExitAction} />

      <Grid container direction="row" flexGrow={1}>
        {children}
      </Grid>
      <Footer assistanceEmail={assistanceEmail} />
    </Box>
  );
}
