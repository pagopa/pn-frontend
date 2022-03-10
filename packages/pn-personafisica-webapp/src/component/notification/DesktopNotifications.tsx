import { Fragment } from 'react';
import {
  Column,
  NotificationsTable,
  Row,
  Sort,
  Notification,
  getNotificationStatusLabelAndColor,
  NotificationStatus,
  StatusTooltip,
} from '@pagopa-pn/pn-commons';

import FilterNotificationsTable from './FilterNotificationsTable';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const DesktopNotifications = ({ notifications, sort, onChangeSorting }: Props) => {
  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: 'Data',
      width: '11%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'senderId',
      label: 'Mittente',
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      width: '18%',
      align: 'center',
      sortable: true,
      getCellLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: i.toString(),
  }));

  return (
    <Fragment>
      <FilterNotificationsTable />
      <NotificationsTable
        columns={columns}
        rows={rows}
        sort={sort}
        onChangeSorting={onChangeSorting}
      />
    </Fragment>
  );
};

export default DesktopNotifications;
