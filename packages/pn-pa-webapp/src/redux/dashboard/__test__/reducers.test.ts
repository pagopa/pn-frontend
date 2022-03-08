import { GetNotificationsResponse, NotificationStatus, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { getSentNotifications, setNotificationFilters, setPagination, setSorting } from '../actions';
import { notificationsToFe } from './test-utils';

describe('Dashbaord redux state tests', () => {

  mockAuthentication();
  
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
    const apiSpy = jest.spyOn(NotificationsApi, 'getSentNotifications');
    apiSpy.mockResolvedValue(notificationsToFe);
    const action = await store.dispatch(getSentNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString()
    }));
    const payload = action.payload as GetNotificationsResponse;
    expect(action.type).toBe('getSentNotifications/fulfilled');
    expect(payload).toEqual(notificationsToFe);
  });

  it('Should be able to change pagination', () => {
    const action = store.dispatch(setPagination({
      page: 2,
      size: 50
    }));
    const payload = action.payload as {page: number; size: number};
    expect(action.type).toBe('setPagination');
    expect(payload).toEqual({
      page: 2,
      size: 50
    });
  });

  it('Should be able to change sort', () => {
    const action = store.dispatch(setSorting({
      orderBy: 'status',
      order: 'desc'
    }));
    const payload = action.payload as {orderBy: string; order: 'desc' | 'asc'};
    expect(action.type).toBe('setSorting');
    expect(payload).toEqual({
      orderBy: 'status',
      order: 'desc'
    });
  });

  it('Should be able to change filters', () => {
    const action = store.dispatch(setNotificationFilters({
      startDate: '2022-02-22T14:20:20.566Z',
      endDate: '2022-02-27T14:20:20.566Z',
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp'
    }));
    const payload = action.payload;
    expect(action.type).toBe('setNotificationFilters');
    expect(payload).toEqual({
      startDate: '2022-02-22T14:20:20.566Z',
      endDate: '2022-02-27T14:20:20.566Z',
      recipientId: 'mocked-recipientId',
      status: NotificationStatus.PAID,
      subjectRegExp: 'mocked-regexp'
    });
  });
});
