import { uxAction, uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { TrackingConfigs } from './trackingTypes';

type NewNotificationEventType =
  | PAEventsType.SEND_PA_DEBT_POSITION
  | PAEventsType.SEND_PA_DEBT_POSITION_DETAIL
  | PAEventsType.SEND_PA_DOCUMENTATION
  | PAEventsType.SEND_PA_NEW_NOTIFICATION
  | PAEventsType.SEND_PA_NEW_NOTIFICATION_UX_SUCCESS
  | PAEventsType.SEND_PA_PRELIMINARY_INFORMATION
  | PAEventsType.SEND_PA_RECIPIENTS;

export const newNotificationTrackingConfigs: TrackingConfigs<NewNotificationEventType> = {
  [PAEventsType.SEND_PA_DEBT_POSITION]: () => uxScreenView(),
  [PAEventsType.SEND_PA_DEBT_POSITION_DETAIL]: () => uxScreenView(),
  [PAEventsType.SEND_PA_DOCUMENTATION]: () => uxScreenView(),
  [PAEventsType.SEND_PA_NEW_NOTIFICATION]: () => uxAction(),
  [PAEventsType.SEND_PA_NEW_NOTIFICATION_UX_SUCCESS]: () => uxScreenView(),
  [PAEventsType.SEND_PA_PRELIMINARY_INFORMATION]: () => uxScreenView(),
  [PAEventsType.SEND_PA_RECIPIENTS]: () => uxScreenView(),
};
