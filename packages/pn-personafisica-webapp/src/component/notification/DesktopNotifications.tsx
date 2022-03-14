import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
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

import * as routes from '../../navigation/routes.const';
import FilterNotificationsTable from './FilterNotificationsTable';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const DesktopNotifications = ({ notifications, sort, onChangeSorting }: Props) => {
  const navigate = useNavigate();

  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: 'Data',
      width: '11%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
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
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
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

  // Navigation handlers
  const handleRowClick = (row: Row, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
  };

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
