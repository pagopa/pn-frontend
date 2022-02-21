import { formatDate } from '../notifications.mapper';

test('format date in the format DD/MM/YYYY', () => {
  const date = '2022-02-16T16:03:37.123Z';
  const dateFormatted = formatDate(date);
  expect(dateFormatted).toBe('16/02/2022');
})

test('format today date', () => {
  const date = new Date().toISOString();
  const dateFormatted = formatDate(date);
  expect(dateFormatted).toBe('Oggi');
})