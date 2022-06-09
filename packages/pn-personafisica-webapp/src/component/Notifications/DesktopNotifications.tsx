import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Sort,
  Notification,
  getNotificationStatusInfos,
  NotificationStatus,
  StatusTooltip,
  Item,
  ItemsTable,
} from '@pagopa-pn/pn-commons';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';

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
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
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
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
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
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(_, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus
        );
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paProtocolNumber + i.toString(),
  }));

  const ItemsTableEmptyState = () => {
    const isEmptyByFilters:boolean = !!filters.iunMatch;
    const emptyMessage: any = isEmptyByFilters ? undefined : 'Non hai ricevuto nessuna notifica. Attiva il servizio "Piattaforma Notifiche" sull\'app IO o inserisci un recapito di cortesia nella sezione Recapiti: così, se riceverai una notifica, te lo comunicheremo.';
    const emptyActionLabel: any = isEmptyByFilters ? undefined : '';
    return <Fragment>
      <ItemsTable
        emptyMessage={emptyMessage}
        emptyActionLabel={emptyActionLabel}
        columns={columns}
        rows={rows}
        sort={sort}
        disableSentimentDissatisfied={true}
        onChangeSorting={onChangeSorting}
        emptyActionCallback={onCancelSearch}
      />
    </Fragment>;
  };
  
  // Navigation handlers
  const handleRowClick = (row: Item, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATIONS_GO_TO_DETAIL);
  };

  return (
    <Fragment>
      <FilterNotifications />
      <ItemsTableEmptyState />
    </Fragment>
  );
};

export default DesktopNotifications;
