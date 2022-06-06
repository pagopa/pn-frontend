export const DATE_FORMAT = "dd/MM/yyyy";

export const today = new Date();

export const tenYearsAgo = new Date(new Date().setMonth(today.getMonth() - 120));

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
