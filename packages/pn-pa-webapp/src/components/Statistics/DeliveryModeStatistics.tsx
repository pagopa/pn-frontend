/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, Typography } from '@mui/material';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { DeliveryMode, IDeliveryModeStatistics } from '../../models/Statistics';
import AggregateAndTrendStatistics, { AggregateAndTrendData } from './AggregateAndTrendStatistics';

type Props = {
  startDate: string;
  endDate: string;
  data: IDeliveryModeStatistics;
};

const DeliveryModeStatistics: React.FC<Props> = ({ startDate, endDate, data: statisticsData }) => {
  const digital = statisticsData[DeliveryMode.DIGITAL];
  const analog = statisticsData[DeliveryMode.ANALOG];

  const { t } = useTranslation(['statistics']);

  const digitalText = t('delivery_mode.digital');
  const analogText = t('delivery_mode.analog');

  const digitalSum = statisticsData[DeliveryMode.DIGITAL].count;
  const analogSum = statisticsData[DeliveryMode.ANALOG].count;

  const data: Array<AggregateAndTrendData> = [
    {
      title: digitalText,
      total: digitalSum,
      details: digital?.details,
    },
    {
      title: analogText,
      total: analogSum,
      details: analog?.details,
    },
  ];

  const options: PnEChartsProps['option'] = {
    color: ['#0055AA', '#21CDD1'],
  };

  return (
    <Paper sx={{ p: 3, mb: 3, height: '100%' }} elevation={0}>
      <Stack direction="column" height="100%" sx={{ display: 'flex' }}>
        <Typography variant="h6" component="h3">
          {t('delivery_mode.title')}
        </Typography>
        <Typography sx={{ my: 3 }} variant="body2" color="text.primary">
          {t('delivery_mode.description')}
        </Typography>
        <AggregateAndTrendStatistics
          startDate={startDate}
          endDate={endDate}
          data={data}
          options={options}
        />
      </Stack>
    </Paper>
  );
};

export default DeliveryModeStatistics;
