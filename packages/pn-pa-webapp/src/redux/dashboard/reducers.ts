import { createSlice } from '@reduxjs/toolkit';
import {
  formatToTimezoneString,
  getNextDay,
  GetNotificationsParams,
  Notification,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { getSentNotifications, setPagination, setSorting, setNotificationFilters } from './actions';

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState: {
    loading: false,
    notifications: [] as Array<Notification>,
    filters: {
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      status: '',
      recipientId: '',
      iunMatch: '',
    } as GetNotificationsParams,
    pagination: {
      nextPagesKey: [] as Array<string>,
      size: 10,
      page: 0,
      moreResult: false,
    },
    sort: {
      orderBy: '',
      order: 'asc' as 'asc' | 'desc',
    },
  },
  reducers: {},
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
    builder.addCase(setPagination, (state, action) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.nextPagesKey = [];
        state.pagination.moreResult = false;
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    });
    builder.addCase(setSorting, (state, action) => {
      state.sort = action.payload;
    });
    builder.addCase(setNotificationFilters, (state, action) => {
      state.filters = action.payload;
      // reset pagination
      state.pagination.page = 0;
      state.pagination.nextPagesKey = [];
      state.pagination.moreResult = false;
    });
  },
});

export default dashboardSlice;
