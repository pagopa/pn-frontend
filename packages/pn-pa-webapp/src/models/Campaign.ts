import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';

import { InformalNotificationStatusV1 } from '../generated-client/informal-notifications';

export enum CommunicationStatusFilter {
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUSED = 'REFUSED',
}

export type CommunicationFilters = {
  recipientId: string;
  iunMatch: string;
  status: Array<InformalNotificationStatusV1>;
  outcome: string;
};

type CommunicationStatusOption = {
  id: CommunicationStatusFilter;
  description: string;
  label: string;
  value: Array<InformalNotificationStatus>;
  color: 'default' | 'info' | 'error' | 'highlight';
};

export const communicationStatusOptions: Array<CommunicationStatusOption> = [
  {
    id: CommunicationStatusFilter.READY,
    label: 'detail.communications.statuses.ready',
    description: '',
    value: [InformalNotificationStatus.ACCEPTED],
    color: 'default',
  },
  {
    id: CommunicationStatusFilter.PROCESSING,
    label: 'detail.communications.statuses.processing',
    description: '',
    value: [InformalNotificationStatus.PROCESSING],
    color: 'info',
  },
  {
    id: CommunicationStatusFilter.SUCCESS,
    label: 'detail.communications.statuses.success',
    description: '',
    value: [
      InformalNotificationStatus.COMPLETED_REACHED,
      InformalNotificationStatus.COMPLETED_UNREACHED,
    ],
    color: 'highlight',
  },
  {
    id: CommunicationStatusFilter.FAILED,
    label: 'detail.communications.statuses.failed',
    description: '',
    value: [InformalNotificationStatus.UNDELIVERABLE],
    color: 'error',
  },
  {
    id: CommunicationStatusFilter.REFUSED,
    label: 'detail.communications.statuses.refused',
    description: '',
    value: [InformalNotificationStatus.REFUSED],
    color: 'error',
  },
];

export const communicationOutcomeOptions = [
  {
    id: '',
    label: 'detail.communications.outcomes.all',
  },
  {
    id: 'viewed',
    label: 'detail.communications.outcomes.viewed',
  },
  {
    id: 'delivered',
    label: 'detail.communications.outcomes.delivered',
  },
];
