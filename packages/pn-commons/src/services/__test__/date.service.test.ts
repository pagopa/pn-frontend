import { formatDate, formatDateTime, formatTimeHHMM, formatToSlicedISOString } from "../date.service";

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

test('format time as HH:MM', () => {
  const date = '2022-02-16T16:03:37.123Z';
  const timeFormatted = formatTimeHHMM(date);
  // the time will be localized to the locale of wherever the test is to be run, 
  // therefore I must compare with the localized hour
  const localizedHour = String(new Date(date).getHours()).padStart(2, "0");
  expect(timeFormatted).toBe(`${localizedHour}:03`);
});

test('format dateTime as { date: DD/MM/YYYY, time: ore HH:MM }', () => {
  const date = '2022-02-16T16:03:37.123Z';
  const timeFormatted = formatDateTime(date);
  // the time will be localized to the locale of wherever the test is to be run, 
  // therefore I must compare with the localized hour
  const localizedHour = String(new Date(date).getHours()).padStart(2, "0");
  expect(timeFormatted).toEqual({date: '16/02/2022', time: `ore ${localizedHour}:03`});
});
