import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import {
  calcPages,
  CustomPagination,
  PaginationData,
  Sort,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { getReceivedNotifications, setPagination, setSorting } from '../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import DesktopNotifications from '../component/notification/DesktopNotifications';
import MobileNotifications from '../component/notification/MobileNotifications';

const Notifiche = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);
  const { notifications, filters, sort, pagination } = useAppSelector(
    (state: RootState) => state.dashboardState
  );

  const isMobile = useIsMobile();

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
      nextPagesKey: pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1]
    };
    void dispatch(getReceivedNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant={'h4'}>{t('Le tue notifiche')}</Typography>
      {isMobile ? (
        <MobileNotifications
          notifications={notifications}
          sort={sort}
          onChangeSorting={handleChangeSorting}
        />
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
