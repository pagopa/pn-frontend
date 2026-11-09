import { campaignsPage1, campaignsPage2 } from '../../../../__mocks__/Campaigns.mock';
import { mapCampaignListToEventPayload } from '../campaignPayloadMappers';

describe('campaignPayloadMappers', () => {
  it('should map campaign list data to event payload', () => {
    const payload = mapCampaignListToEventPayload({
      campaigns: campaignsPage1,
      pageNumber: 0,
    });

    expect(payload).toStrictEqual({
      page_number: 0,
      total_count: 10,
      draft_count: 2,
      in_progress_count: 2,
      concluded_count: 5,
      canceled_count: 1,
    });
  });

  it('should map campaign list data of a following page to event payload', () => {
    const payload = mapCampaignListToEventPayload({
      campaigns: campaignsPage2,
      pageNumber: 1,
    });

    expect(payload).toStrictEqual({
      page_number: 1,
      total_count: 4,
      draft_count: 0,
      in_progress_count: 0,
      concluded_count: 3,
      canceled_count: 1,
    });
  });

  it('should map empty campaign list to event payload', () => {
    const payload = mapCampaignListToEventPayload({
      campaigns: [],
      pageNumber: 0,
    });

    expect(payload).toStrictEqual({
      page_number: 0,
      total_count: 0,
      draft_count: 0,
      in_progress_count: 0,
      concluded_count: 0,
      canceled_count: 0,
    });
  });
});
