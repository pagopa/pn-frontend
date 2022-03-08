import MockAdapter from 'axios-mock-adapter';
import { tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { apiClient } from '../../../api/axios';
import { exchangeToken, logout } from '../../auth/actions';
import { loginInit } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { getSentNotifications } from '../actions';
import { GetNotificationsResponse } from '../types';

const mockNetworkResponse = () => {
  const mock = new MockAdapter(apiClient);
  mock.onGet(`/delivery/notifications/received`).reply(200, {
    moreResult: false,
    nextPagesKey: [],
    result: []
  })
}

loginInit();

describe('Dashbaord redux state tests', () => {
  
  it('Initial state', () => {
    const state = store.getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        recipientId: '',
        status: '',
        subjectRegExp: '',
      },
      pagination: {
        nextPagesKey: [],
        size: 10,
        page: 0,
        moreResult: false,
      },
      sort: {
        orderBy: '',
        order: 'asc' as 'asc' | 'desc',
      },
    });
  });

  it('Should be able to fetch the notifications list', async () => {
    await store.dispatch(exchangeToken('mocked-token'));
    mockNetworkResponse();
    const action = await store.dispatch(getSentNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString(),
    }));
    const payload = action.payload as GetNotificationsResponse;
    expect(action.type).toBe('getSentNotifications/fulfilled');
    expect(payload).toEqual({
      moreResult: false,
      nextPagesKey: [],
      result: []
    });
    await store.dispatch(logout());
  })
});
