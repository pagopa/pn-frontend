/* eslint-disable functional/immutable-data */
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, Typography } from '@mui/material';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { ILastStateStatistics, NotificationStatus } from '../../models/Statistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: ILastStateStatistics;
};

const LastStateStatistics: React.FC<Props> = (props) => {
  const { t } = useTranslation(['statistics']);

  const statuses = [
    {
      value: props.data[NotificationStatus.DELIVERING],
      color: '#E0E0E0',
    },
    {
      value: props.data[NotificationStatus.DELIVERED],
      color: '#6BCFFB',
    },
    {
      value: props.data[NotificationStatus.VIEWED],
      color: '#6CC66A',
    },
    {
      value: props.data[NotificationStatus.EFFECTIVE_DATE],
      color: '#5CA85A',
    },
    {
      value: props.data[NotificationStatus.CANCELLED],
      color: '#FFCB46',
    },
    {
      value: props.data[NotificationStatus.UNREACHABLE],
      color: '#FE6666',
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
    <Paper sx={{ p: 3, mb: 3, height: '100%' }} elevation={0}>
      <Stack direction="column" height="100%" sx={{ display: 'flex' }}>
        <Typography variant="h6" component="h3">
          {t('last_state.title')}
        </Typography>
        <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
          {t('last_state.description')}
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

export default LastStateStatistics;
