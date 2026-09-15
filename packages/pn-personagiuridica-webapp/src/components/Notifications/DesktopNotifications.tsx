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
import FilterNotifications from './FilterNotifications';
import NotificationsEmptyState from './NotificationsEmptyState';

type Props = {
  notifications: Array<RecipientNotification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData<RecipientNotification>>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData<RecipientNotification>>) => void;
  /** Defines if the component is in delegated page */
  isDelegatedPage?: boolean;
};

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche', 'common']);
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });

  const columns: Array<Column<NotificationColumnData<RecipientNotification>>> = [
    {
      id: 'sentAt',
      label: t('table.data'),
      cellProps: { sx: { width: { xs: '10%', md: '13%', xl: '13%', xxl: '13%' } } },
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      mode: 'truncate',
      cellProps: { sx: { width: { xs: '25%', md: '23%', xl: '25%', xxl: '24%' } } },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      cellProps: { sx: { width: { xs: '40%', md: '24%', xl: '28%', xxl: '35%' } } },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: {
        sx: {
          width: { xs: '17%', md: '32%', xl: '26%', xxl: '20%' },
          display: { xs: 'none', xl: 'table-cell' },
        },
      },
    },
    {
      id: 'action',
      label: '',
      cellProps: { width: '8%', align: 'right' },
    },
  ];

  if (isDelegatedPage) {
    const recipientField: Column<NotificationColumnData<RecipientNotification>> = {
      id: 'recipients',
      label: t('table.destinatario'),
      cellProps: { width: '15%' },
      sortable: false,
    };
    // eslint-disable-next-line functional/immutable-data
    columns.splice(3, 0, recipientField);
  }

  const rows: Array<Row<RecipientNotification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  const handleRowClick = (
    iun: string,
    communicationType: NotificationCommunicationType,
    mandateId?: string
  ) => {
    if (isDelegatedPage && mandateId) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(iun, mandateId));
      return;
    }

    return communicationType === 'LEGAL'
      ? navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(iun))
      : navigate(routes.GET_DETTAGLIO_COMUNICAZIONE_PATH(iun));
  };

  return (
    <>
      <FilterNotifications
        ref={filterNotificationsRef}
        showFilters={showFilters}
        isDelegatedPage={isDelegatedPage}
      />
      {rows.length ? (
        <PnTable
          testId="notificationsTable"
          slotProps={{ table: { sx: { tableLayout: 'fixed', mt: 3 } } }}
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
                testId="notificationsTable.body.row"
                index={index}
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
          isDelegatedPage={isDelegatedPage}
        />
      )}
    </>
  );
};

export default DesktopNotifications;
