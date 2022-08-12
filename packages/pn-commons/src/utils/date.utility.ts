import DateFnsAdapter from "@date-io/date-fns";

const dateFns = new DateFnsAdapter();
export const DATE_FORMAT = "dd/MM/yyyy";
const DATE_FORMAT_TIMEZONE = "yyyy-MM-dd'T'00:mm:ss.SSS'Z'";

export const today = new Date();
export const tenYearsAgo = new Date(new Date().setMonth(today.getMonth() - 120));
today.setHours(0, 0, 0, 0);
tenYearsAgo.setHours(0, 0, 0, 0);

export function getMonthString(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' }).toUpperCase().substring(0, 3);
}

export function getDay(dateString: string): string {
  const date = new Date(dateString);
  return `0${date.getDate()}`.slice(-2);
}

export function getTime(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export function getNextDay(date: Date): Date {
  return dateFns.addDays(date, 1);
}

export function formatToTimezoneString(date: Date): string {
  return dateFns.formatByString(date, DATE_FORMAT_TIMEZONE);
}
