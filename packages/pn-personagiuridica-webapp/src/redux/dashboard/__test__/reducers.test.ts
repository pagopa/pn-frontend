import MockAdapter from 'axios-mock-adapter';

import {
  NotificationColumnData,
  NotificationStatus,
  Sort,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { getReceivedNotifications } from '../actions';
import { setNotificationFilters, setPagination, setSorting } from '../reducers';

describe('Dashbaord redux state tests', () => {
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

  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: tenYearsAgo,
        endDate: today,
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
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    const action = await store.dispatch(
      getReceivedNotifications({
        startDate: tenYearsAgo,
        endDate: today,
        isDelegatedPage: false,
        size: 10,
      })
    );
    expect(action.type).toBe('getReceivedNotifications/fulfilled');
    expect(action.payload).toEqual(notificationsToFe);
  });

  it('Should be able to fetch the notifications list from delegated page', async () => {
    mock
      .onGet(
        `/bff/v1/notifications/received/delegated?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, notificationsDTO);
    const action = await store.dispatch(
      getReceivedNotifications({
        startDate: tenYearsAgo,
        endDate: today,
        isDelegatedPage: true,
        size: 10,
      })
    );
    expect(action.type).toBe('getReceivedNotifications/fulfilled');
    expect(action.payload).toEqual(notificationsToFe);
  });

  it('Should be able to change pagination', () => {
    const action = store.dispatch(
      setPagination({
        page: 2,
        size: 50,
      })
    );
    expect(action.type).toBe('dashboardSlice/setPagination');
    expect(action.payload).toEqual({
      page: 2,
      size: 50,
    });
  });

  it('Should be able to change sort', () => {
    const sort: Sort<NotificationColumnData> = {
      orderBy: 'notificationStatus',
      order: 'desc',
    };
    const action = store.dispatch(setSorting(sort));
    expect(action.type).toBe('dashboardSlice/setSorting');
    expect(action.payload).toEqual({
      orderBy: 'notificationStatus',
      order: 'desc',
    });
  });

  it('Should be able to change filters', () => {
    const filters = {
      startDate: new Date('2022-02-22T14:20:20.566Z'),
      endDate: new Date('2022-02-27T14:20:20.566Z'),
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp',
    };
    const action = store.dispatch(setNotificationFilters(filters));
    expect(action.type).toBe('dashboardSlice/setNotificationFilters');
    expect(action.payload).toEqual(filters);
  });
});
