/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, SxProps, Typography } from '@mui/material';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { GraphColors, IDigitalStateStatistics, ResponseStatus } from '../../models/Statistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: IDigitalStateStatistics;
  sx?: SxProps;
};

const DigitalStateStatistics: React.FC<Props> = (props) => {
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

  const statuses = [
    {
      value: props.data[ResponseStatus.OK],
      color: GraphColors.blue,
    },
    {
      value: props.data[ResponseStatus.KO],
      color: GraphColors.azure,
    },
    {
      value: props.data[ResponseStatus.PROGRESS],
      color: GraphColors.lightGrey,
    },
  ];

  const data = statuses.map((item) => ({
    value: item.value,
    itemStyle: {
      color: item.color,
    },
  }));

  const isEmpty = !data.find((item) => item.value > 0);

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
      data: [t('digital_state.ok'), t('digital_state.ko'), t('digital_state.progress')],
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
    <Paper sx={{ ...props.sx, p: 3, mb: 3 }} elevation={0}>
      <Typography variant="h6" component="h3">
        {t('digital_state.title')}
      </Typography>
      <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
        {t('digital_state.description')}
      </Typography>
      {isEmpty ? <EmptyStatistics /> : <PnECharts option={option} style={{ height: '400px' }} />}
    </Paper>
  );
};

export default DigitalStateStatistics;
