/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, SxProps, Typography } from '@mui/material';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import {
  GraphColors,
  IDeliveryModeStatistics,
  StatisticsDeliveryMode,
} from '../../models/Statistics';
import AggregateAndTrendStatistics, { AggregateAndTrendData } from './AggregateAndTrendStatistics';

type Props = {
  startDate: string;
  endDate: string;
  data: IDeliveryModeStatistics;
  sx?: SxProps;
};

const DeliveryModeStatistics: React.FC<Props> = ({
  startDate,
  endDate,
  data: statisticsData,
  sx,
}) => {
  const digital = statisticsData[StatisticsDeliveryMode.DIGITAL];
  const analog = statisticsData[StatisticsDeliveryMode.ANALOG];

  const { t } = useTranslation(['statistics']);

  const digitalText = t('delivery_mode.digital');
  const analogText = t('delivery_mode.analog');

  const digitalSum = statisticsData[StatisticsDeliveryMode.DIGITAL].count;
  const analogSum = statisticsData[StatisticsDeliveryMode.ANALOG].count;

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
    color: [GraphColors.blue, GraphColors.turquoise],
  };

  return (
    <Paper sx={{ ...sx, p: 3, mb: 3 }} elevation={0} data-testid="deliveryMode">
      <Typography variant="h6" component="h3">
        {t('delivery_mode.title')}
      </Typography>
      <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
        {t('delivery_mode.description')}
      </Typography>
      <AggregateAndTrendStatistics
        startDate={startDate}
        endDate={endDate}
        data={data}
        options={options}
      />
    </Paper>
  );
};

export default DeliveryModeStatistics;
