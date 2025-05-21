/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Paper, Typography } from '@mui/material';
import { NotificationStatus, useIsMobile } from '@pagopa-pn/pn-commons';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { GraphColors, IFiledStatistics } from '../../models/Statistics';
import AggregateAndTrendStatistics, { AggregateAndTrendData } from './AggregateAndTrendStatistics';

type Props = {
  startDate: string;
  endDate: string;
  data: IFiledStatistics;
};

const FiledNotificationsStatistics: React.FC<Props> = ({
  startDate,
  endDate,
  data: statisticsData,
}) => {
  const { t } = useTranslation(['statistics']);

  const accepted = statisticsData[NotificationStatus.ACCEPTED];
  const refused = statisticsData[NotificationStatus.REFUSED];

  const acceptedText = t('filed.accepted');
  const refusedText = t('filed.refused');

  const acceptedSum = statisticsData[NotificationStatus.ACCEPTED].count;
  const refusedSum = statisticsData[NotificationStatus.REFUSED].count;

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
  const notificationsPercent =
    acceptedSum > 0 ? Math.floor((acceptedSum / (acceptedSum + refusedSum)) * 1000) / 10 : 0;

  const isMobile = useIsMobile();

  const direction = isMobile ? 'column' : 'row';
  const spacing = isMobile ? 3 : 0;

  const options: PnEChartsProps['option'] = {
    color: [GraphColors.blue, GraphColors.gold],
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="filedNotifications">
      <Grid container direction={direction} spacing={spacing}>
        <Grid item lg={5} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          <Typography variant="h6" component="h3">
            {t('filed.title')}
          </Typography>
          <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
            {t('filed.description')}
          </Typography>
          <Typography sx={{ fontSize: 50, fontWeight: 'bold' }} color={GraphColors.blue}>
            {notificationsAmount.toLocaleString()}
          </Typography>
          <Typography color={GraphColors.blue}>
            <b>{notificationsPercent.toLocaleString()}%</b> {t('filed.description2')}
          </Typography>
        </Grid>
        <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          <AggregateAndTrendStatistics
            startDate={startDate}
            endDate={endDate}
            data={data}
            options={options}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiledNotificationsStatistics;
