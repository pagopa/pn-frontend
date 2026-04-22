import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Column,
  Notification,
  NotificationColumnData,
  NotificationsDataSwitch,
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
import { Delegator } from '../../redux/delegation/types';
import FilterNotifications from './FilterNotifications';
import NotificationsEmptyState from './NotificationsEmptyState';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData>) => void;
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

  const columns: Array<Column<NotificationColumnData>> = [
    {
      id: 'badge',
      label: '',
      cellProps: { width: '1%' },
    },
    {
      id: 'sentAt',
      label: t('table.data'),
      mode: 'truncate',
      cellProps: { width: '10%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      mode: 'truncate',
      cellProps: { width: '15%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      mode: 'truncate',
      cellProps: { width: '19%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: { width: '24%' },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      cellProps: { width: '17%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'action',
      label: '',
      cellProps: { width: '14%', align: 'right' },
    },
  ];

  const rows: Array<Row<Notification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (iun: string) => {
    if (currentDelegator) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(iun, currentDelegator.mandateId));
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(iun));
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
        <PnTable
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
          filterNotificationsRef={filterNotificationsRef}
          currentDelegator={currentDelegator}
        />
      )}
    </>
  );
};

export default DesktopNotifications;
