import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  Sort,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Box, Button, Typography } from '@mui/material';

import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getSentNotifications,
  setNotificationFilters,
  setPagination,
  setSorting,
} from '../redux/dashboard/actions';
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
        status: undefined,
        recipientId: undefined,
        iunMatch: undefined,
      })
    );
  };

  // route to Manual Send
  const handleRouteManualSend = () => {
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

  return (
    <Box p={3}>
      <Typography variant="h4" mb={isMobile ? 3 : undefined}>
        Notifiche
      </Typography>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
        <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          Qui trovi tutte le notifiche inviate dall&apos;ente. Puoi filtrarle per Codice Fiscale,
          Codice IUN, data di invio e stato.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(routes.NUOVA_NOTIFICA)}
          data-testid="newNotificationBtn"
        >
          Invia una nuova notifica
        </Button>
      </Box>
      {isMobile ? (
        <MobileNotifications
          notifications={notifications}
          onChangeSorting={handleChangeSorting}
          onCancelSearch={handleCancelSearch}
          onManualSend={handleRouteManualSend}
          onApiKeys={handleRouteApiKeys}
        />
      ) : (
        <DesktopNotifications
          notifications={notifications}
          onChangeSorting={handleChangeSorting}
          onCancelSearch={handleCancelSearch}
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
          pagesToShow={pagesToShow}
          sx={{ padding: '0 10px' }}
        />
      )}
    </Box>
  );
};

export default Dashboard;
