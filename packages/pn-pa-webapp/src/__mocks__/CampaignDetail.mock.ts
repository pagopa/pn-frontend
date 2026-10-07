import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';

import {
  BffCampaignDetailResponseV1,
  BffInformalSenderNotificationSearchResponse,
  CampaignStatus,
  ChannelType,
} from '../generated-client/informal-notifications/api';

export const campaignDetailMock: BffCampaignDetailResponseV1 = {
  campaignId: 'FattOrd',
  title: 'Fatturazione Ordinaria',
  description:
    "In questa campagna, l'ente comunica l'emissione di una fattura ai suoi clienti. La comunicazione contiene gli allegati ed il pagamento.",
  startDate: '2026-07-10T10:00:00Z',
  campaignStatus: CampaignStatus.InProgress,
  serviceName: 'Servizi idrici',
  channels: [ChannelType.Io, ChannelType.Email, ChannelType.Pec],
};

export const comunicationsList: BffInformalSenderNotificationSearchResponse = {
  resultsPage: [
    {
      iun: 'XGPG-LXPA-YXRL-202308-M-A',
      notificationStatus: InformalNotificationStatus.UNDELIVERABLE,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      communicationOutcomes: { viewed: true, delivered: true },
    },
    {
      iun: 'ZEXV-XVNG-HKNY-202308-D-A',
      notificationStatus: InformalNotificationStatus.COMPLETED_REACHED,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      communicationOutcomes: { viewed: true, delivered: true },
    },
    {
      iun: 'LQJA-EHAM-DGAU-202308-E-A',
      notificationStatus: InformalNotificationStatus.PROCESSING,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      communicationOutcomes: { viewed: true, delivered: true },
    },
    {
      iun: 'PYRH-VGJR-GXTW-202308-V-A',
      notificationStatus: InformalNotificationStatus.ACCEPTED,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      communicationOutcomes: { viewed: true, delivered: true },
    },
  ],
  moreResult: true,
  nextPagesKey: [
    'eyJlayI6IlBGLWE2YzEzNTBkLTFkNjktNDIwOS04YmY4LTMxZGU1OGM3OWQ2ZSMjMjAyMzA4IiwiaWsiOnsiaXVuX3JlY2lwaWVudElkIjoiUU1BTS1MWUhBLVBMVkUtMjAyMzA4LVgtMSMjUEYtYTZjMTM1MGQtMWQ2OS00MjA5LThiZjgtMzFkZTU4Yzc5ZDZlIiwicmVjaXBpZW50SWRfY3JlYXRpb25Nb250aCI6IlBGLWE2YzEzNTBkLTFkNjktNDIwOS04YmY4LTMxZGU1OGM3OWQ2ZSMjMjAyMzA4Iiwic2VudEF0IjoiMjAyMy0wOC0wMlQwODozMjozNS45MTg5NTYyMDdaIn19',
  ],
};
