import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  KnownSentiment,
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
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<RecipientNotification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData<RecipientNotification>>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData<RecipientNotification>>) => void;
  /** Defines if the component is in delegated page */
  isDelegatedPage?: boolean;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
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

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche', 'common']);
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });

  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const columns: Array<Column<NotificationColumnData<RecipientNotification>>> = [
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
      sortable: false,
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      mode: 'truncate',
      cellProps: { width: '12%' },
      sortable: false,
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
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
      <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
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
        <EmptyState
          sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
        >
          {filtersApplied && (
            <Trans
              i18nKey={'empty-state.filtered'}
              ns={'notifiche'}
              components={[
                <LinkRemoveFilters
                  key={'remove-filters'}
                  cleanFilters={filterNotificationsRef.current.cleanFilters}
                />,
              ]}
            />
          )}
          {!filtersApplied && isDelegatedPage && (
            <Trans
              i18nKey={'empty-state.delegate'}
              ns={'notifiche'}
              values={{ name: organization.name }}
            />
          )}
          {!filtersApplied && !isDelegatedPage && (
            <Trans
              i18nKey={'empty-state.no-notifications'}
              ns={'notifiche'}
              values={{ name: organization.name }}
            />
          )}
        </EmptyState>
      )}
    </>
  );
};

export default DesktopNotifications;
