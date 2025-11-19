import { add, addDays, compareAsc } from 'date-fns';

import DateFnsAdapter from '@date-io/date-fns';

import { DatePickerTypes } from '../components/CustomDatePicker';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

const dateFns = new DateFnsAdapter();
export const DATE_FORMAT = 'dd/MM/yyyy';
const DATE_FORMAT_TIMEZONE = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

export const today = dateFns.endOfDay(new Date());
export const tenYearsAgo = dateFns.startOfDay(
  new Date(new Date().setMonth(today.getMonth() - 120))
);

export const oneMonthAgo = add(today, { months: -1, days: 1 });
export const threeMonthsAgo = add(today, { months: -3, days: 1 });
export const sixMonthsAgo = add(today, { months: -6, days: 1 });
export const twelveMonthsAgo = add(today, { months: -12, days: 1 });

export const oneYearAgo = dateFns.startOfDay(new Date(new Date().setMonth(today.getMonth() - 12)));

export function dateIsLessThan10Years(sentAt: string): boolean {
  return Date.parse(formatToTimezoneString(today)) - Date.parse(sentAt) < 315569520000;
}

export function dateIsDefined(date: Date | null | undefined) {
  return date && !isNaN(date.getTime());
}

export function formatMonthString(dateString: string, language?: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleString(language ? language : 'it', { month: 'long' })
    .toUpperCase()
    .substring(0, 3);
}

export function formatTimeWithLegend(dateString: string): string {
  const date = new Date(dateString);
  const hourOfDayLabel = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');

  return `${hourOfDayLabel} ${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export function formatDay(dateString: string): string {
  const date = new Date(dateString);
  return `0${date.getDate()}`.slice(-2);
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export function getEndOfDay(date: Date): Date {
  return dateFns.endOfDay(date);
}

export function getStartOfDay(date: Date): Date {
  return dateFns.startOfDay(date);
}

export function minutesBeforeNow(n: number): Date {
  const dateObject = new Date();
  dateObject.setTime(dateObject.getTime() - 60000 * n);
  return dateObject;
}

export function formatToTimezoneString(date: Date): string {
  return dateFns.formatByString(date, DATE_FORMAT_TIMEZONE);
}

export function isToday(date: DatePickerTypes): boolean {
  const today = new Date();
  return (
    date?.getDate() === today.getDate() &&
    date?.getMonth() === today.getMonth() &&
    date?.getFullYear() === today.getFullYear()
  );
}

export function formatDate(
  dateString: string,
  todayLabelizzation: boolean = true,
  separator: string = '/'
): string {
  const date = new Date(dateString);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const todayLabel = getLocalizedOrDefaultLabel(
    'common',
    'date-time.today-uppercase-initial',
    'Oggi'
  );
  return isToday(date) && todayLabelizzation
    ? todayLabel
    : `${day}${separator}${month}${separator}${date.getFullYear()}`;
}

export function formatDateTime(dateString: string): string {
  const hourOfDayLabel = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');
  return `${formatDate(dateString)}, ${hourOfDayLabel} ${formatTime(dateString)}`;
}

export function formatToSlicedISOString(date: Date): string {
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatFromString(date: string): Date | null {
  const dateParsed = dateFns.parse(date, DATE_FORMAT);
  if (dateFns.isValid(dateParsed)) {
    return dateParsed;
  }
  return null;
}

export function formatShortDate(date: string, year: boolean = false): string {
  const the_date = new Date(date);
  const shortMonth = getLocalizedOrDefaultLabel(
    'common',
    `date-time.s-month.${the_date.getMonth()}`
  );
  const yearTxt = year ? ` ${the_date.getFullYear()}` : '';
  return `${the_date.getDate()} ${shortMonth}${yearTxt}`;
}

export const convertHoursToDays = (hours: number): number =>
  Math.round(hours && hours > 0 ? hours / 24 : 0);

/**
 * Returns all calendar days between startDate and endDate (included)
 *
 * @param {string} startDate start date in format YYYY-MM-DD
 * @param {string} endDate end date in format YYYY-MM-DD
 * @returns {Array<string>}
 */
export const getDaysFromDateRange = (startDate: string, endDate: string): Array<string> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // set time to zero to avoid issues whit timezone
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const days: Array<string> = [];
  // eslint-disable-next-line functional/no-let
  for (let d = start; compareAsc(d, end) < 1; d = addDays(d, 1)) {
    // eslint-disable-next-line functional/immutable-data
    days.push(formatToSlicedISOString(d));
  }
  return days;
};

/**
 * Returns every week in a specified range of days
 * a single week is described by an object storing the first and the last dates as string
 *
 * @param {string} startDate start date in format YYYY-MM-DD
 * @param {string} endDate end date in format YYYY-MM-DD
 * @param {number} lastDayOfTheWeek last day of the week from 0 (Sunday) to 6 (Saturday)
 * @returns {Array<string>}
 */
export const getWeeksFromDateRange = (
  startDate: string,
  endDate: string,
  lastDayOfTheWeek: number
): Array<{ start: string; end: string }> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // set time to zero to avoid issues whit timezone
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const weeksInterval: Array<{ start: string; end: string }> = [];
  // eslint-disable-next-line functional/no-let
  let first = start;
  // eslint-disable-next-line functional/no-let
  for (let d = start; compareAsc(d, end) < 1; d = addDays(d, 1)) {
    if (
      d.getDay() === lastDayOfTheWeek ||
      formatToSlicedISOString(d) === formatToSlicedISOString(end)
    ) {
      // eslint-disable-next-line functional/immutable-data
      weeksInterval.push({
        start: formatToSlicedISOString(first),
        end: formatToSlicedISOString(d),
      });
      first = addDays(d, 1);
    }
  }
  return weeksInterval;
};

export function getDateFromString(date: string, format: string): Date | null {
  const stringParsed = dateFns.parse(date, format);
  if (dateFns.isValid(stringParsed)) {
    return stringParsed;
  }
  return null;
}
