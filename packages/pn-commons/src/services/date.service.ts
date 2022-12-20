import { DatePickerTypes } from "../types";
import { getLocalizedOrDefaultLabel } from "./localization.service";

export function isToday(date: DatePickerTypes): boolean {
  const today = new Date();
  return (
    date?.getDate() === today.getDate() &&
    date?.getMonth() === today.getMonth() &&
    date?.getFullYear() === today.getFullYear()
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const todayLabel = getLocalizedOrDefaultLabel(
    'common',
    'date-time.today-uppercase-initial',
    "Oggi"
  );
  return isToday(date) ? todayLabel : `${day}/${month}/${date.getFullYear()}`;
}

export function formatTimeHHMM(dateString: string): string {
  const date = new Date(dateString);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  return `${hour}:${minute}`;
}

export function formatDateTime(dateString: string): { date: string; time: string } {
  const hourOfDayLabel = getLocalizedOrDefaultLabel(
    'common',
    'date-time.hour-of-day',
    "ore"
  );
  return { date: formatDate(dateString), time: `${hourOfDayLabel} ${formatTimeHHMM(dateString)}` };
}

export function formatToSlicedISOString(date: Date): string {
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}