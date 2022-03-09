import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import {
  calcPages,
  Column,
  CustomPagination,
  getNotificationStatusLabelAndColor,
  NotificationsTable,
  PaginationData,
  Row,
  Sort,
  StatusTooltip,
} from '@pagopa-pn/pn-commons';
import * as routes from '../navigation/routes.const';
import { useNavigate } from 'react-router';
import FilterNotificationsTable from '../component/notification/FilterNotificationsTable';
import { getSentNotifications, setPagination, setSorting } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Notifiche = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useAppSelector((state: RootState) => state.dashboardState.pagination);
  // store previous values
  const prevPagination = useRef(pagination);

  const totalElements =
    pagination.size *
    (pagination.moreResult
      ? Math.max(pagination.nextPagesKey.length + 1, 8)
      : pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calcPages(
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
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'senderId',
      label: 'Mittente',
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Row, column: Column) {
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
      onClick(row: Row, column: Column) {
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
      onClick(row: Row, column: Column) {
        handleRowClick(row, column);
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

  const navigate = useNavigate();

  // Navigation handlers
  const handleRowClick = (row: Row, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
  };

  useEffect(() => {
    // assign the ref's current value to the pagination Hook
    const params = {
      ...filters,
      size: pagination.size,
    };
    if (pagination !== prevPagination.current) {
      /* eslint-disable functional/immutable-data */
      prevPagination.current = pagination;
      const nextPage =
        pagination.page === prevPagination.current.page
          ? pagination.nextPagesKey[prevPagination.current.page - 1]
          : pagination.nextPagesKey[pagination.page - 1];
      params.nextPagesKey = pagination.page === 0 ? undefined : nextPage;
      /* eslint-enable functional/immutable-data */
    }
    void dispatch(getSentNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant={'h4'}>Le tue notifiche</Typography>
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
    </Box>
  );
};

export default Notifiche;
