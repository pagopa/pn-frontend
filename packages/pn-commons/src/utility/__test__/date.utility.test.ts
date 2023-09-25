import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  formatMonthString,
  formatDay,
  formatTime,
  getNextDay,
  formatToTimezoneString,
  formatTimeWithLegend,
  isToday,
  formatDate,
  formatToSlicedISOString,
  formatDateTime,
  dateIsDefined,
  formatFromString,
} from '../date.utility';

const dateString = '2022-02-22T14:20:20.566Z';
const date = new Date(dateString);

describe('Date utility', () => {
  test('format date in the format DD/MM/YYYY', () => {
    const date = '2022-02-16T16:03:37.123Z';
    const dateFormatted = formatDate(date);
    expect(dateFormatted).toBe('16/02/2022');
  });

  test('format today date', () => {
    const date = new Date().toISOString();
    const dateFormatted = formatDate(date);
    expect(dateFormatted).toBe('Oggi');
  });

  test('format date to sliced ISO string ', () => {
    const date = new Date('2022-02-16T16:03:37.123Z');
    const dateFormatted = formatToSlicedISOString(date);
    expect(dateFormatted).toBe('2022-02-16');
  });

  test('format dateTime as { date: DD/MM/YYYY, time: ore HH:MM }', () => {
    const date = '2022-02-16T16:03:37.123Z';
    const timeFormatted = formatDateTime(date);
    // the time will be localized to the locale of wherever the test is to be run,
    // therefore I must compare with the localized hour
    const label = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');

    const localizedHour = String(new Date(date).getHours()).padStart(2, '0');
    expect(timeFormatted).toEqual(`16/02/2022, ${label} ${localizedHour}:03`);
  });

  it('return month string, uppercase and truncated to the first three letters', () => {
    const month = formatMonthString(dateString);
    const expectedMonth = date
      .toLocaleString('default', { month: 'long' })
      .toUpperCase()
      .substring(0, 3);
    expect(month).toBe(expectedMonth);
  });

  it('return day', () => {
    const day = formatDay(dateString);
    const expectedDay = `0${date.getDate()}`.slice(-2);
    expect(day).toBe(expectedDay);
  });

  it('return time', () => {
    const time = formatTime(dateString);
    const expectedTime = `${date.getHours()}:${date.getMinutes()}`;
    expect(time).toBe(expectedTime);
  });

  it('return time with ore label', () => {
    const time = formatTimeWithLegend(dateString);
    const label = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');
    const expectedTime = `${label} ${date.getHours()}:${date.getMinutes()}`;
    expect(time).toBe(expectedTime);
  });

  it('date is defined - sound date', () => {
    expect(dateIsDefined(date)).toBeTruthy();
  });

  it('date is defined - wrong date', () => {
    const wrongDate = new Date('2022-99-99T14:20:20.566Z');
    expect(dateIsDefined(wrongDate)).toBeFalsy();
  });

  it('date is defined - no date', () => {
    expect(dateIsDefined(null)).toBeFalsy();
  });

  it('return next day', () => {
    const nextDay = getNextDay(date);
    const expectedNextDay = new Date(date);
    expectedNextDay.setDate(expectedNextDay.getDate() + 1);
    expect(nextDay).toStrictEqual(expectedNextDay);
  });

  it('return date string with timezone', () => {
    const dateAtMidnight = new Date('2022-02-22T00:00:00.000');
    const dateFormatted = formatToTimezoneString(dateAtMidnight);
    const expectedDate = '2022-02-22T00:00:00.000Z';
    expect(dateFormatted).toBe(expectedDate);
  });

  it('return date minus the minutes before now', () => {
    //not tested because we create two Date instance with difference by the way of CPU clock
  });

  it('return a boolean value if the date is today', () => {
    const isTodayVerify = isToday(date);
    const isTodayVerifySecond = isToday(date);
    expect(isTodayVerify).toBe(isTodayVerifySecond);
  });

  it('return a Date istance from string', () => {
    const invalidDateString = 'abc';
    const invalidDate = formatFromString(invalidDateString);
    expect(invalidDate).toBeNull();
    const dateString = '23/07/2023';
    const date = formatFromString(dateString);
    expect(date).toBeInstanceOf(Date);
  });
});
