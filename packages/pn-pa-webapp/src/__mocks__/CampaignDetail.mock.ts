import {
  BffCampaignDetailResponseV1,
  CampaignStatus,
  ChannelType,
} from '../generated-client/sender-informal-notifications/api';

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
