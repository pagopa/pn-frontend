import { getMonthString, getDay, getTime } from '../date.utility';

const dateString = '2022-02-22T14:20:20.566Z';
const date = new Date(dateString);

describe('Date utility', () => {
  it('return month string, uppercase and truncated to the first three letters', () => {
    const month = getMonthString(dateString);
    const expectedMonth = date
      .toLocaleString('default', { month: 'long' })
      .toUpperCase()
      .substring(0, 3);
    expect(month).toBe(expectedMonth);
  });

  it('return day', () => {
    const day = getDay(dateString);
    const expectedDay = `0${date.getDate()}`.slice(-2);
    expect(day).toBe(expectedDay);
  });

  it('return time', () => {
    const time = getTime(dateString);
    const expectedTime = `${date.getHours()}:${date.getMinutes()}`;
    expect(time).toBe(expectedTime);
  });
});
