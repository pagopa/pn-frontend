/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, Typography } from '@mui/material';
import { convertHoursToIntDays } from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { GraphColors, IDigitalMeanTimeStatistics } from '../../models/Statistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: IDigitalMeanTimeStatistics;
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
    value: convertHoursToIntDays(item.time / item.count),
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
        const elem = isArray(params) ? params[0] : params;
        const pos = elem.dataIndex ?? 0;
        const description = labels[pos].description;
        return `<div style="word-break: break-word;white-space: pre-wrap;">${
          elem.marker
        } ${description} <b>${elem.data.value.toLocaleString()}</b></div>`;
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpg',
          show: true,
          title: '',
          name: 'chart',
          backgroundColor: 'white',
          pixelRatio: 2,
          iconStyle: {
            color: GraphColors.navy,
          },
          icon: 'path://M4.16669 16.6667H15.8334V15H4.16669V16.6667ZM15.8334 7.5H12.5V2.5H7.50002V7.5H4.16669L10 13.3333L15.8334 7.5Z',
        },
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
    <Paper sx={{ p: 3, mb: 3, height: '100%' }} elevation={0}>
      <Stack direction="column" height="100%" sx={{ display: 'flex' }}>
        <Typography variant="h6" component="h3">
          {t('digital_mean_time.title')}
        </Typography>
        <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
          {t('digital_mean_time.description')}
        </Typography>
        {isEmpty ? (
          <EmptyStatistics description="empty.component_description" />
        ) : (
          <PnECharts option={option} />
        )}
      </Stack>
    </Paper>
  );
};

export default DigitalMeanTimeStatistics;
