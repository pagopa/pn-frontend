import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Sort,
  Notification,
  getNotificationStatusLabelAndColor,
  NotificationStatus,
  StatusTooltip,
  Item,
  ItemsTable,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';

import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  onCancelSearch: () => void;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const DesktopNotifications = ({ notifications, sort, onChangeSorting, onCancelSearch }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');

  const columns: Array<Column> = [
    {
      id: 'notificationStatus',
      label: '',
      width: '1%',
      getCellLabel(value: string) {
        return getNewNotificationBadge(value);
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'sentAt',
      label: t('table.data'),
      width: '11%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'senderId',
      label: t('table.mittente'),
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      width: '18%',
      align: 'center',
      sortable: true,
      getCellLabel(_, row: Item) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          row.notificationStatus as NotificationStatus
        );
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paNotificationId + i.toString(),
  }));

  // Navigation handlers
  const handleRowClick = (row: Item, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
  };

  return (
    <Fragment>
      <FilterNotifications />
      <ItemsTable
        columns={columns}
        rows={rows}
        sort={sort}
        onChangeSorting={onChangeSorting}
        emptyActionCallback={onCancelSearch}
      />
    </Fragment>
  );
};

export default DesktopNotifications;
