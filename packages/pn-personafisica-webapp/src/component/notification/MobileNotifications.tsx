import {
  CardElem,
  getNotificationStatusLabelAndColor,
  Notification,
  NotificationsCard,
  NotificationStatus,
  Row,
  StatusTooltip,
} from '@pagopa-pn/pn-commons';

type Props = {
  notifications: Array<Notification>;
};

const MobileNotifications = ({ notifications }: Props) => {
  const cardHeader: [CardElem, CardElem] = [
    {
      id: 'sentAt',
      label: 'Data',
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      getLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const cardBody: Array<CardElem> = [
    {
      id: 'senderId',
      label: 'Mittente',
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      getLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      getLabel(value: string) {
        return value;
      },
    }
  ];

  const cardData: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: i.toString(),
  }));

  return <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData}/>;
};

export default MobileNotifications;
