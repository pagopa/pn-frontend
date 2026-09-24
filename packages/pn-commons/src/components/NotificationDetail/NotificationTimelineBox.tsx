import { LegalFactId, NotificationDetailRecipient, NotificationStatusHistory } from '../../models';
import { getNotificationStatusInfos } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import NotificationTimelineDescription from './NotificationEventsTimeline/NotificationTimelineDescription';
import NotificationStatusBox from './NotificationStatusBox';

type NotificationTimelineBoxProps = {
  statusHistory: Array<NotificationStatusHistory>;
  recipients: Array<NotificationDetailRecipient>;
  isParty: boolean;
  onTimelineClick?: () => void;
  clickHandler: (legalFactId: LegalFactId) => void;
  isNewTimelineCopyEnabled?: boolean;
};

const NotificationTimelineBox: React.FC<NotificationTimelineBoxProps> = ({
  statusHistory,
  recipients,
  isParty,
  onTimelineClick,
  clickHandler,
  isNewTimelineCopyEnabled = false,
}) => {
  if (statusHistory.length === 0) {
    return null;
  }

  const notificationStatusInfos = getNotificationStatusInfos(statusHistory[0], {
    statusHistory,
    recipients,
    isParty,
  });

  return (
    <NotificationStatusBox
      ariaLabel={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.notification-timeline-section.aria-label'
      )}
      color={notificationStatusInfos.color}
      description={
        <NotificationTimelineDescription
          legacyStatus={statusHistory[0]}
          description={notificationStatusInfos.description}
          clickHandler={clickHandler}
          slotProps={{ typography: { variant: 'body2' } }}
          recipients={recipients}
          isSenderTimeline={isParty}
          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
        />
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
