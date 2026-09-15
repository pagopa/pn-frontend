import MockAdapter from 'axios-mock-adapter';

import { campaignsDTO } from '../../../__mocks__/Campaigns.mock';
import { apiClient } from '../../../api/apiClients';
import { BffCampaignSearchResponseV1 } from '../../../generated-client/informal-notifications';
import { store } from '../../store';
import { getCampaigns } from '../actions';
import { setPagination } from '../reducers';

describe('Campaign redux state tests', () => {
  let mock: MockAdapter;

  const campaignsPath = '/bff/v1/notifications/informal/campaigns?size=10';

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
    mock.onGet(campaignsPath).reply(200, campaignsDTO);

    const action = await store.dispatch(
      getCampaigns({
        size: 10,
      })
    );

    const payload = action.payload as BffCampaignSearchResponseV1;

    expect(action.type).toBe('getCampaigns/fulfilled');
    expect(payload).toEqual(campaignsDTO);
    expect(store.getState().campaignState.campaigns).toStrictEqual(campaignsDTO.resultsPage);
    expect(store.getState().campaignState.pagination.moreResult).toBe(true);
    expect(store.getState().campaignState.pagination.nextPagesKey).toEqual(['page-key-1']);
  });

  it('Should not duplicate nextPagesKey', async () => {
    mock.onGet(campaignsPath).reply(200, campaignsDTO);

    await store.dispatch(getCampaigns({ size: 10 }));
    await store.dispatch(getCampaigns({ size: 10 }));

    expect(store.getState().campaignState.pagination.nextPagesKey).toEqual(['page-key-1']);
  });

  it('Should be able to change pagination', () => {
    const action = store.dispatch(
      setPagination({
        page: 1,
        size: 10,
      })
    );

    const payload = action.payload as { page: number; size: number };

    expect(action.type).toBe('campaignSlice/setPagination');
    expect(payload).toEqual({
      page: 1,
      size: 10,
    });
  });

  it('Should reset pagination when page size changes', () => {
    store.dispatch(
      setPagination({
        page: 0,
        size: 20,
      })
    );

    expect(store.getState().campaignState.pagination).toEqual({
      nextPagesKey: [],
      size: 20,
      page: 0,
      moreResult: false,
    });
  });
});
