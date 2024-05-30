/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, Typography } from '@mui/material';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { IDigitalStateStatistics, ResponseStatus } from '../../models/Statistics';

type Props = {
  data: IDigitalStateStatistics;
};

const DigitalStateStatistics: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation(['statistics']);

  const labels = [
    {
      title: t('digital_state.ok_title'),
      description: t('digital_state.ok_description'),
    },
    {
      title: t('digital_state.ko_title'),
      description: t('digital_state.ko_description'),
    },
    {
      title: t('digital_state.progress_title'),
      description: t('digital_state.progress_description'),
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
        const title = labels[pos].title;
        const description = labels[pos].description;
        return `<div style=" max-width: 200px; word-break: break-word; white-space: pre-wrap; text-align: center;">${
          elem.marker
        } <b>${title}: ${elem.data.value.toLocaleString()}</b><br />${description}</div>`;
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
      data: [t('digital_state.ok'), t('digital_state.ko'), t('digital_state.progress')],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [
          {
            value: data[ResponseStatus.OK],
            itemStyle: {
              color: '#0055AA',
            },
          },
          {
            value: data[ResponseStatus.KO],
            itemStyle: {
              color: '#00C5CA',
            },
          },
          {
            value: data[ResponseStatus.PROGRESS],
            itemStyle: {
              color: '#E0E0E0',
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
          {t('digital_state.title')}
        </Typography>
        <Typography sx={{ my: 3 }} variant="body2" color="text.primary">
          {t('digital_state.description')}
        </Typography>
        <PnECharts option={option} />
      </Stack>
    </Paper>
  );
};

export default DigitalStateStatistics;
