import MockAdapter from 'axios-mock-adapter';

import { apiClient } from '../../../api/axios';
import { formatDate } from '../../../api/notifications/notifications.mapper';
import { tenYearsAgo, today } from '../../../utils/date.utility';
import { exchangeToken, logout } from '../../auth/actions';
import { loginInit } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { getSentNotifications } from '../actions';
import { GetNotificationsResponse, NotificationStatus } from '../types';

const notificationsFromBe: GetNotificationsResponse = {
  result: [
    {
      iun: 'mocked-iun',
      paNotificationId: 'mocked-paNotificationId',
      senderId: 'mocked-senderId',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'mocked-recipientId'
    }
  ],
  moreResult: false,
  nextPagesKey: []
}

const notificationsToFe: GetNotificationsResponse = {
  ...notificationsFromBe,
  result: notificationsFromBe.result.map(r => ({
    ...r,
    sentAt: formatDate(r.sentAt)
  }))
}

const mockNetworkResponse = () => {
  const mock = new MockAdapter(apiClient);
  mock.onGet(`/delivery/notifications/sent`).reply(200, notificationsFromBe)
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
      endDate: today.toISOString()
    }));
    const payload = action.payload as GetNotificationsResponse;
    expect(action.type).toBe('getSentNotifications/fulfilled');
    expect(payload).toEqual(notificationsToFe);
    await store.dispatch(logout());
  })
});
