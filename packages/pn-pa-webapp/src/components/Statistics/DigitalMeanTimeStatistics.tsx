/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, Typography } from '@mui/material';
import { convertHoursToIntDays } from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { IDigitalMeanTimeStatistics } from '../../models/Statistics';

type Props = {
  data: IDigitalMeanTimeStatistics;
};

const DigitalMeanTimeStatistics: React.FC<Props> = ({ data }) => {
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
          show: true,
          title: t('save_as_image'),
          name: 'chart',
          backgroundColor: 'white',
          pixelRatio: 2,
          iconStyle: {
            borderColor: '#0055AA',
          },
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
        data: [
          {
            value: convertHoursToIntDays(data.delivered.time / data.delivered.count),
            itemStyle: {
              color: '#6BCFFB',
            },
          },
          {
            value: convertHoursToIntDays(data.viewed.time / data.viewed.count),
            itemStyle: {
              color: '#6CC66A',
            },
          },
          {
            value: convertHoursToIntDays(data.refined.time / data.refined.count),
            itemStyle: {
              color: '#5CA85A',
            },
          },
        ],
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
        <Typography sx={{ my: 3 }} variant="body2" color="text.primary">
          {t('digital_mean_time.description')}
        </Typography>
        <PnECharts option={option} />
      </Stack>
    </Paper>
  );
};

export default DigitalMeanTimeStatistics;
