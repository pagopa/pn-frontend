/* eslint-disable functional/immutable-data */
import * as _ from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, SxProps, Typography } from '@mui/material';
import { convertHoursToDays } from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { GraphColors, IDigitalMeanTimeStatistics } from '../../models/Statistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: IDigitalMeanTimeStatistics;
  sx?: SxProps;
};

const DigitalMeanTimeStatistics: React.FC<Props> = (props) => {
  const { t } = useTranslation(['statistics']);

  const labels = [
    {
      description: t('digital_mean_time.delivered_description'),
    },
    {
      description: t('digital_mean_time.viewed_description'),
    },
    {
      description: t('digital_mean_time.refined_description'),
    },
  ];

  const statuses = [
    {
      time: props.data.delivered.time,
      count: props.data.delivered.count,
      color: GraphColors.lightBlue,
    },
    {
      time: props.data.viewed.time,
      count: props.data.viewed.count,
      color: GraphColors.lightGreen,
    },
    {
      time: props.data.refined.time,
      count: props.data.refined.count,
      color: GraphColors.darkGreen,
    },
  ];

  const data = statuses.map((item) => ({
    value: convertHoursToDays(item.time / item.count),
    itemStyle: {
      color: item.color,
    },
  }));

  const isEmpty = !statuses.find((item) => item.count > 0);

  const option: PnEChartsProps['option'] = {
    tooltip: {
      trigger: 'axis',
      show: true,
      confine: true,
      formatter: (params) => {
        const elem = (_.isArray(params) ? params[0] : params) as {
          dataIndex: number;
          marker: string;
          name: string;
          data: { value: number };
        };
        const pos = elem.dataIndex ?? 0;
        const description = labels[pos].description;
        return `<div style="word-break: break-word;white-space: pre-wrap;">${
          elem.marker
        } ${description} <b>${elem.data.value.toLocaleString()}</b></div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    xAxis: {
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 45,
        lineHeight: 20,
        margin: 40,
        // fontSize: '0.8em',
      },
      type: 'category',
      data: [
        t('digital_mean_time.delivered'),
        t('digital_mean_time.viewed'),
        t('digital_mean_time.refined'),
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data,
        type: 'bar',
      },
    ],
  };

  return (
    <Paper sx={{ ...props.sx, p: 3, mb: 3 }} elevation={0} data-testid="digitalMeanTimeContainer">
      <Typography variant="h6" component="h3">
        {t('digital_mean_time.title')}
      </Typography>
      <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
        {t('digital_mean_time.description')}
      </Typography>
      {isEmpty ? (
        <EmptyStatistics />
      ) : (
        <PnECharts option={option} style={{ height: '400px' }} dataTestId="digitalMeanTime" />
      )}
    </Paper>
  );
};

export default DigitalMeanTimeStatistics;
