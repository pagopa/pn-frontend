import React from 'react';

import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

// import theme from './senderDashboard';

const FiledNotificationsStatistics: React.FC = () => {
  const title = 'Notifiche depositate';
  const description =
    'Numero di nofifiche che sono state accettate dalla piattaforma SEND sul totale delle notifiche caricate';
  const notificationsAmount = '11.560';
  const notificationsPercent = '69,5%';
  const textPercent = notificationsPercent + ' del totale delle notifihe caricate su SEND';

  const isMobile = useIsMobile();

  const option: PnEChartsProps['option'] = {
    tooltip: {
      trigger: 'item',
    },
    /* legend: {
      top: '5%',
      left: 'center',
    }, */
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['60%', '100%'],
        center: ['50%', '90%'],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        data: [
          { value: 11560, name: 'Notifiche Depositate' },
          { value: 9073, name: 'Notifiche non Depositate' },
          /*  { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }, */
        ],
      },
    ],
    color: ['#0073e6', '#cccccc'], // customize color to override autoselection from theme palette
  };

  const direction = isMobile ? 'column' : 'row';
  const spacing = isMobile ? 3 : 0;
  return (
    // <Grid container direction={direction} spacing={spacing}>
    <Stack spacing={3}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
        <Grid container direction={direction} spacing={spacing}>
          <Grid item lg={5} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Typography sx={{ mt: 0.5 }} variant="body2" color="text.primary">
              {description}
            </Typography>
            <Typography sx={{ fontSize: 50, fontWeight: 'bold' }} color="royalblue">
              {notificationsAmount}
            </Typography>
            <Typography color="royalblue">{textPercent}</Typography>
          </Grid>
          <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 }, minHeight: '400px' }}>
            <PnECharts option={option} />
          </Grid>
        </Grid>
      </Paper>
    </Stack>
    // </Grid>
  );
};

export default FiledNotificationsStatistics;
