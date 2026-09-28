import {
  GetNotificationsParams,
  NotificationColumnData,
  RecipientNotification,
  Sort,
} from '@pagopa-pn/pn-commons';

export const dashboardInitialState = {
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

export const dashboardPaginatedState = {
  ...dashboardInitialState,
  pagination: {
    ...dashboardInitialState.pagination,
    nextPagesKey: ['stale-page-key'],
    page: 1,
    moreResult: true,
  },
};
