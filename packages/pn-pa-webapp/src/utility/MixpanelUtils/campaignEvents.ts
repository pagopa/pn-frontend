import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { mapCampaignListToEventPayload } from './mappers/campaignPayloadMappers';
import { TrackingConfigs } from './trackingTypes';

type CampaignEventType =
  | PAEventsType.SEND_PA_CAMPAIGNS
  | PAEventsType.SEND_PA_CAMPAIGN_DETAIL
  | PAEventsType.SEND_PA_COMBO_DETAIL
  | PAEventsType.SEND_PA_COMBO_STATUS_DETAIL;

export const campaignTrackingConfigs: TrackingConfigs<CampaignEventType> = {
  [PAEventsType.SEND_PA_CAMPAIGNS]: (data) => uxScreenView(mapCampaignListToEventPayload(data)),
  [PAEventsType.SEND_PA_CAMPAIGN_DETAIL]: () => uxScreenView(),
  [PAEventsType.SEND_PA_COMBO_DETAIL]: () => uxScreenView(),
  [PAEventsType.SEND_PA_COMBO_STATUS_DETAIL]: () => uxScreenView(),
};
