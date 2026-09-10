import {
  GetNotificationsParams,
  NotificationColumnData,
  RecipientNotification,
  Sort,
} from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getReceivedNotifications } from './actions';

const initialState = {
  loading: false,
  notifications: [] as Array<RecipientNotification>,
  filters: {
    startDate: undefined,
    endDate: undefined,
    communicationType: '',
    iunMatch: '',
  } as GetNotificationsParams,
  isDelegatedPage: false,
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
    moreResult: false,
  },
  sort: {
    orderBy: '',
    order: 'asc',
  } as Sort<NotificationColumnData<RecipientNotification>>,
};

type DashboardState = typeof initialState;

/* eslint-disable functional/immutable-data */
const resetPaginationState = (state: DashboardState) => {
  state.pagination.page = 0;
  state.pagination.nextPagesKey = [];
  state.pagination.moreResult = false;
};

const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState,
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
    setIsDelegatedPage: (state, action: PayloadAction<boolean>) => {
      if (state.isDelegatedPage !== action.payload) {
        state.isDelegatedPage = action.payload;
        resetPaginationState(state);
      }
    },
    setSorting: (
      state,
      action: PayloadAction<Sort<NotificationColumnData<RecipientNotification>>>
    ) => {
      state.sort = action.payload;
    },
    setNotificationFilters: (state, action: PayloadAction<GetNotificationsParams>) => {
      state.filters = action.payload;
      resetPaginationState(state);
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

export const { setPagination, setIsDelegatedPage, setSorting, setNotificationFilters } =
  dashboardSlice.actions;

export default dashboardSlice;
