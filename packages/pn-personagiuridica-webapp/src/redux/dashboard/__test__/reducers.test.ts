import MockAdapter from 'axios-mock-adapter';

import {
  NotificationStatus,
  Sort,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { getApiClient } from '../../../api/apiClients';
import { NOTIFICATIONS_LIST } from '../../../api/notifications/notifications.routes';
import { NotificationColumn } from '../../../models/Notifications';
import { getStore } from '../../store';
import { getReceivedNotifications } from '../actions';
import { setNotificationFilters, setPagination, setSorting } from '../reducers';

describe('Dashbaord redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  mockAuthentication();

  it('Initial state', () => {
    const state = getStore().getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(today),
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
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
        })
      )
      .reply(200, notificationsDTO);
    const action = await getStore().dispatch(
      getReceivedNotifications({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        isDelegatedPage: false,
      })
    );
    expect(action.type).toBe('getReceivedNotifications/fulfilled');
    expect(action.payload).toEqual(notificationsToFe);
  });

  it('Should be able to change pagination', () => {
    const action = getStore().dispatch(
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
    const sort: Sort<NotificationColumn> = {
      orderBy: 'status',
      order: 'desc',
    };
    const action = getStore().dispatch(setSorting(sort));
    expect(action.type).toBe('dashboardSlice/setSorting');
    expect(action.payload).toEqual({
      orderBy: 'status',
      order: 'desc',
    });
  });

  it('Should be able to change filters', () => {
    const filters = {
      startDate: '2022-02-22T14:20:20.566Z',
      endDate: '2022-02-27T14:20:20.566Z',
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp',
    };
    const action = getStore().dispatch(setNotificationFilters(filters));
    expect(action.type).toBe('dashboardSlice/setNotificationFilters');
    expect(action.payload).toEqual(filters);
  });
});
