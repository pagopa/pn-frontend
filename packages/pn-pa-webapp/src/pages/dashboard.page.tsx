import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomPagination, PaginationData } from '@pagopa-pn/pn-commons';
import { Box, Typography } from '@mui/material';

import { RootState } from '../redux/store';
import { getSentNotifications, setPagination, setSorting } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import { getNotificationStatusLabelAndColor } from '../utils/status.utility';
import NotificationsTable from './components/Notifications/NotificactionsTable';
import FilterNotificationsTable from './components/Notifications/FilterNotificationsTable';
import { Column, Row, Sort } from './components/Notifications/types';
import StatusTooltip from './components/Notifications/StatusTooltip';

function calcDisplayedPages(
  pages: Array<number>,
  numOfDisplayedPages: number,
  pageSelected: number,
  direction: 'prev' | 'next'
): Array<number> {
  // if displayedPages is odd, we show the same number of page before and after
  // if displayedPages is even, we show more pages before than after if we are navigating forward, the opposite if we are navigating backward
  /* eslint-disable functional/no-let */
  let firstPageToDisplay = 0;
  /* eslint-disable functional/no-let */
  let lastPageToDisplay = 0;
  if (numOfDisplayedPages % 2 === 0) {
    firstPageToDisplay =
      pageSelected - (direction === 'next' ? numOfDisplayedPages / 2 - 1 : numOfDisplayedPages / 2);
    lastPageToDisplay =
      pageSelected + (direction === 'prev' ? numOfDisplayedPages / 2 - 1 : numOfDisplayedPages / 2);
  } else {
    firstPageToDisplay = pageSelected - Math.floor(numOfDisplayedPages / 2);
    lastPageToDisplay = pageSelected + Math.floor(numOfDisplayedPages / 2);
  }
  // recalc first page and last page if they are off limits
  if (firstPageToDisplay <= 0) {
    const offset = pages[0] - firstPageToDisplay;
    firstPageToDisplay = pages[0];
    lastPageToDisplay =
      lastPageToDisplay + offset <= pages[pages.length - 1]
        ? lastPageToDisplay + offset
        : pages[pages.length - 1];
  }
  if (lastPageToDisplay > pages[pages.length - 1]) {
    const offset = lastPageToDisplay - pages[pages.length - 1];
    lastPageToDisplay = pages[pages.length - 1];
    firstPageToDisplay =
      firstPageToDisplay - offset >= pages[0] ? firstPageToDisplay - offset : pages[0];
  }
  // fill pages to display
  const displayedPages: Array<number> = [];
  for (let i = firstPageToDisplay; i <= lastPageToDisplay; i++) {
    /* eslint-disable functional/immutable-data */
    displayedPages.push(i);
  }
  return displayedPages;
}

function calcPages(
  pageSize: number,
  numOfItems: number,
  numOfDisplayedPages: number,
  pageSelected: number
): Array<number> {
  if (pageSize && numOfItems) {
    const numOfPages = Math.ceil(numOfItems / pageSize);
    const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);
    return calcDisplayedPages(pages, numOfDisplayedPages, pageSelected, 'next');
  }
  return [];
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useSelector((state: RootState) => state.dashboardState.filters);
  const sort = useSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useSelector((state: RootState) => state.dashboardState.pagination);
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  /* eslint-disable functional/no-let */
  const size = pagination.size || 10;
  const totalElements =
    size *
    (pagination.moreResult
      ? Math.max(pagination.nextPagesKey.length, 8)
      : pagination.nextPagesKey.length);
  const pagesToShow: Array<number> = calcPages(size, totalElements, 3, pagination.page + 1);

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
    dispatch(getSentNotifications(filters));
  }, [filters, pagination, sort]);

  // TODO: Remove extra style and extra div
  return (
    <div style={{ padding: '20px' }}>
      <Box sx={{ padding: '20px 0' }}>
        <Typography variant="h4">Notifiche</Typography>
        <Typography>
          Qui trovi tutte le notifiche inviate manualmente dal tuo Ente. Puoi filtrarle per Codice
          Fiscale, Codice IUN, data di invio e stato.
        </Typography>
      </Box>
      <Fragment>
        {notifications && (
          <div>
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
          </div>
        )}
      </Fragment>
    </div>
  );
};

export default Dashboard;
