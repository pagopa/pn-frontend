import {
  formatToTimezoneString,
  getNextDay,
  GetNotificationsResponse,
  NotificationStatus,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getReceivedNotifications } from '../actions';
import { setMandateId, setNotificationFilters, setPagination, setSorting } from '../reducers';
import { notificationsToFe } from './test-utils';

describe('Dashbaord redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().dashboardState;
    expect(state).toEqual({
      loading: false,
      notifications: [],
      filters: {
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(today),
        iunMatch: ''
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
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotifications');
    apiSpy.mockResolvedValue(notificationsToFe);
    const action = await store.dispatch(
      getReceivedNotifications({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
      })
    );
    const payload = action.payload as GetNotificationsResponse;
    expect(action.type).toBe('getReceivedNotifications/fulfilled');
    expect(payload).toEqual(notificationsToFe);
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
        orderBy: 'status',
        order: 'desc',
      })
    );
    const payload = action.payload as { orderBy: string; order: 'desc' | 'asc' };
    expect(action.type).toBe('dashboardSlice/setSorting');
    expect(payload).toEqual({
      orderBy: 'status',
      order: 'desc',
    });
  });

  it('Should be able to change filters', () => {
    const action = store.dispatch(
      setNotificationFilters({
        startDate: '2022-02-22T14:20:20.566Z',
        endDate: '2022-02-27T14:20:20.566Z',
        recipientId: 'mocked-recipientId',
        status: NotificationStatus.PAID,
        subjectRegExp: 'mocked-regexp',
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('dashboardSlice/setNotificationFilters');
    expect(payload).toEqual({
      startDate: '2022-02-22T14:20:20.566Z',
      endDate: '2022-02-27T14:20:20.566Z',
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp',
    });
  });

  it('Should be able to set mandate id', () => {
    const action = store.dispatch(setMandateId('mocked-mandate-id'));
    const payload = action.payload;
    expect(action.type).toBe('dashboardSlice/setMandateId');
    expect(payload).toEqual('mocked-mandate-id');
  });
});
