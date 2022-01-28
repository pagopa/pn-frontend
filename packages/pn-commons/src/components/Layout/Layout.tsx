import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

type Props = {
  children?: React.ReactNode;
  assistanceEmail?: string;
};

export default function Layout({ children, assistanceEmail }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* <Header withSecondHeader={!!party} subHeaderChild={party && <DashboardMenuContainer />} /> */}
      <Header withSecondHeader={true} />

      <Grid container direction="row" flexGrow={1}>
        {children}
      </Grid>
      <Footer assistanceEmail={assistanceEmail} />
    </Box>
  );
}
