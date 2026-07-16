import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Column,
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
import NotificationsEmptyState from './NotificationsEmptyState';

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
      mode: 'truncate',
      cellProps: { width: '10%' },
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
      mode: 'truncate',
      cellProps: { width: '24%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: {
        width: '22%',
        sx: {
          display: {
            xs: 'none',
            xl: 'table-cell',
          },
        },
      },
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
      cellProps: { width: '13%', align: 'right' },
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
                        mode={column.mode}
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
            <NotificationsEmptyState
              filtersApplied={filtersApplied}
              hasTimeoutError={hasTimeoutError}
              onCleanFilters={onCleanFilters}
              onApiKeys={onApiKeys}
              onManualSend={onManualSend}
            />
          )}
        </>
      )}
    </>
  );
};

export default DesktopNotifications;
