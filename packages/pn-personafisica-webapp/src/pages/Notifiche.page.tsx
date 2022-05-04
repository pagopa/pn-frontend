import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  Sort,
  tenYearsAgo,
  TitleBox,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { useParams } from 'react-router-dom';
import {
  getReceivedNotifications,
  setNotificationFilters,
  setPagination,
  setSorting,
} from '../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import DesktopNotifications from '../component/Notifications/DesktopNotifications';
import MobileNotifications from '../component/Notifications/MobileNotifications';
import DomicileBanner from '../component/DomicileBanner/DomicileBanner';
import { Delegation } from '../redux/delegation/types';

const Notifiche = ({ isDelegator = false }: { isDelegator?: boolean }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);
  const { fiscalCode } = useParams();
  const { notifications, filters, sort, pagination } = useAppSelector(
    (state: RootState) => state.dashboardState
  );
  const { delegators } = useAppSelector((state: RootState) => state.sidemenuState);
  const currentDelegator =
    delegators.length > 0 &&
    delegators.find((delegation: Delegation) =>
      'delegator' in delegation && delegation.delegator
        ? delegation.delegator.fiscalCode === fiscalCode
        : undefined
    );
  const isMobile = useIsMobile();
  const pageTitle =
    isDelegator && currentDelegator && 'delegator' in currentDelegator
      ? t('delegatorTitle', {
          name: `${currentDelegator.delegator.firstName} ${currentDelegator.delegator.lastName}`,
        })
      : t('title');

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

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort) => {
    dispatch(setSorting(s));
  };

  // Remove filter
  const handleCancelSearch = () => {
    dispatch(
      setNotificationFilters({
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        iunMatch: undefined,
      })
    );
  };

  useEffect(() => {
    // assign the ref's current value to the pagination Hook
    const params = {
      ...filters,
      ...(isDelegator && { mandateId: currentDelegator ? currentDelegator.mandateId : '' }),
      size: pagination.size,
      nextPagesKey:
        pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
    };
    void dispatch(getReceivedNotifications(params));
  }, [currentDelegator, filters, pagination.size, pagination.page, sort]);

  return (
    <Box sx={{ padding: '20px' }}>
      <DomicileBanner />
      <TitleBox variantTitle="h4" title={pageTitle} />
      {isMobile ? (
        <MobileNotifications
          notifications={notifications}
          sort={sort}
          onChangeSorting={handleChangeSorting}
          onCancelSearch={handleCancelSearch}
        />
      ) : (
        <DesktopNotifications
          notifications={notifications}
          sort={sort}
          onChangeSorting={handleChangeSorting}
          onCancelSearch={handleCancelSearch}
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
