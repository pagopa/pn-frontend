import MockAdapter from 'axios-mock-adapter';

import { apiClient } from '../../../api/apiClients';
import {
  BffCampaignDetailResponseV1,
  CampaignStatus,
  ChannelType,
} from '../../../generated-client/sender-informal-notifications';
import { store } from '../../store';
import { getCampaignDetail } from '../actions';
import campaignSlice, { resetState } from '../reducers';

const campaign: BffCampaignDetailResponseV1 = {
  campaignId: 'FattOrd',
  title: 'Fatturazione Ordinaria',
  description: 'Test campaign',
  startDate: '2026-07-10T10:00:00Z',
  campaignStatus: CampaignStatus.InProgress,
  serviceName: 'Servizi idrici',
  channels: [ChannelType.Io, ChannelType.Email, ChannelType.Pec],
};

describe('Campaign reducer tests', () => {
  let mock: MockAdapter;

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
      campaignDetail: {},
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

  it('Should reset state', () => {
    const stateWithCampaign = {
      campaignDetail: campaign,
    };

    const state = campaignSlice.reducer(stateWithCampaign, resetState());

    expect(state).toEqual({
      campaignDetail: {},
    });
  });
});
