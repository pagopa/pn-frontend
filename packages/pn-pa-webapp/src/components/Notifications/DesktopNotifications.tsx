import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  KnownSentiment,
  Notification,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Row,
  Sort,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import FilterNotifications from './FilterNotifications';
import NotificationsDataSwitch from './NotificationsDataSwitch';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<Notification>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<Notification>) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
};

const LinkRemoveFilters: React.FC<{ cleanFilters: () => void }> = ({ children, cleanFilters }) => {
  const { t } = useTranslation(['notifiche']);
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

const LinkApiKey: React.FC<{ onApiKeys: () => void }> = ({ children, onApiKeys }) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-api-keys')}
      key="api-keys"
      data-testid="link-api-keys"
      onClick={onApiKeys}
    >
      {children}
    </Link>
  );
};

const LinkCreateNotification: React.FC<{ onManualSend: () => void }> = ({
  children,
  onManualSend,
}) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-second"
      aria-label={t('empty-state.aria-label-create-notification')}
      key="create-notification"
      data-testid="link-create-notification"
      onClick={onManualSend}
    >
      {children}
    </Link>
  );
};

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
}: Props) => {
  const navigate = useNavigate();
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });
  const { t } = useTranslation(['notifiche']);

  const columns: Array<Column<Notification>> = [
    {
      id: 'sentAt',
      label: t('table.date'),
      cellProps: { width: '11%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'recipients',
      label: t('table.recipient'),
      cellProps: { width: '13%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'subject',
      label: t('table.subject'),
      cellProps: { width: '23%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: { width: '20%' },
    },
    {
      id: 'group',
      label: t('table.groups'),
      cellProps: { width: '15%' },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      cellProps: { width: '18%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
  ];

  const rows = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
    // log event
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
  };

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <>
      {notifications && (
        <>
          <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
          {notifications.length > 0 ? (
            <PnTable ariaTitle={t('table.title')} testId="notificationsTable">
              <PnTableHeader>
                {columns.map((column) => (
                  <PnTableHeaderCell
                    key={column.id}
                    sort={sort}
                    columnId={column.id}
                    sortable={column.sortable}
                    handleClick={onChangeSorting}
                  >
                    {column.label}
                  </PnTableHeaderCell>
                ))}
              </PnTableHeader>
              <PnTableBody>
                {rows.map((row, index) => (
                  <PnTableBodyRow key={row.id} index={index} testId="notificationsTable.body.row">
                    {columns.map((column) => (
                      <PnTableBodyCell
                        key={column.id}
                        onClick={() => handleRowClick(row)}
                        cellProps={{
                          ...column.cellProps,
                          cursor: 'pointer',
                        }}
                      >
                        <NotificationsDataSwitch data={row} type={column.id} />
                      </PnTableBodyCell>
                    ))}
                  </PnTableBodyRow>
                ))}
              </PnTableBody>
            </PnTable>
          ) : (
            <EmptyState
              sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
            >
              {filtersApplied ? (
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
              ) : (
                <Trans
                  ns={'notifiche'}
                  i18nKey={'empty-state.no-notifications'}
                  components={[
                    <LinkApiKey key={'api-keys'} onApiKeys={onApiKeys} />,
                    <LinkCreateNotification
                      key={'create-notification'}
                      onManualSend={onManualSend}
                    />,
                  ]}
                />
              )}
            </EmptyState>
          )}
        </>
      )}
    </>
  );
};

export default DesktopNotifications;
