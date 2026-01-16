import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  KnownSentiment,
  Notification,
  NotificationColumnData,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Sort,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import NotificationsDataSwitch from './NotificationsDataSwitch';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData>) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
  /** True when at least one filter is active (non-default). Used to show the “filtered” EmptyState variant. */
  filtersApplied: boolean;
  /** The function to be invoked if the user clicks on clean filters button */
  onCleanFilters: () => void;
  /** True if the API returned a timeout error */
  hasTimeoutError?: boolean;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
};

type LinkApiKeyProps = {
  onApiKeys: () => void;
  children?: React.ReactNode;
};

type LinkCreateNotificationProps = {
  onManualSend: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<LinkRemoveFiltersProps> = ({ children, cleanFilters }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="remove-filters"
    data-testid="link-remove-filters"
    onClick={cleanFilters}
  >
    {children}
  </Link>
);

const LinkApiKey: React.FC<LinkApiKeyProps> = ({ children, onApiKeys }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="api-keys"
    data-testid="link-api-keys"
    onClick={onApiKeys}
  >
    {children}
  </Link>
);

const LinkCreateNotification: React.FC<LinkCreateNotificationProps> = ({
  children,
  onManualSend,
}) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-second"
    key="create-notification"
    data-testid="link-create-notification"
    onClick={onManualSend}
  >
    {children}
  </Link>
);

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
  filtersApplied,
  onCleanFilters,
  hasTimeoutError = false,
}: Props) => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();

  const columns: Array<Column<NotificationColumnData>> = [
    {
      id: 'sentAt',
      label: t('table.date'),
      cellProps: { width: '9%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'recipients',
      label: t('table.recipient'),
      cellProps: { width: '15%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'subject',
      label: t('table.subject'),
      cellProps: { width: '18%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: { width: '24%' },
    },
    {
      id: 'group',
      label: t('table.groups'),
      cellProps: { width: '6%' },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      cellProps: { width: '16%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'action',
      label: '',
      cellProps: { width: '12%', align: 'right' },
      sortable: false,
    },
  ];

  const rows = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const handleRowClick = (iun: string) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(iun));
  };

  const emptyStateContent = (() => {
    if (hasTimeoutError) {
      return <Trans ns="notifiche" i18nKey="empty-state.timeout" />;
    }

    if (filtersApplied) {
      return (
        <Trans
          ns={'notifiche'}
          i18nKey={'empty-state.filtered'}
          components={[<LinkRemoveFilters key={'remove-filters'} cleanFilters={onCleanFilters} />]}
        />
      );
    }

    return (
      <Trans
        ns={'notifiche'}
        i18nKey={'empty-state.no-notifications'}
        components={[
          <LinkApiKey key={'api-keys'} onApiKeys={onApiKeys} />,
          <LinkCreateNotification key={'create-notification'} onManualSend={onManualSend} />,
        ]}
      />
    );
  })();

  return (
    <>
      {notifications && (
        <>
          {notifications.length > 0 ? (
            <PnTable
              ariaTitle={t('table.title')}
              testId="notificationsTable"
              slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
            >
              <PnTableHeader>
                {columns.map((column) => (
                  <PnTableHeaderCell
                    key={column.id}
                    sort={sort}
                    columnId={column.id}
                    sortable={column.sortable}
                    handleClick={onChangeSorting}
                    cellProps={column.cellProps}
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
                        cellProps={{
                          ...column.cellProps,
                        }}
                      >
                        <NotificationsDataSwitch
                          handleRowClick={handleRowClick}
                          data={row}
                          type={column.id}
                        />
                      </PnTableBodyCell>
                    ))}
                  </PnTableBodyRow>
                ))}
              </PnTableBody>
            </PnTable>
          ) : (
            <EmptyState
              sentimentIcon={
                hasTimeoutError || filtersApplied
                  ? KnownSentiment.DISSATISFIED
                  : KnownSentiment.NONE
              }
            >
              {emptyStateContent}
            </EmptyState>
          )}
        </>
      )}
    </>
  );
};

export default DesktopNotifications;
