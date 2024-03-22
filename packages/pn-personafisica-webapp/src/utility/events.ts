import { PFEventsType } from '../models/PFEventsType';

export const eventsActionsMap: Record<string, PFEventsType> = {
  'getReceivedNotificationOtherDocument/fulfilled': PFEventsType.SEND_DOWNLOAD_RESPONSE,
  'getReceivedNotificationLegalfact/fulfilled': PFEventsType.SEND_DOWNLOAD_RESPONSE,
  'exchangeToken/fulfilled': PFEventsType.SEND_AUTH_SUCCESS,
};
