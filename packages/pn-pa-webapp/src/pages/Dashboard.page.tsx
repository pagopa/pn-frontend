import { useEffect, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculatePages,
  CustomPagination,
  getNotificationStatusInfos,
  NotificationStatus,
  PaginationData,
  Notification,
  Column,
  Sort,
  StatusTooltip,
  ItemsTable,
  EmptyState,
  Item,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { Box, Button, Typography } from '@mui/material';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getSentNotifications,
  setNotificationFilters,
  setPagination,
  setSorting,
} from '../redux/dashboard/actions';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import FilterNotificationsTable from './components/Notifications/FilterNotificationsTable';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useAppSelector((state: RootState) => state.dashboardState.pagination);
  const navigate = useNavigate();
  const filterNotificationsTableRef = useRef({ filtersApplied: false });
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  const totalElements =
    pagination.size *
    (pagination.moreResult
      ? Math.max(pagination.nextPagesKey.length + 1, 8)
      : pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    3,
    pagination.page + 1
  );

  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: 'Data',
      width: '11%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'recipients',
      label: 'Destinatario',
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'group',
      label: 'Gruppi',
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
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      width: '18%',
      align: 'center',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusInfos(value as NotificationStatus);
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort) => {
    dispatch(setSorting(s));
  };

  // Navigation handlers
  const handleRowClick = (row: Item, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATIONS_GO_TO_DETAIL);
  };

  // Remove filter
  const handleCancelSearch = () => {
    dispatch(
      setNotificationFilters({
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        status: undefined,
        recipientId: undefined,
        iunMatch: undefined,
      })
    );
  };

  // route to API keys
  const handleRouteApiKeys = () => {
    navigate(routes.API_KEYS);
  };

  // route to Manual Send
  const handleRouteManualSend = () => {
    navigate(routes.NUOVA_NOTIFICA);
  };

  const emptyMessage: string = "L'ente non ha ancora inviato nessuna notifica. Usa le";
  const emptyActionLabel: string = 'Chiavi API';

  const secondaryMessage: object = {
    emptyMessage: 'o fai un',
    emptyActionLabel: 'invio manuale',
    emptyActionCallback: () => {
      handleRouteManualSend();
    },
  };

  useEffect(() => {
    const params = {
      ...filters,
      size: pagination.size,
      nextPagesKey:
        pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
    };
    void dispatch(getSentNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  const filtersApplied: boolean = filterNotificationsTableRef?.current?.filtersApplied;

  const EmptyStateProps = {
    emptyMessage: filtersApplied ? undefined : emptyMessage,
    emptyActionLabel: filtersApplied ? undefined : emptyActionLabel,
    disableSentimentDissatisfied: !filtersApplied,
    emptyActionCallback: filtersApplied ? handleCancelSearch : handleRouteApiKeys,
    secondaryMessage: filtersApplied ? undefined : secondaryMessage,
  };

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <Box p={3}>
      <Typography variant="h4">Notifiche</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">
          Qui trovi tutte le notifiche inviate dall&apos;ente. Puoi filtrarle per Codice Fiscale,
          Codice IUN, data di invio e stato.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(routes.NUOVA_NOTIFICA)}
          data-testid="newNotificationBtn"
        >
          Invia una nuova notifica
        </Button>
      </Box>
      <Fragment>
        {notifications && (
          <Fragment>
            {showFilters &&
            <FilterNotificationsTable ref={filterNotificationsTableRef} />
            }
            {notifications.length > 0 ? (
              <>
                <ItemsTable 
                  columns={columns}
                  sort={sort}
                  rows={rows}
                  onChangeSorting={handleChangeSorting}
                />
                <CustomPagination
                  paginationData={{
                    size: pagination.size,
                    page: pagination.page,
                    totalElements,
                  }}
                  onPageRequest={handleChangePage}
                  pagesToShow={pagesToShow}
                  sx={{ padding: '0 10px' }}
                />
              </>
            ) : (
              <EmptyState {...EmptyStateProps}/>
            )}
          </Fragment>
        )}
      </Fragment>
    </Box>
  );
};

export default Dashboard;
