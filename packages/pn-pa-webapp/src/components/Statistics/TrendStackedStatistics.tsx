import type { CSSProperties } from 'react';

import {
  formatShortDate,
  getDaysFromDateRange,
  getWeeksFromDateRange,
} from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import { IStatisticsDailySummary, Timeframe, WEEK_DAYS } from '../../models/Statistics';

const LAST_DAY_OF_THE_WEEK = WEEK_DAYS.SUNDAY;

export type TrendDataItem = {
  title: string;
  values: Array<IStatisticsDailySummary> | undefined;
};

type Props = {
  startDate: string;
  endDate: string;
  lines: Array<TrendDataItem>;
  timeframe: Timeframe;
  options?: PnEChartsProps['option'];
  sx?: CSSProperties;
};

/**
 * Renders a series of stacked lines
 *
 * @param {*} startDate: the beginning of the period to represent
 * @param {*} endDate: the beginning of the period to represent
 * @param {*} lines: each element represents a single line to be drawn with a title/name and
 * a series of objects storing the value for a certain date
 * @param {*} timeframe: tells the component wether every point on the graph should represent
 * a day or a week
 * @param {*} options: will be forwarded to the underlying echart component customize its behaviour
 * @param {*} sx: will be forwarded to the underlying echart component customize its style
 */
const TrendStackedStatistics: React.FC<Props> = ({
  startDate,
  endDate,
  lines,
  timeframe, // tells the component wether every point on the graph should represent a day or a week
  options,
  sx,
}) => {
  /**
   * Creates a formatted version of the days array to be used as x label for daily timeframe
   */
  const getDailyLabels = (days: Array<string>): Array<string> =>
    days.map((day) => formatShortDate(day));

  /**
   * Creates a formatted version of the days array to be used as x label for weekly timeframe
   */
  const getWeeklyLables = (weeks: Array<{ start: string; end: string }>): Array<string> =>
    weeks.map((item) => formatShortDate(item.start) + ' - ' + formatShortDate(item.end));

  /**
   * Returns the array containing only the values for each day ready to be used inside the
   * option prop of the PnECharts component
   */
  const getDailyDataSeries = (
    data: Array<TrendDataItem>,
    days: Array<string>
  ): PnEChartsProps['option']['series'] =>
    data.map((line) => ({
      name: line.title,
      type: 'line',
      data: days.map((day) => {
        const elem = line.values?.find((item) => item.send_date === day);
        return elem ? elem.count : 0;
      }),
    }));

  /**
   * Returns the array containing only the values for each week ready to be used inside the
   * option prop of the PnECharts component
   */
  const getWeeklyDataSeries = (
    data: Array<TrendDataItem>,
    weeks: Array<{ start: string; end: string }>
  ): PnEChartsProps['option']['series'] =>
    data.map((line) => ({
      name: line.title,
      type: 'line',
      data: weeks.map((week) =>
        line.values
          ?.map((item) =>
            item.send_date >= week.start && item.send_date <= week.end ? item.count : 0
          )
          .reduce((total, current) => total + current, 0)
      ),
    }));

  const days = timeframe === Timeframe.daily ? getDaysFromDateRange(startDate, endDate) : [];
  const weeks =
    timeframe === Timeframe.weekly
      ? getWeeksFromDateRange(startDate, endDate, LAST_DAY_OF_THE_WEEK)
      : [];

  const [data, series] =
    timeframe === Timeframe.daily
      ? [getDailyLabels(days), getDailyDataSeries(lines, days)]
      : [getWeeklyLables(weeks), getWeeklyDataSeries(lines, weeks)];

  const legend: Array<string> = lines.map((item) => item.title);

  const option: PnEChartsProps['option'] = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: false,
      bottom: '0%',
      left: 'center',
      data: legend,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      // axisLabel: {
      //   show: true,
      //   interval: 0,
      //   rotate: 45,
      // },
      type: 'category',
      boundaryGap: false,
      data,
    },
    yAxis: {
      type: 'value',
    },
    series,
    ...options,
  };

  if (legend) {
    return (
      <PnECharts
        option={option}
        style={{ ...sx, height: '400px' }}
        legend={legend}
        dataTestId="Trend"
      />
    );
  }
  return <PnECharts option={option} style={{ ...sx, height: '400px' }} dataTestId="Trend" />;
};

export default TrendStackedStatistics;
