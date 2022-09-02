import { GetNotificationsParams, GetNotificationsResponse, Sort } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AnyAsyncThunk, RejectedWithValueActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { NotificationColumn } from '../../models/Notifications';

/* eslint-disable-next-line functional/no-let */
let niceCounter = 0;

export enum DASHBOARD_ACTIONS  {
  GET_RECEIVED_NOTIFICATIONS = 'getReceivedNotifications',
}

function performThunkAction<T, U>(action: (params: T) => Promise<U> ) {
  return async (_params: T, { rejectWithValue }: { rejectWithValue: RejectedWithValueActionFromAsyncThunk<AnyAsyncThunk>}) => {
    try {
      return await action(_params);
    } catch (e) {
      return rejectWithValue(e);
    }
  };
}

export const getReceivedNotifications2 = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
  performThunkAction((params: GetNotificationsParams) => NotificationsApi.getReceivedNotifications(params))
);

export const getReceivedNotifications = createAsyncThunk<
  GetNotificationsResponse,
  GetNotificationsParams
>(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
  performThunkAction((params: GetNotificationsParams) => {
    console.log('in action getReceivedNotifications, niceCounter');
    console.log(niceCounter);
    const paramsToAdd = /* niceCounter % 2 === 0 ? { startDate: "toto" } : */ {};
    niceCounter++;
    return NotificationsApi.getReceivedNotifications({...params, ...paramsToAdd});
  })
);


export const setPagination = createAction<{ page: number; size: number }>('setPagination');

export const setSorting = createAction<Sort<NotificationColumn>>('setSorting');

export const setNotificationFilters =
  createAction<GetNotificationsParams>('setNotificationFilters');

export const setMandateId = createAction<string | undefined>('setMandateId');
