import { Delegator } from '../delegation/types';

export interface GetReceivedNotificationParams {
  iun: string;
  currentUserTaxId: string;
  delegatorsFromStore: Array<Delegator>;
  mandateId?: string;
}

export interface DownloadFileResponse {
  url: string;
  retryAfter?: number;
  docType?: DocType;
}

export enum DocType {
  AAR = "AAR",
  AO3 = "AO3"
}
