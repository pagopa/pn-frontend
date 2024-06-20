/* eslint-disable functional/immutable-data */
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PieIcon from '@mui/icons-material/PieChart';
import StackedIcon from '@mui/icons-material/StackedLineChart';
import { Box, Chip, InputAdornment, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { IStatisticsDailySummary, Timeframe } from '../../models/Statistics';
import AggregateStatistics, { AggregateDataItem } from './AggregateStatistics';
import EmptyStatistics from './EmptyStatistics';
import TrendStackedStatistics, { TrendDataItem } from './TrendStackedStatistics';

enum GraphTypes {
  AGGREGATE = 'Aggregate',
  TREND = 'Trend',
}

export type AggregateAndTrendData = {
  title: string;
  total: number;
  details: Array<IStatisticsDailySummary> | undefined;
};

type Props = {
  startDate: string;
  endDate: string;
  data?: Array<AggregateAndTrendData>;
  options?: PnEChartsProps['option'];
};

/**
 * This component is responsible for showing an Aggregate or a TrendStacked Statistics component
 * depending on user selection
 *
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} data
 * @param {*} options
 * @returns {*}
 */
const AggregateAndTrendStatistics: React.FC<Props> = ({ startDate, endDate, data, options }) => {
  const [graphType, setGraphType] = useState<GraphTypes>(GraphTypes.AGGREGATE);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.weekly);

  const { t } = useTranslation(['statistics']);

  const aggregateData: Array<AggregateDataItem> = [];
  const trendData: Array<TrendDataItem> = [];

  data?.forEach((item) => {
    aggregateData.push({ title: item.title, value: item.total });
    trendData.push({ title: item.title, values: item.details });
  });

  const isMobile = useIsMobile();

  const handleChangeGraphType = (e: ChangeEvent) => {
    if ((e.target as HTMLSelectElement).value === t('aggregate_graph')) {
      setGraphType(GraphTypes.AGGREGATE);
    } else {
      setGraphType(GraphTypes.TREND);
    }
  };

  const isEmpty = !data || (data[0].total === 0 && data[1].total === 0);

  if (isEmpty) {
    return <EmptyStatistics description="empty.component_description" />;
  }

  return (
    <Stack direction="column" height="100%" sx={{ display: 'flex' }}>
      <Stack
        direction={{ lg: 'row', xs: 'column' }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {graphType === GraphTypes.AGGREGATE ? <PieIcon /> : <StackedIcon />}
              </InputAdornment>
            ),
          }}
          label={t('graph_type_label')}
          select
          onChange={handleChangeGraphType}
          value={graphType === GraphTypes.AGGREGATE ? t('aggregate_graph') : t('trend_graph')}
          size="small"
          fullWidth={isMobile}
          sx={{
            marginBottom: isMobile ? '20px' : '0',
            '& .MuiInputBase-root': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >
          <MenuItem key={GraphTypes.AGGREGATE} value={t('aggregate_graph')} selected>
            <ListItemText>{t('aggregate_graph')}</ListItemText>
          </MenuItem>
          <MenuItem key={GraphTypes.TREND} value={t('trend_graph')}>
            <ListItemText>{t('trend_graph')}</ListItemText>
          </MenuItem>
        </TextField>
        {graphType === GraphTypes.TREND && (
          <Box>
            <Chip
              sx={{ mr: 2 }}
              label={t('trend.days')}
              variant="outlined"
              component="button"
              color={timeframe === Timeframe.daily ? 'primary' : 'default'}
              onClick={() => setTimeframe(Timeframe.daily)}
            />
            <Chip
              label={t('trend.weeks')}
              variant="outlined"
              component="button"
              color={timeframe === Timeframe.weekly ? 'primary' : 'default'}
              onClick={() => setTimeframe(Timeframe.weekly)}
            />
          </Box>
        )}
      </Stack>
      {graphType === GraphTypes.AGGREGATE ? (
        <AggregateStatistics values={aggregateData} options={options} />
      ) : (
        <TrendStackedStatistics
          startDate={startDate}
          endDate={endDate}
          lines={trendData}
          timeframe={timeframe}
          options={options}
        />
      )}
    </Stack>
  );
};

export default AggregateAndTrendStatistics;
