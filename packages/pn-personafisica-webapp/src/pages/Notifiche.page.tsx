import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  EventNotificationsListType,
  NotificationStatus,
  PaginationData,
  Sort,
  TitleBox,
  calculatePages,
  formatToTimezoneString,
  getNextDay,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import DesktopNotifications from '../components/Notifications/DesktopNotifications';
import MobileNotifications from '../components/Notifications/MobileNotifications';
import { NotificationColumn } from '../models/Notifications';
import { DASHBOARD_ACTIONS, getReceivedNotifications } from '../redux/dashboard/actions';
import { setMandateId, setPagination, setSorting } from '../redux/dashboard/reducers';
import { Delegator } from '../redux/delegation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { TrackEventType } from '../utility/events';
import { trackEventByType } from '../utility/mixpanel';

const Notifiche = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);
  const { mandateId } = useParams();
  const [pageReady, setPageReady] = useState(false);

  const { notifications, filters, sort, pagination } = useAppSelector(
    (state: RootState) => state.dashboardState
  );
  const { delegators } = useAppSelector((state: RootState) => state.generalInfoState);
  const currentDelegator = delegators.find(
    (delegation: Delegator) => delegation.mandateId === mandateId
  );
  const isMobile = useIsMobile();
  const pageTitle = currentDelegator
    ? t('delegatorTitle', {
        name: currentDelegator.delegator ? currentDelegator.delegator.displayName : '',
      })
    : t('title');
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  const totalElements =
    pagination.size *
    (pagination.moreResult
      ? pagination.nextPagesKey.length + 5
      : pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    Math.min(pagination.nextPagesKey.length + 1, 3),
    pagination.page + 1
  );

  // API call, this function is passed to the ApiErrorWrapper component
  const fetchNotifications = useCallback(() => {
    const params = {
      ...filters,
      size: pagination.size,
      nextPagesKey:
        pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
    };

    void dispatch(
      getReceivedNotifications({
        ...params,
        endDate: formatToTimezoneString(getNextDay(new Date(params.endDate))),
      })
    ).then(() => setPageReady(true));
  }, [filters, pagination.size, pagination.page]);

  const isNewNotification = (value: string) => {
    switch (value) {
      case NotificationStatus.VIEWED:
      case NotificationStatus.PAID:
      case NotificationStatus.CANCELLED:
        return false;
      default:
        return true;
    }
  };

  const getEventNotifications = (): EventNotificationsListType => ({
    delegate: !!currentDelegator,
    page_number: pagination.page,
    total_count: notifications.length,
    unread_count: notifications.filter((n) => isNewNotification(n.notificationStatus)).length,
    delivered_count: notifications.filter(
      (n) => n.notificationStatus === NotificationStatus.DELIVERED
    ).length,
    opened_count: notifications.filter((n) => n.notificationStatus === NotificationStatus.VIEWED)
      .length,
    expired_count: notifications.filter(
      (n) => n.notificationStatus === NotificationStatus.EFFECTIVE_DATE
    ).length,
    not_found_count: notifications.filter(
      (n) => n.notificationStatus === NotificationStatus.UNREACHABLE
    ).length,
    cancelled_count: notifications.filter(
      (n) => n.notificationStatus === NotificationStatus.CANCELLED
    ).length,
  });

  useEffect(() => {
    if (notifications) {
      trackEventByType(
        currentDelegator
          ? TrackEventType.SEND_NOTIFICATION_DELEGATED
          : TrackEventType.SEND_YOUR_NOTIFICATION,
        getEventNotifications()
      );
    }
  }, [notifications]);

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort<NotificationColumn>) => {
    dispatch(setSorting(s));
  };

  useEffect(() => {
    if (filters.mandateId !== currentDelegator?.mandateId) {
      dispatch(setMandateId(currentDelegator?.mandateId));
      return;
    }
    fetchNotifications();
  }, [fetchNotifications, currentDelegator]);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box p={3}>
        {!mandateId && <DomicileBanner />}
        <TitleBox variantTitle="h4" title={pageTitle} mbTitle={isMobile ? 3 : undefined} />
        <ApiErrorWrapper
          apiId={DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS}
          reloadAction={fetchNotifications}
        >
          {isMobile ? (
            <MobileNotifications
              notifications={notifications}
              sort={sort}
              onChangeSorting={handleChangeSorting}
              currentDelegator={currentDelegator}
            />
          ) : (
            <DesktopNotifications
              notifications={notifications}
              sort={sort}
              onChangeSorting={handleChangeSorting}
              currentDelegator={currentDelegator}
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
              sx={
                isMobile
                  ? {
                      padding: '0',
                      '& .items-per-page-selector button': {
                        paddingLeft: 0,
                        height: '24px',
                      },
                    }
                  : { padding: '0' }
              }
            />
          )}
        </ApiErrorWrapper>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Notifiche;
