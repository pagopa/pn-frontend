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

import { PFEventsType } from '../../models/PFEventsType';
import * as routes from '../../navigation/routes.const';
import { Delegator } from '../../redux/delegation/types';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumnData>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData>) => void;
  /** Delegator */
  currentDelegator?: Delegator;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<LinkRemoveFiltersProps> = ({ children, cleanFilters }) => {
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

const LinkRouteContacts: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('notifiche');
  const navigate = useNavigate();
  const goToContactsPage = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, {
      source: 'home_notifiche',
    });
    navigate(routes.RECAPITI);
  };
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-route-contacts')}
      key="route-contacts"
      data-testid="link-route-contacts"
      onClick={goToContactsPage}
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
      cellProps: { width: '23%' },
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

  const rows: Array<Row<Notification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    if (currentDelegator) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun, currentDelegator.mandateId));
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
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
