/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { IFiledStatistics, NotificationStatus } from '../../models/Statistics';
import AggregateAndTrendStatistics, { AggregateAndTrendData } from './AggregateAndTrendStatistics';

type Props = {
  startDate: string;
  endDate: string;
  data?: IFiledStatistics;
};

const FiledNotificationsStatistics: React.FC<Props> = ({
  startDate,
  endDate,
  data: statisticsData,
}) => {
  const { t } = useTranslation(['statistics']);

  const accepted = statisticsData?.[NotificationStatus.ACCEPTED];
  const refused = statisticsData?.[NotificationStatus.REFUSED];

  const acceptedText = t('filed.accepted');
  const refusedText = t('filed.refused');

  const acceptedSum = statisticsData ? statisticsData[NotificationStatus.ACCEPTED].count : 0;
  const refusedSum = statisticsData ? statisticsData[NotificationStatus.REFUSED].count : 0;

  const data: Array<AggregateAndTrendData> = [
    {
      title: acceptedText,
      total: acceptedSum,
      details: accepted?.details,
    },
    {
      title: refusedText,
      total: refusedSum,
      details: refused?.details,
    },
  ];

  const notificationsAmount = acceptedSum;
  const notificationsPercent = Math.floor((acceptedSum / (acceptedSum + refusedSum)) * 100) / 100;

  const isMobile = useIsMobile();

  const direction = isMobile ? 'column' : 'row';
  const spacing = isMobile ? 3 : 0;

  const options: PnEChartsProps['option'] = {
    color: ['#0073E6', '#E0E0E0'],
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
        <Grid container direction={direction} spacing={spacing}>
          <Grid item lg={5} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
            <Typography variant="h6" component="h3">
              {t('filed.title')}
            </Typography>
            <Typography sx={{ my: 3 }} variant="body2" color="text.primary">
              {t('filed.description')}
            </Typography>
            <Typography sx={{ fontSize: 50, fontWeight: 'bold' }} color="royalblue">
              {notificationsAmount.toLocaleString()}
            </Typography>
            <Typography color="royalblue">
              {t('filed.description2', { percent: notificationsPercent })}
            </Typography>
          </Grid>
          <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 }, minHeight: '500px' }}>
            <AggregateAndTrendStatistics
              startDate={startDate}
              endDate={endDate}
              data={data}
              options={options}
            />
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default FiledNotificationsStatistics;
