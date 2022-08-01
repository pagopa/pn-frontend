import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  // Sort, // Riabilitare con la issue PN-1124
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Box, Button, Typography } from '@mui/material';

import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getSentNotifications,
  setPagination,
  // setSorting, // Riabilitare con la issue PN-1124
} from '../redux/dashboard/actions';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';

import DesktopNotifications from './components/Notifications/DesktopNotifications';
import MobileNotifications from './components/Notifications/MobileNotifications';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);
  const pagination = useAppSelector((state: RootState) => state.dashboardState.pagination);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['notifiche']);
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

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_PAGINATION);
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  // Riabilitare con la issue PN-1124
  /*
  const handleChangeSorting = (s: Sort) => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_SORT, {type: s.orderBy});
    dispatch(setSorting(s));
  };
  */

  // route to Manual Send
  const handleRouteManualSend = () => {
    trackEventByType(TrackEventType.NOTIFICATION_SEND);
    navigate(routes.NUOVA_NOTIFICA);
  };

  // route to API keys
  const handleRouteApiKeys = () => {
    navigate(routes.API_KEYS);
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

  const handleEventTrackingCallbackPageSize = (pageSize: number) => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_SIZE, {pageSize});
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={isMobile ? 3 : undefined}>
        {t('title')}
      </Typography>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
        <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
        {t('subtitle')}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRouteManualSend}
          data-testid="newNotificationBtn"
          sx={{ marginBottom: isMobile ? 3 : undefined }}
        >
          {t('new-notification-button')}
        </Button>
      </Box>
      {isMobile ? (
        <MobileNotifications
          notifications={notifications}
          // onChangeSorting={handleChangeSorting} // Riabilitare con la issue PN-1124
          onManualSend={handleRouteManualSend}
          onApiKeys={handleRouteApiKeys}
        />
      ) : (
        <DesktopNotifications
          notifications={notifications}
          // onChangeSorting={handleChangeSorting} // Riabilitare con la issue PN-1124
          onManualSend={handleRouteManualSend}
          onApiKeys={handleRouteApiKeys}
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
          eventTrackingCallbackPageSize={handleEventTrackingCallbackPageSize}
          pagesToShow={pagesToShow}
          sx={{ padding: '0 10px' }}
        />
      )}
    </Box>
  );
};

export default Dashboard;
