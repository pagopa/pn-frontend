export enum TrackEventType {
  GET_NOTIFICATIONS = 'getSentNotifications/fulfilled',
  NOTIFICATIONS_CHANGE_PAGE = 'setPagination',
  NOTIFICATIONS_GO_TO_DETAIL = 'NOTIFICATIONS_GO_TO_DETAIL'
}

export const events: {
  [key: string]: {
    category: string;
    action: string;
  };
} = {
  [TrackEventType.GET_NOTIFICATIONS]: {
    category: 'notifications',
    action: 'get notifications list'
  },
  [TrackEventType.NOTIFICATIONS_CHANGE_PAGE]: {
    category: 'notifications',
    action: 'change page'
  },
  [TrackEventType.NOTIFICATIONS_GO_TO_DETAIL]: {
    category: 'notifications',
    action: 'go to notification detail'
  }
};
