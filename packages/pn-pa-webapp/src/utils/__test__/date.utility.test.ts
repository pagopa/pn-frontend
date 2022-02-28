import { getMonthString, getDay, getTime } from '../date.utility';

const dateString = '2022-02-22T14:20:20.566Z';

test('return month string, uppercase and truncated to the first three letters', () => {
  const month = getMonthString(dateString);
  expect(month).toBe('FEB');
});

test('return day', () => {
  const day = getDay(dateString);
  expect(day).toBe('22');
});

test('return time', () => {
  const time = getTime(dateString);
  expect(time).toBe('15:20');
});