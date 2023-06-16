import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  Sort,
  TitleBox,
  useIsMobile,
  getNextDay,
  formatToTimezoneString,
  ApiErrorWrapper,
  useHasPermissions,
} from '@pagopa-pn/pn-commons';

import { DASHBOARD_ACTIONS, getReceivedNotifications } from '../redux/dashboard/actions';
import { setNotificationFilters, setPagination, setSorting } from '../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import DesktopNotifications from '../component/Notifications/DesktopNotifications';
import MobileNotifications from '../component/Notifications/MobileNotifications';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import DomicileBanner from '../component/DomicileBanner/DomicileBanner';
import GroupSelector from '../component/Notifications/GroupSelector';
import { PNRole } from '../redux/auth/types';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import { NotificationColumn } from '../models/Notifications';

type Props = {
  isDelegatedPage?: boolean;
};

const Notifiche = ({ isDelegatedPage = false }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);
  const [pageReady, setPageReady] = useState(false);

  const { notifications, filters, sort, pagination } = useAppSelector(
    (state: RootState) => state.dashboardState
  );
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const role = organization?.roles ? organization?.roles[0] : null;

  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const organizationGroup = organization.groups ? organization.groups[0] : undefined;
  const delegationGroup = filters.group ? filters.group : organizationGroup;
  const group = isDelegatedPage ? delegationGroup : undefined;

  const isMobile = useIsMobile();
  const pageTitle = !isDelegatedPage
    ? t('title', { recipient: organization.name })
    : t('title-delegated-notifications', { recipient: organization.name });

  const pageSubTitle = !isDelegatedPage
    ? t('subtitle', { recipient: organization.name })
    : t('subtitle-delegated-notifications', { recipient: organization.name });

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
      group,
      isDelegatedPage,
    };

    void dispatch(
      getReceivedNotifications({
        ...params,
        endDate: formatToTimezoneString(getNextDay(new Date(params.endDate))),
      })
    ).then(() => setPageReady(true));
  }, [filters, pagination.size, pagination.page]);

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_PAGINATION);
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort<NotificationColumn>) => {
    dispatch(setSorting(s));
  };

  const handleEventTrackingCallbackPageSize = (pageSize: number) => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_SIZE, { pageSize });
  };

  const handleGroupSelction = (id: string) => {
    dispatch(setNotificationFilters({ ...filters, group: id }));
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box p={3}>
        {userHasAdminPermissions && !organizationGroup && <DomicileBanner />}
        <TitleBox
          variantTitle="h4"
          title={pageTitle}
          subTitle={pageSubTitle}
          variantSubTitle={'body1'}
          mbTitle={isMobile ? 3 : undefined}
          titleButton={
            isDelegatedPage &&
            organization.groups &&
            organization.groups?.length > 0 && (
              <GroupSelector currentGroup={group || ''} onGroupSelection={handleGroupSelction} />
            )
          }
        />
        <ApiErrorWrapper
          apiId={DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS}
          reloadAction={fetchNotifications}
        >
          {isMobile ? (
            <MobileNotifications
              notifications={notifications}
              sort={sort}
              onChangeSorting={handleChangeSorting}
              isDelegatedPage={isDelegatedPage}
            />
          ) : (
            <DesktopNotifications
              notifications={notifications}
              sort={sort}
              onChangeSorting={handleChangeSorting}
              isDelegatedPage={isDelegatedPage}
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
              eventTrackingCallbackPageSize={handleEventTrackingCallbackPageSize}
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
