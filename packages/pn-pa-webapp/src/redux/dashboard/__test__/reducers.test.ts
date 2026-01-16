import MockAdapter from 'axios-mock-adapter';

import {
  GetNotificationsResponse,
  NotificationStatus,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { getSentNotifications } from '../actions';
import { setNotificationFilters, setPagination, setSorting } from '../reducers';

describe('Dashboard redux state tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;
  const notificationsPath = `/bff/v1/notifications/sent?startDate=${encodeURIComponent(
    formatToTimezoneString(tenYearsAgo)
  )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`;

  mockAuthentication();

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
    const state = store.getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: tenYearsAgo,
        endDate: today,
        status: '',
        recipientId: '',
        iunMatch: '',
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
    const mockRequest = {
      startDate: tenYearsAgo,
      endDate: today,
      size: 10,
    };
    mock.onGet(notificationsPath).reply(200, notificationsDTO);
    const action = await store.dispatch(getSentNotifications(mockRequest));
    const payload = action.payload as GetNotificationsResponse;
    expect(action.type).toBe('getSentNotifications/fulfilled');
    expect(payload).toEqual(notificationsToFe);
    expect(store.getState().dashboardState.notifications).toStrictEqual(
      notificationsToFe.resultsPage
    );
  });

  it('Should be able to change pagination', () => {
    const action = store.dispatch(
      setPagination({
        page: 2,
        size: 50,
      })
    );
    const payload = action.payload as { page: number; size: number };
    expect(action.type).toBe('dashboardSlice/setPagination');
    expect(payload).toEqual({
      page: 2,
      size: 50,
    });
  });

  it('Should be able to change sort', () => {
    const action = store.dispatch(
      setSorting({
        orderBy: 'recipients',
        order: 'desc',
      })
    );
    const payload = action.payload as { orderBy: string; order: 'desc' | 'asc' };
    expect(action.type).toBe('dashboardSlice/setSorting');
    expect(payload).toEqual({
      orderBy: 'recipients',
      order: 'desc',
    });
  });

  it('Should be able to change filters', () => {
    const action = store.dispatch(
      setNotificationFilters({
        startDate: new Date('2022-02-22T14:20:20.566Z'),
        endDate: new Date('2022-02-27T14:20:20.566Z'),
        recipientId: 'mocked-recipientId',
        status: NotificationStatus.PAID,
        subjectRegExp: 'mocked-regexp',
        iunMatch: '',
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('dashboardSlice/setNotificationFilters');
    expect(payload).toEqual({
      startDate: new Date('2022-02-22T14:20:20.566Z'),
      endDate: new Date('2022-02-27T14:20:20.566Z'),
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp',
      iunMatch: '',
    });
  });
});
