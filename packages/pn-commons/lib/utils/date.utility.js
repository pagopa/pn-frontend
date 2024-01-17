import DateFnsAdapter from '@date-io/date-fns';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';
const dateFns = new DateFnsAdapter();
export const DATE_FORMAT = 'dd/MM/yyyy';
const DATE_FORMAT_TIMEZONE = "yyyy-MM-dd'T'00:mm:ss.SSS'Z'";
export const today = new Date();
export const tenYearsAgo = new Date(new Date().setMonth(today.getMonth() - 120));
today.setHours(0, 0, 0, 0);
today.setTime(today.getTime() - today.getTimezoneOffset() * 60 * 1000); // UTC Offset
today.setTime(today.getTime() + 120 * 60 * 1000); // Rome Offset (120min)
tenYearsAgo.setHours(0, 0, 0, 0);
export function dateIsDefined(date) {
    return date && !isNaN(date.getTime());
}
export function formatMonthString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' }).toUpperCase().substring(0, 3);
}
export function formatTimeWithLegend(dateString) {
    const date = new Date(dateString);
    const hourOfDayLabel = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');
    return `${hourOfDayLabel} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
}
export function formatDay(dateString) {
    const date = new Date(dateString);
    return `0${date.getDate()}`.slice(-2);
}
export function formatTime(dateString) {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
}
export function getNextDay(date) {
    return dateFns.addDays(date, 1);
}
export function minutesBeforeNow(n) {
    const dateObject = new Date();
    dateObject.setTime(dateObject.getTime() - 60000 * n);
    return dateObject;
}
export function formatToTimezoneString(date) {
    return dateFns.formatByString(date, DATE_FORMAT_TIMEZONE);
}
export function isToday(date) {
    const today = new Date();
    return (date?.getDate() === today.getDate() &&
        date?.getMonth() === today.getMonth() &&
        date?.getFullYear() === today.getFullYear());
}
export function formatDate(dateString, todayLabelizzation = true) {
    const date = new Date(dateString);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const todayLabel = getLocalizedOrDefaultLabel('common', 'date-time.today-uppercase-initial', 'Oggi');
    return isToday(date) && todayLabelizzation ? todayLabel : `${day}/${month}/${date.getFullYear()}`;
}
export function formatDateTime(dateString) {
    const hourOfDayLabel = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');
    return `${formatDate(dateString)}, ${hourOfDayLabel} ${formatTime(dateString)}`;
}
export function formatToSlicedISOString(date) {
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${date.getFullYear()}-${month}-${day}`;
}
export function formatFromString(date) {
    const dateParsed = dateFns.parse(date, DATE_FORMAT);
    if (dateFns.isValid(dateParsed)) {
        return dateParsed;
    }
    return null;
}
