import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  Item,
  ItemsTable,
  KnownSentiment,
  Notification,
  NotificationStatus,
  Sort,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
} from '@pagopa-pn/pn-commons';

import { NotificationColumn } from '../../models/Notifications';
import * as routes from '../../navigation/routes.const';
import { Delegator } from '../../redux/delegation/types';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
  /** Delegator */
  currentDelegator?: Delegator;
};

const LinkRemoveFilters: React.FC<{ cleanFilters: () => void }> = ({ children, cleanFilters }) => {
  const { t } = useTranslation('notifiche');
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-remove-filters')}
      key="remove-filters"
      data-testid="link-remove-filters"
      onClick={cleanFilters}
    >
      {children}
    </Link>
  );
};

const LinkRouteContacts: React.FC = ({ children }) => {
  const { t } = useTranslation('notifiche');
  const navigate = useNavigate();
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-route-contacts')}
      key="route-contacts"
      data-testid="link-route-contacts"
      onClick={() => navigate(routes.RECAPITI)}
    >
      {children}
    </Link>
  );
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

  const columns: Array<Column<NotificationColumn>> = [
    {
      id: 'notificationStatus',
      label: '',
      width: '1%',
      getCellLabel(value: string) {
        return getNewNotificationBadge(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'sentAt',
      label: t('table.data'),
      width: '11%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return formatDate(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
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
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      width: '18%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(_: string, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus,
          { recipients: row.recipients as Array<string> }
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
  ];
  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paProtocolNumber + i.toString(),
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (currentDelegator) {
      navigate(
        routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun as string, currentDelegator.mandateId)
      );
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    }
  };

  return (
    <>
      <FilterNotifications
        ref={filterNotificationsRef}
        showFilters={showFilters}
        currentDelegator={currentDelegator}
      />
      {rows.length ? (
        <ItemsTable
          columns={columns}
          rows={rows}
          sort={sort}
          onChangeSorting={onChangeSorting}
          testId="notificationsTable"
        />
      ) : (
        <EmptyState
          sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
        >
          {filtersApplied && (
            <Trans
              ns={'notifiche'}
              i18nKey={'empty-state.filtered'}
              components={[
                <LinkRemoveFilters
                  key={'remove-filters'}
                  cleanFilters={filterNotificationsRef.current.cleanFilters}
                />,
              ]}
            />
          )}
          {!filtersApplied && currentDelegator && (
            <Trans
              values={{ name: currentDelegator.delegator?.displayName }}
              ns={'notifiche'}
              i18nKey={'empty-state.delegate'}
            />
          )}
          {!filtersApplied && !currentDelegator && (
            <Trans
              ns={'notifiche'}
              i18nKey={'empty-state.no-notifications'}
              components={[<LinkRouteContacts key={'route-contacts'} />]}
            />
          )}
        </EmptyState>
      )}
    </>
  );
};

export default DesktopNotifications;
