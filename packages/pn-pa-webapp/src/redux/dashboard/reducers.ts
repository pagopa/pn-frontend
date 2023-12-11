import {
  GetNotificationsParams,
  Notification,
  Sort,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getSentNotifications } from './actions';

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState: {
    loading: false,
    notifications: [] as Array<Notification>,
    filters: {
      startDate: tenYearsAgo,
      endDate: today,
      status: '',
      recipientId: '',
      iunMatch: '',
    } as GetNotificationsParams<Date>,
    pagination: {
      nextPagesKey: [] as Array<string>,
      size: 10,
      page: 0,
      moreResult: false,
    },
    sort: {
      orderBy: '',
      order: 'asc',
    } as Sort<Notification>,
  },
  reducers: {
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.nextPagesKey = [];
        state.pagination.moreResult = false;
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
    setSorting: (state, action: PayloadAction<Sort<Notification>>) => {
      state.sort = action.payload;
    },
    setNotificationFilters: (state, action: PayloadAction<GetNotificationsParams<Date>>) => {
      state.filters = action.payload;
      // reset pagination
      state.pagination.page = 0;
      state.pagination.nextPagesKey = [];
      state.pagination.moreResult = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSentNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload.resultsPage;
      state.pagination.moreResult = action.payload.moreResult;
      // because we can jump from a page to another and nextPagesKey returns only the next three pages, we have to check if that pages already exists
      if (action.payload.nextPagesKey) {
        for (const pageKey of action.payload.nextPagesKey) {
          if (state.pagination.nextPagesKey.indexOf(pageKey) === -1) {
            state.pagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });
  },
});

export const { setPagination, setSorting, setNotificationFilters } = dashboardSlice.actions;

export default dashboardSlice;
