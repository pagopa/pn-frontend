import { getDateInfo } from './date.utility';

export const getAccessibleIun = (iun: string): string => iun.split('').join(' ');

export const getAccessibleDate = (
  dateString: string,
  { t, ns }: { t: any; ns: string }
): string => {
  const dateInfo = getDateInfo(dateString);
  const month = t(`date-time.${dateInfo.month}`, { ns });
  return `${dateInfo.day} ${month} ${dateInfo.year}`;
};
