import MockAdapter from 'axios-mock-adapter';

import { campaignsDTO, campaignsPage2DTO } from '../../../__mocks__/Campaigns.mock';
import { apiClient } from '../../../api/apiClients';
import { BffCampaignSearchResponseV1 } from '../../../generated-client/informal-notifications';
import { store } from '../../store';
import { getCampaigns } from '../actions';

describe('Campaign redux state tests', () => {
  let mock: MockAdapter;

  const campaignsPath = (size?: number) =>
    `/bff/v1/notifications/informal/campaigns?size=${size ?? 10}`;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().campaignState;

    expect(state).toEqual({
      campaigns: [],
      pagination: {
        nextPagesKey: [],
        size: 10,
        page: 0,
        moreResult: false,
      },
    });
  });

  it('Should be able to fetch the campaigns list', async () => {
    mock.onGet(campaignsPath()).reply(200, campaignsDTO);

    const action = await store.dispatch(getCampaigns({ page: 0, size: 10 }));

    const payload = action.payload as BffCampaignSearchResponseV1;

    expect(action.type).toBe('getCampaigns/fulfilled');
    expect(payload).toEqual(campaignsDTO);
    expect(store.getState().campaignState.campaigns).toStrictEqual(campaignsDTO.resultsPage);
    expect(store.getState().campaignState.pagination.moreResult).toBe(true);
    expect(store.getState().campaignState.pagination.nextPagesKey).toEqual(['page-key-1']);
  });

  it('Should not duplicate nextPagesKey', async () => {
    mock.onGet(campaignsPath()).reply(200, campaignsDTO);

    await store.dispatch(getCampaigns({ page: 0, size: 10 }));
    await store.dispatch(getCampaigns({ page: 0, size: 10 }));

    expect(store.getState().campaignState.pagination.nextPagesKey).toEqual(['page-key-1']);
  });

  it('Should update pagination when campaigns are retrieved', async () => {
    mock.onGet(campaignsPath()).reply(200, campaignsDTO);

    await store.dispatch(getCampaigns({ page: 1, size: 10 }));

    expect(store.getState().campaignState.pagination).toEqual({
      page: 1,
      size: 10,
      moreResult: true,
      nextPagesKey: ['page-key-1'],
    });
  });

  it('Should reset pagination when page size changes', async () => {
    mock.onGet(campaignsPath()).replyOnce(200, campaignsDTO);
    mock.onGet(campaignsPath(20)).replyOnce(200, campaignsPage2DTO);

    await store.dispatch(getCampaigns({ page: 0, size: 10 }));

    expect(store.getState().campaignState.pagination.nextPagesKey).toEqual(['page-key-1']);

    await store.dispatch(getCampaigns({ page: 0, size: 20 }));

    expect(store.getState().campaignState.pagination).toEqual({
      nextPagesKey: [],
      size: 20,
      page: 0,
      moreResult: false,
    });
  });
});
