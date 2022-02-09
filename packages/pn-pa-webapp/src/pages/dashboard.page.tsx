import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // useSelector
import { getSentNotifications } from '../redux/dashboard/actions';
// import { RootState } from '../redux/store';
import NotificationsTable from '../components/NotificationsTable/NotificactionsTable';

import { Notification, NotificationStatus } from '../redux/dashboard/types';

const Dashboard = () => {
  const dispatch = useDispatch();
  // const notifications = useSelector((state: RootState) => state.dashboardState.notifications);
  const notifications: Array<Notification> = [
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id1',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'recipientId1'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id2',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERING,
      recipientId: 'recipientId2'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id3',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.PAID,
      recipientId: 'recipientId3'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id4',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipientId: 'recipientId4'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id5',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.RECEIVED,
      recipientId: 'recipientId5'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id6',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.UNREACHABLE,
      recipientId: 'recipientI6'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id7',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.VIEWED,
      recipientId: 'recipientId7'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id8',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'recipientI8'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id9',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.VIEWED,
      recipientId: 'recipientId9'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id10',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.RECEIVED,
      recipientId: 'recipientId10'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id11',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.UNREACHABLE,
      recipientId: 'recipientId11'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id12',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipientId: 'recipientId12'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id13',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.PAID,
      recipientId: 'recipientId13'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id14',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.UNREACHABLE,
      recipientId: 'recipientId14'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id15',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERING,
      recipientId: 'recipientId15'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id16',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipientId: 'recipientId16'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id17',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipientId: 'recipientId17'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id18',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.RECEIVED,
      recipientId: 'recipientId18'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id19',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.VIEWED,
      recipientId: 'recipientId19'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id20',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'recipientId20'
    },
    {
      iun: 'Codice Iun',
      sentAt: '2022-02-09T12:50:23.500Z',
      paNotificationId: 'id21',
      senderId: 'senderId',
      subject: 'Lorem ipsum dolor sit ametsec tetur adipisici',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'recipientId21'
    }
  ];
  

  useEffect(() => {
    dispatch(getSentNotifications({ startDate: '2022-01-01T00:00:00.000Z', endDate: '2022-12-31T00:00:00.000Z' }));
  }, []);

  return (
    <React.Fragment>
      {notifications && <NotificationsTable notifications={notifications}/>}
    </React.Fragment>
  );
};

export default Dashboard;
