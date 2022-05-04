import { useEffect, Fragment } from 'react';
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
  Item,
  tenYearsAgo,
  today,
  TitleBox,
} from '@pagopa-pn/pn-commons';
import { Box, Button } from '@mui/material';
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
      id: 'recipientId',
      label: 'Destinatario',
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
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

  useEffect(() => {
    const params = {
      ...filters,
      size: pagination.size,
      nextPagesKey:
        pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
    };
    void dispatch(getSentNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  return (
    <Box sx={{ padding: '20px' }}>
      <TitleBox
        variantTitle="h4"
        title={'Notifiche'}
        subTitle={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Qui trovi tutte le notifiche inviate dall&apos;Ente. Puoi filtrarle per Codice Fiscale,
            Codice IUN, data di invio e stato.
            <Button variant="contained" onClick={() => navigate(routes.NUOVA_NOTIFICA)}>
              Invia una nuova notifica
            </Button>
          </Box>
        }
        variantSubTitle={'body1'}
      ></TitleBox>

      <Fragment>
        {notifications && (
          <Fragment>
            <FilterNotificationsTable />
            <ItemsTable
              columns={columns}
              rows={rows}
              sort={sort}
              onChangeSorting={handleChangeSorting}
              emptyActionCallback={handleCancelSearch}
            />
            {notifications.length > 0 && (
              <CustomPagination
                paginationData={{
                  size: pagination.size,
                  page: pagination.page,
                  totalElements,
                }}
                onPageRequest={handleChangePage}
                pagesToShow={pagesToShow}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    </Box>
  );
};

export default Dashboard;
