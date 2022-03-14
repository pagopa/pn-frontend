import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import {
  calcPages,
  CustomPagination,
  PaginationData,
  Sort,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { getSentNotifications, setPagination, setSorting } from '../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import DesktopNotifications from '../component/notification/DesktopNotifications';
import MobileNotifications from '../component/notification/MobileNotifications';

const Notifiche = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useAppSelector((state: RootState) => state.dashboardState.pagination);
 
  const isMobile = useIsMobile();
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
    <Box style={{ padding: '20px' }}>
      <Typography variant={'h4'}>Le tue notifiche</Typography>
      {isMobile ? (
        <MobileNotifications notifications={notifications} />
      ) : (
        <DesktopNotifications
          notifications={notifications}
          sort={sort}
          onChangeSorting={handleChangeSorting}
        />
      )}
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
