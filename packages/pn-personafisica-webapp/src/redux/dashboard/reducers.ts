import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GetNotificationsParams,
  tenYearsAgo,
  today,
  Notification,
  formatToTimezoneString,
  getNextDay,
} from '@pagopa-pn/pn-commons';

import { getReceivedNotifications } from './actions';

/* eslint-disable functional/immutable-data */
const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState: {
    loading: false,
    notifications: [] as Array<Notification>,
    filters: {
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      iunMatch: undefined,
      mandateId: undefined,
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
  reducers: {
    setPagination: (state, action: PayloadAction<{page: number; size: number}>) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.nextPagesKey = [];
        state.pagination.moreResult = false;
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
    setSorting: (state, action: PayloadAction<{orderBy: string; order: 'asc' | 'desc'}>) => {
      state.sort = action.payload;
    },
    setNotificationFilters: (state, action: PayloadAction<GetNotificationsParams>) => {
      state.filters = action.payload;
      // reset pagination
      state.pagination.page = 0;
      state.pagination.nextPagesKey = [];
      state.pagination.moreResult = false;
    },
    setMandateId: (state, action: PayloadAction<string | undefined>) => {
      state.notifications = [];
      state.filters = {
        iunMatch: undefined,
        mandateId: action.payload,
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
      };
      // reset pagination
      state.pagination.size = 10;
      state.pagination.page = 0;
      state.pagination.nextPagesKey = [];
      state.pagination.moreResult = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getReceivedNotifications.fulfilled, (state, action) => {
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

export const { setPagination, setSorting, setNotificationFilters, setMandateId } =
  dashboardSlice.actions;

export default dashboardSlice;
