import { CampaignStatus } from '../../../generated-client/informal-notifications';
import { PACampaignsListEventData, PACampaignsListPayload } from '../../../models/PAEventPayloads';

export const mapCampaignListToEventPayload = ({
  campaigns,
  pageNumber,
}: PACampaignsListEventData): PACampaignsListPayload => ({
  page_number: pageNumber,
  total_count: campaigns.length,
  draft_count: campaigns.filter((campaign) => campaign.campaignStatus === CampaignStatus.Draft)
    .length,
  in_progress_count: campaigns.filter(
    (campaign) => campaign.campaignStatus === CampaignStatus.InProgress
  ).length,
  concluded_count: campaigns.filter(
    (campaign) => campaign.campaignStatus === CampaignStatus.Concluded
  ).length,
  canceled_count: campaigns.filter(
    (campaign) => campaign.campaignStatus === CampaignStatus.Canceled
  ).length,
});
