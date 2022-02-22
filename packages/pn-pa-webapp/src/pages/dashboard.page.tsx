import { useEffect, Fragment, useRef } from 'react';
import { CustomPagination, PaginationData } from '@pagopa-pn/pn-commons';
import { Box, Typography } from '@mui/material';

import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getSentNotifications, setPagination, setSorting } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import { getNotificationStatusLabelAndColor } from '../utils/status.utility';
import { calcPages } from '../utils/pagination.utility';
import NotificationsTable from './components/Notifications/NotificactionsTable';
import FilterNotificationsTable from './components/Notifications/FilterNotificationsTable';
import { Column, Row, Sort } from './components/Notifications/types';
import StatusTooltip from './components/Notifications/StatusTooltip';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useAppSelector((state: RootState) => state.dashboardState.pagination);
  // store previous values
  const prevPagination = useRef(pagination);
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  /* eslint-disable functional/no-let */
  const totalElements =
    pagination.size *
      (pagination.moreResult
        ? Math.max(pagination.nextPagesKey.length + 1, 8)
        : pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calcPages(pagination.size, totalElements, 3, pagination.page + 1);

  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: 'Data',
      width: '11%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'recipientId',
      label: 'Destinatario',
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'groups',
      label: 'Gruppi',
      width: '15%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      width: '18%',
      align: 'center',
      sortable: true,
      getCellLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  // TODO: rimuovere + i quando da be non arriveranno notifiche con stesso id
  const rows: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: n.paNotificationId + i.toString(),
  }));

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort) => {
    dispatch(setSorting(s));
  };

  useEffect(() => {
    // assign the ref's current value to the pagination Hook
    const params = {
      ...filters,
      size: pagination.size
    };
    if (pagination !== prevPagination.current) {
      /* eslint-disable functional/immutable-data */
      prevPagination.current = pagination;
      const nextPage = pagination.page === prevPagination.current.page ? pagination.nextPagesKey[prevPagination.current.page - 1] : pagination.nextPagesKey[pagination.page - 1];
      params.nextPagesKey = pagination.page === 0 ? undefined: nextPage;
      /* eslint-enable functional/immutable-data */
    }
    void dispatch(getSentNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  return (
    <Box style={{ padding: '20px' }}>
      <Box sx={{ padding: '20px 0' }}>
        <Typography variant="h4">Notifiche</Typography>
        <Typography>
          Qui trovi tutte le notifiche inviate manualmente dal tuo Ente. Puoi filtrarle per Codice
          Fiscale, Codice IUN, data di invio e stato.
        </Typography>
      </Box>
      <Fragment>
        {notifications && (
          <Fragment>
            <FilterNotificationsTable />
            <NotificationsTable
              columns={columns}
              rows={rows}
              sort={sort}
              onChangeSorting={handleChangeSorting}
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