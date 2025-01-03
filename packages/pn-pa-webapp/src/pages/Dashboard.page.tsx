import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Alert, Box, Button, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  PaginationData,
  TitleBox,
  calculatePages,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import DesktopNotifications from '../components/Notifications/DesktopNotifications';
import MobileNotifications from '../components/Notifications/MobileNotifications';
import NotificationSettingsDrawer from '../components/Notifications/NotificationSettingsDrawer';
import * as routes from '../navigation/routes.const';
import { DASHBOARD_ACTIONS, getSentNotifications } from '../redux/dashboard/actions';
import { setPagination } from '../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';

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

  const { IS_MANUAL_SEND_ENABLED } = getConfiguration();

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // route to Manual Send
  const handleRouteManualSend = () => {
    navigate(routes.NUOVA_NOTIFICA);
  };

  // route to API keys
  const handleRouteApiKeys = () => {
    navigate(routes.API_KEYS);
  };

  const fetchNotifications = useCallback(() => {
    const params = {
      ...filters,
      size: pagination.size,
      nextPagesKey:
        pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
    };

    void dispatch(getSentNotifications(params));
  }, [filters, pagination.size, pagination.page, sort]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Box p={3}>
      <TitleBox
        title={t('title')}
        variantTitle="h4"
        mbTitle={3}
        propsTitle={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}
        titleButton={
          <>
            {IS_MANUAL_SEND_ENABLED ? (
              <Box display="flex" gap={5}>
                <NotificationSettingsDrawer />
                <Button
                  id="new-notification-btn"
                  variant="contained"
                  onClick={handleRouteManualSend}
                  data-testid="newNotificationBtn"
                >
                  {t('new-notification-button')}
                </Button>
              </Box>
            ) : (
              <Alert
                severity="warning"
                action={
                  <ButtonNaked
                    color="inherit"
                    size="small"
                    onClick={() => navigate(routes.APP_STATUS)}
                  >
                    {t('manual-send-disabled-action')}
                  </ButtonNaked>
                }
              >
                {t('manual-send-disabled-message')}
              </Alert>
            )}
          </>
        }
        subTitle={
          <Box
            display={isMobile ? 'block' : 'flex'}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
              {t('subtitle')}
            </Typography>
          </Box>
        }
      />
      <ApiErrorWrapper
        apiId={DASHBOARD_ACTIONS.GET_SENT_NOTIFICATIONS}
        reloadAction={() => fetchNotifications()}
        mt={3}
      >
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
            pagesToShow={pagesToShow}
          />
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default Dashboard;
