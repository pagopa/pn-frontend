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
  const [graphType, setGraphType] = useState<'aggregate_graph' | 'trend_graph'>('aggregate_graph');
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.weekly);

  const { t } = useTranslation(['statistics']);

  const aggregateData: Array<AggregateDataItem> = [];
  const trendData: Array<TrendDataItem> = [];

  data?.forEach((item) => {
    // eslint-disable-next-line functional/immutable-data
    aggregateData.push({ title: item.title, value: item.total });
    // eslint-disable-next-line functional/immutable-data
    trendData.push({ title: item.title, values: item.details });
  });

  const isMobile = useIsMobile();

  const handleChangeGraphType = (e: ChangeEvent) => {
    setGraphType((e.target as HTMLSelectElement).value as 'aggregate_graph' | 'trend_graph');
  };

  const isEmpty = !data || (data[0].total === 0 && data[1].total === 0);

  if (isEmpty) {
    return <EmptyStatistics />;
  }

  return (
    <>
      <Stack
        direction={{ lg: 'row', xs: 'column' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {graphType === 'aggregate_graph' ? <PieIcon /> : <StackedIcon />}
              </InputAdornment>
            ),
          }}
          label={t('graph_type_label')}
          select
          name="graph-type-select"
          data-testid="graph-type-select"
          onChange={handleChangeGraphType}
          value={graphType}
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
          <MenuItem key={'aggregate_graph'} value="aggregate_graph">
            <ListItemText>{t('aggregate_graph')}</ListItemText>
          </MenuItem>
          <MenuItem key={'trend_graph'} value="trend_graph">
            <ListItemText>{t('trend_graph')}</ListItemText>
          </MenuItem>
        </TextField>
        {graphType === 'trend_graph' && (
          <Box>
            <Chip
              sx={{ mr: 2, opacity: '1!important' }}
              label={t('trend.days')}
              data-testid="daily-view"
              variant="outlined"
              component="button"
              color={timeframe === Timeframe.daily ? 'primary' : 'default'}
              onClick={() => setTimeframe(Timeframe.daily)}
              disabled={timeframe === Timeframe.daily}
            />
            <Chip
              sx={{ opacity: '1!important' }}
              label={t('trend.weeks')}
              data-testid="weekly-view"
              variant="outlined"
              component="button"
              color={timeframe === Timeframe.weekly ? 'primary' : 'default'}
              onClick={() => setTimeframe(Timeframe.weekly)}
              disabled={timeframe === Timeframe.weekly}
            />
          </Box>
        )}
      </Stack>
      {graphType === 'aggregate_graph' ? (
        <AggregateStatistics values={aggregateData} options={options} legend />
      ) : (
        <TrendStackedStatistics
          startDate={startDate}
          endDate={endDate}
          lines={trendData}
          timeframe={timeframe}
          options={options}
        />
      )}
    </>
  );
};

export default AggregateAndTrendStatistics;
