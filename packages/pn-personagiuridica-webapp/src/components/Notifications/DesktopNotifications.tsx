import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';
import {
  Column,
  EmptyState,
  KnownSentiment,
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
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData>) => void;
  /** Defines if the component is in delegated page */
  isDelegatedPage?: boolean;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<LinkRemoveFiltersProps> = ({ children, cleanFilters }) => {
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

  const columns: Array<Column<NotificationColumnData>> = [
    {
      id: 'badge',
      label: '',
      cellProps: { width: '1%' },
    },
    {
      id: 'sentAt',
      label: t('table.data'),
      cellProps: { width: '11%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      cellProps: { width: '13%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      cellProps: { width: '22%' },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      cellProps: { width: '20%' },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      cellProps: { width: '18%' },
      sortable: false, // TODO: will be re-enabled in PN-1124
    },
  ];

  if (isDelegatedPage) {
    const recipientField: Column<NotificationColumnData> = {
      id: 'recipients',
      label: t('table.destinatario'),
      cellProps: { width: '15%' },
      sortable: false,
    };
    // eslint-disable-next-line functional/immutable-data
    columns.splice(3, 0, recipientField);
  }

  const rows: Array<Row<Notification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    if (isDelegatedPage && row.mandateId) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun, row.mandateId));
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
    }
  };

  return (
    <>
      <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
      {rows.length ? (
        <PnTable testId="notificationsTable">
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
              <PnTableBodyRow key={row.id} testId="notificationsTable.body.row" index={index}>
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
