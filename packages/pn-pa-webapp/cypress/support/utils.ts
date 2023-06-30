import { formatToTimezoneString, getNextDay, tenYearsAgo, today } from "@pagopa-pn/pn-commons";

export const getParams = (params: {
  iun?: string,
  recipientId?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  size?: number,
  nextPagesKey?: string
}) => ({
  iunMatch: params.iun,
  recipientId: params.recipientId,
  startDate: formatToTimezoneString(params.startDate ? new Date(params.startDate) : tenYearsAgo),
  endDate: formatToTimezoneString(getNextDay(params.endDate ? new Date(params.endDate) : today)),
  status: params.status,
  size: params.size || 10,
  nextPagesKey: params.nextPagesKey
});