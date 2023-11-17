import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link, Typography } from '@mui/material';
import {
  Column,
  EmptyState,
  Item,
  KnownSentiment,
  Notification,
  NotificationStatus,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Sort,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import { NotificationColumn } from '../../models/Notifications';
import * as routes from '../../navigation/routes.const';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
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

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

  const columns: Array<Column<NotificationColumn>> = [
    {
      id: 'sentAt',
      label: t('table.date'),
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
      id: 'recipients',
      label: t('table.recipient'),
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'subject',
      label: t('table.subject'),
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
      id: 'group',
      label: t('table.groups'),
      width: '15%',
      getCellLabel(value: string) {
        return (
          value && (
            <TagGroup visibleItems={4}>
              <Tag value={value} />
            </TagGroup>
          )
        );
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      width: '18%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string, i: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(value as NotificationStatus, {
          recipients: i.recipients as Array<string>,
        });
        return (
          <StatusTooltip
            label={label}
            tooltip={tooltip}
            color={color}
            eventTrackingCallback={handleEventTrackingTooltip}
          />
        );
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
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
              <PnTableBody testId="tableBody">
                {rows.map((row, index) => (
                  <PnTableBodyRow key={row.id} index={index}>
                    {columns.map((column) => (
                      <PnTableBodyCell
                        disableAccessibility={column.disableAccessibility}
                        key={column.id}
                        onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                        cellProps={{
                          width: column.width,
                          align: column.align,
                          cursor: column.onClick ? 'pointer' : 'auto',
                        }}
                      >
                        {column.getCellLabel(row[column.id as keyof Item], row)}
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
