import {
  formatMonthString,
  formatDay,
  formatTime,
  getNextDay,
  formatToTimezoneString,
} from '../date.utility';

const dateString = '2022-02-22T14:20:20.566Z';
const date = new Date(dateString);

describe('Date utility', () => {
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
});
