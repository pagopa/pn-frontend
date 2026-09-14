import MockAdapter from 'axios-mock-adapter';

import { campaignsDTO } from '../../../__mocks__/Campaigns.mock';
import { apiClient } from '../../../api/apiClients';
import {
  BffCampaignDetailResponseV1,
  BffCampaignSearchResponseV1,
  CampaignStatus,
  ChannelType,
} from '../../../generated-client/informal-notifications';
import { store } from '../../store';
import { getCampaignDetail, getCampaigns } from '../actions';
import campaignSlice, { resetCampaignDetail, setPagination } from '../reducers';

const campaign: BffCampaignDetailResponseV1 = {
  campaignId: 'FattOrd',
  title: 'Fatturazione Ordinaria',
  description: 'Test campaign',
  startDate: '2026-07-10T10:00:00Z',
  campaignStatus: CampaignStatus.InProgress,
  serviceName: 'Servizi idrici',
  channels: [ChannelType.Io, ChannelType.Email, ChannelType.Pec],
};

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

  it('Should return initial state', () => {
    const state = campaignSlice.reducer(undefined, { type: '' });

    expect(state).toEqual({
      campaigns: [],
      campaignDetail: {},
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

    const payload = action.payload as {
      page: number;
      size: number;
    };

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

  it('Should set campaign detail when getCampaignDetail is fulfilled', () => {
    const action = getCampaignDetail.fulfilled(campaign, '', campaign.campaignId);

    const state = campaignSlice.reducer(undefined, action);

    expect(state.campaignDetail).toEqual(campaign);
  });

  it('Should be able to fetch campaign detail', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaign.campaignId}`)
      .reply(200, campaign);

    const action = await store.dispatch(getCampaignDetail(campaign.campaignId));

    expect(action.type).toBe('getCampaignDetail/fulfilled');
    expect(action.payload).toEqual(campaign);

    expect(store.getState().campaignState.campaignDetail).toStrictEqual(campaign);
  });

  it('Should reset campaign detail', () => {
    const stateWithCampaign = {
      campaigns: [],
      campaignDetail: campaign,
      pagination: {
        nextPagesKey: [] as Array<string>,
        size: 10,
        page: 0,
        moreResult: false,
      },
    };

    const state = campaignSlice.reducer(stateWithCampaign, resetCampaignDetail());

    expect(state).toEqual({
      campaigns: [],
      campaignDetail: {},
      pagination: {
        nextPagesKey: [],
        size: 10,
        page: 0,
        moreResult: false,
      },
    });
  });
});
