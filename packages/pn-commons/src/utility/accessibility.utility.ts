import { getDateInfo } from './date.utility';
import { getLocalizedOrDefaultLabel } from './localization.utility';

export const getAccessibleIun = (iun: string): string => iun.split('').join(' ');

export const getAccessibleDate = (dateString: string): string => {
  const dateInfo = getDateInfo(dateString);
  const month = getLocalizedOrDefaultLabel('common', `date-time.${dateInfo.month}`);
  return `${dateInfo.day} ${month} ${dateInfo.year}`;
};
