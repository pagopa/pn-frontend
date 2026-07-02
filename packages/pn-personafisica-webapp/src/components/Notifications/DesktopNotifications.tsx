import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Column,
  NotificationColumnData,
  NotificationCommunicationType,
  NotificationsRecipientDataSwitch,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  RecipientNotification,
  Row,
  Sort,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { Delegator } from '../../redux/delegation/types';
import FilterNotifications from './FilterNotifications';
import NotificationsEmptyState from './NotificationsEmptyState';

type Props = {
  notifications: Array<RecipientNotification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData<RecipientNotification>>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData<RecipientNotification>>) => void;
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
      cellProps: { width: '8%' },
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      mode: 'truncate',
      cellProps: { width: '12%' },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      mode: 'truncate',
      cellProps: { width: '26%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: { width: '22%', sx: { display: { xs: 'none', xl: 'table-cell' } } },
    },
    {
      id: 'action',
      label: '',
      cellProps: { width: '14%', align: 'right' },
    },
  ];

  const rows: Array<Row<RecipientNotification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  const handleRowClick = (iun: string, communicationType: NotificationCommunicationType) => {
    if (currentDelegator) {
      return navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(iun, currentDelegator.mandateId));
    }

    return communicationType === 'LEGAL'
      ? navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(iun))
      : navigate(`/comunicazione/${iun}`); // TODO - FIX PATH
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
              <PnTableBodyRow
                key={row.id}
                index={index}
                testId="notificationsTable.body.row"
                sx={{
                  '& .MuiTableCell-root': { verticalAlign: 'top' },
                  ...(row.isNewNotification && {
                    '& .MuiTableCell-root, & .MuiTypography-root': { fontWeight: 600 },
                  }),
                }}
              >
                {columns.map((column) => (
                  <PnTableBodyCell
                    key={column.id}
                    mode={column.mode}
                    cellProps={{
                      ...column.cellProps,
                    }}
                  >
                    <NotificationsRecipientDataSwitch
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
