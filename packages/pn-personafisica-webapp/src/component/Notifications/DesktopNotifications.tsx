import { Fragment, useRef } from 'react';
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
  EmptyState,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { Delegator } from '../../redux/delegation/types';

import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
  /** Delegator */
  currentDelegator?: Delegator;
};

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  currentDelegator,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

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
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color} eventTrackingCallback={handleEventTrackingTooltip}></StatusTooltip>;
      },
    },
  ];
  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paProtocolNumber + i.toString(),
  }));

  const handleRouteContacts = () => {
    navigate(routes.RECAPITI);
  };

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const EmptyStateProps = {
    emptyActionLabel: filtersApplied ? undefined : 'I tuoi Recapiti',
    emptyActionCallback: filtersApplied
      ? filterNotificationsRef.current.cleanFilters
      : handleRouteContacts,
    emptyMessage: filtersApplied
      ? undefined
      : 'Non hai ricevuto nessuna notifica. Vai alla sezione',
    disableSentimentDissatisfied: !filtersApplied,
    secondaryMessage: filtersApplied
      ? undefined
      : {
          emptyMessage: 'e inserisci uno più recapiti di cortesia: così, se riceverai una notifica, te lo comunicheremo.',
        },
  };

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Item, _column: Column) => {
    if (currentDelegator) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun as string, currentDelegator.mandateId));
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    }
    // log event
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
  };

  return (
    <Fragment>
      <FilterNotifications
        ref={filterNotificationsRef}
        showFilters={showFilters}
        currentDelegator={currentDelegator}
      />
      {rows.length ? (
        <ItemsTable columns={columns} rows={rows} sort={sort} onChangeSorting={onChangeSorting} />
      ) : (
        <EmptyState {...EmptyStateProps} />
      )}
    </Fragment>
  );
};

export default DesktopNotifications;
