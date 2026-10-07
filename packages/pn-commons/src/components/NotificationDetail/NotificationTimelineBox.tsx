import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
} from '../../models';
import { getNotificationStatusInfos } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import {
  emptyLegalFactPlan,
  getStatusLegalFactPlan,
} from '../../utility/notificationTimeline.utility';
import NotificationTimelineDescription from './NotificationEventsTimeline/NotificationTimelineDescription';
import NotificationStatusBox from './NotificationStatusBox';

type NotificationTimelineBoxProps = {
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  isParty: boolean;
  onTimelineClick?: () => void;
  clickHandler: (legalFactId: LegalFactId) => void;
  isNewTimelineCopyEnabled?: boolean;
  perfectionLink?: string;
  mandateId?: string;
  delegatorName?: string;
};

const NotificationTimelineBox: React.FC<NotificationTimelineBoxProps> = ({
  statusHistory,
  recipients,
  isParty,
  onTimelineClick,
  clickHandler,
  isNewTimelineCopyEnabled = false,
  perfectionLink,
  mandateId,
  delegatorName,
}) => {
  if (statusHistory.length === 0) {
    return null;
  }

  const notificationStatusInfos = getNotificationStatusInfos(statusHistory[0], {
    statusHistory,
    recipients,
    isParty,
    mandateId,
    delegatorName,
  });

  const plan = isNewTimelineCopyEnabled
    ? getStatusLegalFactPlan(statusHistory[0], (event) => event.hidden)
    : emptyLegalFactPlan<INotificationDetailTimeline>();

  const hideDescription =
    isNewTimelineCopyEnabled && statusHistory[0].status === NotificationStatus.DELIVERING;

  return (
    <NotificationStatusBox
      ariaLabel={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.notification-timeline-section.aria-label'
      )}
      color={notificationStatusInfos.color}
      description={
        hideDescription ? null : (
          <NotificationTimelineDescription
            legalFacts={plan.legalFacts}
            description={notificationStatusInfos.description}
            clickHandler={clickHandler}
            slotProps={{ typography: { variant: 'body2' } }}
            isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
            perfectionLink={perfectionLink}
          />
        )
      }
      label={notificationStatusInfos.label}
      detailsLabel={getLocalizedOrDefaultLabel('notifications', 'go-to-detail')}
      onDetailsClick={onTimelineClick}
      title={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.notification-timeline-section.title'
      )}
    />
  );
};

export default NotificationTimelineBox;
