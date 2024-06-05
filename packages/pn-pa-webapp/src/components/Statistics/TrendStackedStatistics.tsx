/* eslint-disable functional/no-let */

/* eslint-disable functional/immutable-data */
import { add, compareAsc } from 'date-fns';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDateSMonth, formatToSlicedISOString } from '@pagopa-pn/pn-commons';
import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import {
  GraphColors,
  IStatisticsDailySummary,
  Timeframe,
  WEEK_DAYS,
} from '../../models/Statistics';

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
  const { t } = useTranslation(['statistics']);

  /**
   * Returns all calendar days between startDate and endDate (included)
   *
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Array<string>}
   */
  const getAllDays = (startDate: string, endDate: string): Array<string> => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    /**
     * workaround: sets the time to 15:00 to fix an issue with daylight saving
     * descr: if the time is set to midnight (as by default) adding a day to the
     * last day of the non-DST period will have as a result to only move the clock
     * forward to 23:00 but keep the same date, causing a bug in the algorithm used
     * to generate every date between two specific dates
     */
    start = add(start, { hours: 15 });
    end = add(end, { hours: 15 });

    const days: Array<string> = [];
    for (let d = start; compareAsc(d, end) < 1; d = add(d, { days: 1 })) {
      days.push(formatToSlicedISOString(d));
    }
    return days;
  };

  /**
   * Returns every week in a specified range of days
   * a single week is described by an object storing the first and the last dates as string
   */
  const getAllWeeks = (days: Array<string>): Array<{ start: string; end: string }> => {
    const weeksInterval: Array<{ start: string; end: string }> = [];
    let start = new Date(days[0]);
    let end = new Date(days[days.length - 1]);

    start = add(start, { hours: 15 });
    end = add(end, { hours: 15 });

    let first = new Date(days[0]);
    first = add(first, { hours: 15 });
    for (let d = start; compareAsc(d, end) < 1; d = add(d, { days: 1 })) {
      if (
        d.getDay() === LAST_DAY_OF_THE_WEEK ||
        formatToSlicedISOString(d) === formatToSlicedISOString(end)
      ) {
        weeksInterval.push({
          start: formatToSlicedISOString(first),
          end: formatToSlicedISOString(d),
        });
        first = add(d, { days: 1 });
      }
    }

    return weeksInterval;
  };

  /**
   * Creates a formatted version of the days array to be used as x label for daily timeframe
   */
  const getDailyLabels = (days: Array<string>): Array<string> =>
    days.map((day) => formatDateSMonth(day));

  /**
   * Creates a formatted version of the days array to be used as x label for weekly timeframe
   */
  const getWeeklyLables = (weeks: Array<{ start: string; end: string }>): Array<string> =>
    weeks.map((item) => formatDateSMonth(item.start) + ' - ' + formatDateSMonth(item.end));

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

  const days = getAllDays(startDate, endDate);

  const weeks = getAllWeeks(days);

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
    toolbox: {
      feature: {
        saveAsImage: {
          show: true,
          title: t('save_as_image'),
          name: 'chart',
          backgroundColor: 'white',
          pixelRatio: 2,
          iconStyle: {
            borderColor: GraphColors.navy,
          },
        },
      },
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

  return <PnECharts option={option} style={sx} />;
};

export default TrendStackedStatistics;
