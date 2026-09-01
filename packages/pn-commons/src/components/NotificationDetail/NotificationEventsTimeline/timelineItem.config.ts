import { NotificationDetailRecipient } from '../../../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineLegacyStatusHistory,
  NotificationTimelineStatusHistory,
} from '../../../models/NotificationTimeline';
import { getNotificationStatusInfos } from '../../../utility/notification.utility';
import {
  getRecipientPerStep,
  isTimelineGroupStep,
} from '../../../utility/notificationTimeline.utility';
import { getTimelineItemPresentation } from './notificationTimelineStatus.config';

export type TimelineItem = {
  status: NotificationTimelineStatusHistory;
  label: string;
  description: string;
  allEvents: Array<NotificationTimelineEvent>;
  hasGroupedEvents: boolean;
  recipientPerStep: Array<NotificationDetailRecipient | undefined>;
} & ReturnType<typeof getTimelineItemPresentation>;

/**
 * Builds the view model of each MITimelineItem
 */
export const getTimelineItems = (
  statusHistory: Array<NotificationTimelineStatusHistory>,
  legacyStatusHistory: Array<NotificationTimelineLegacyStatusHistory>,
  recipients: Array<NotificationDetailRecipient>,
  isSenderTimeline?: boolean
): Array<TimelineItem> => {
  const isMultiRecipient = recipients.length > 1;

  return statusHistory.map((status, index) => {
    const legacyStatus = legacyStatusHistory[index];
    const { label, description } = getNotificationStatusInfos(legacyStatus, {
      statusHistory: legacyStatusHistory,
      recipients,
      isParty: isSenderTimeline,
    });

    return {
      status,
      label,
      description,
      allEvents: legacyStatus.steps,
      hasGroupedEvents: status.steps.some(isTimelineGroupStep),
      recipientPerStep:
        isMultiRecipient && isSenderTimeline ? getRecipientPerStep(status.steps, recipients) : [],
      ...getTimelineItemPresentation(status.status, index === 0),
    };
  });
};
