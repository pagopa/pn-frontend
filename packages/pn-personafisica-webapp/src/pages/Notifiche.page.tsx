import { Typography } from '@mui/material';
import {
  calcPages,
  CustomPagination,
  getNotificationStatusLabelAndColor,
} from '@pagopa-pn/pn-commons';
import { PaginationData } from '@pagopa-pn/pn-commons/src/components/Pagination/types';
import { Fragment, useEffect, useRef } from 'react';
import FilterNotificationsTable from '../component/notification/FilterNotificationsTable';
import NotificationsTable from '../component/notification/NotificactionsTable';
import StatusTooltip from '../component/notification/StatusTooltip';
import { Column, Row, Sort } from '../component/notification/types';
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
    },
    {
      id: 'senderId',
      label: 'Mittente',
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
    <Fragment>
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
    </Fragment>
  );
};

export default Notifiche;
