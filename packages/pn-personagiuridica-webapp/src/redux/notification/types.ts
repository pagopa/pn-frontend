import { Delegator } from '../../models/Deleghe';

export interface GetReceivedNotificationParams {
  iun: string;
  currentUserTaxId: string;
  delegatorsFromStore: Array<Delegator>;
  mandateId?: string;
}
