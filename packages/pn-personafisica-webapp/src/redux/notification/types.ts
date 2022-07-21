import { UserForParseNotificationDetailForRecipient, DelegatorsForParseNotificationDetailForRecipient } from './../../types/notification.utility';

export interface GetReceivedNotificationParams {
  iun: string;
  currentUser: UserForParseNotificationDetailForRecipient;
  delegatorsFromStore: DelegatorsForParseNotificationDetailForRecipient;
  mandateId?: string;
}
