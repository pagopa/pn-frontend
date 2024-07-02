/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, SxProps, Typography } from '@mui/material';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { GraphColors, ILastStateStatistics, NotificationStatus } from '../../models/Statistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: ILastStateStatistics;
  sx?: SxProps;
};

const LastStateStatistics: React.FC<Props> = (props) => {
  const { t } = useTranslation(['statistics']);

  const statuses = [
    {
      value: props.data[NotificationStatus.DELIVERING],
      color: GraphColors.lightGrey,
    },
    {
      value: props.data[NotificationStatus.DELIVERED],
      color: GraphColors.lightBlue,
    },
    {
      value: props.data[NotificationStatus.VIEWED],
      color: GraphColors.lightGreen,
    },
    {
      value: props.data[NotificationStatus.EFFECTIVE_DATE],
      color: GraphColors.darkGreen,
    },
    {
      value: props.data[NotificationStatus.CANCELLED],
      color: GraphColors.gold,
    },
    {
      value: props.data[NotificationStatus.UNREACHABLE],
      color: GraphColors.lightRed,
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
      formatter: (params) => {
        const elem = isArray(params) ? params[0] : params;
        return `<div style="word-break: break-word;white-space: pre-wrap;">${elem.marker}${
          elem.name
        } <b>${elem.data.value.toLocaleString()}</b>
        </div>`;
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
      },
      type: 'category',
      data: [
        t('last_state.delivering'),
        t('last_state.delivered'),
        t('last_state.viewed'),
        t('last_state.effective_date'),
        t('last_state.canceled'),
        t('last_state.unreachable'),
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
    <Paper sx={{ ...props.sx, p: 3, mb: 3 }} elevation={0}>
      <Typography variant="h6" component="h3">
        {t('last_state.title')}
      </Typography>
      <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
        {t('last_state.description')}
      </Typography>
      {isEmpty ? <EmptyStatistics /> : <PnECharts option={option} style={{ height: '400px' }} />}
    </Paper>
  );
};

export default LastStateStatistics;
