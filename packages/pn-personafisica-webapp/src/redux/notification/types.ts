import { Delegator } from '../delegation/types';

export interface GetReceivedNotificationParams {
  iun: string;
  currentUserTaxId: string;
  delegatorsFromStore: Array<Delegator>;
  mandateId?: string;
}

export interface GetReceivedNotificationTimelineParams {
  iun: string;
  mandateId?: string;
}
