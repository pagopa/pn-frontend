import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import {
  A11yMessage,
  ApiErrorWrapper,
  CustomPagination,
  NotificationColumnData,
  PaginationData,
  RecipientNotification,
  Sort,
  TitleBox,
  calculatePages,
  useEventEmitter,
  useHasPermissions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import DesktopNotifications from '../components/Notifications/DesktopNotifications';
import GroupSelector from '../components/Notifications/GroupSelector';
import MobileNotifications from '../components/Notifications/MobileNotifications';
import { PGEventsType } from '../models/PGEventsType';
import { PNRole } from '../models/User';
import { ContactSource } from '../models/contacts';
import { contactsSelectors } from '../redux/contact/reducers';
import { DASHBOARD_ACTIONS, getReceivedNotifications } from '../redux/dashboard/actions';
import { setNotificationFilters, setPagination, setSorting } from '../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import PGEventStrategyFactory from '../utility/MixpanelUtils/PGEventStrategyFactory';

type Props = {
  isDelegatedPage?: boolean;
};

const Notifiche = ({ isDelegatedPage = false }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);
  const [pageReady, setPageReady] = useState(false);
  const domicileBannerTypeRef = useRef('');

  const { notifications, filters, sort, pagination } = useAppSelector(
    (state: RootState) => state.dashboardState
  );
  const { defaultEMAILAddress, defaultSMSAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const { delegates, delegators } = useAppSelector(
    (state: RootState) => state.delegationsState.delegations
  );
  const loading = useAppSelector((state: RootState) => state.appState.loading.result);
  const { publishEvent } = useEventEmitter<A11yMessage>('a11y-message');
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

  const registerNotificationSectionSuperProperties = useCallback(
    (notificationsCount: number) => {
      if (userHasAdminPermissions && !organizationGroup) {
        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_EMAIL, {
          value: !!defaultEMAILAddress,
        });

        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_SMS, {
          value: !!defaultSMSAddress,
        });

        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE, {
          addresses,
        });
      }

      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_MANDATE, {
        value: delegators.length > 0,
      });

      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_MANDATE_GIVEN, {
        value: delegates.length > 0,
      });

      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_NOTIFICATIONS, {
        value: notificationsCount > 0,
      });
    },
    [
      userHasAdminPermissions,
      organizationGroup,
      defaultEMAILAddress,
      defaultSMSAddress,
      addresses,
      delegators.length,
      delegates.length,
    ]
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

    dispatch(getReceivedNotifications(params))
      .unwrap()
      .then((data) => {
        setPageReady(true);

        if (!isDelegatedPage) {
          registerNotificationSectionSuperProperties(data.resultsPage.length);
          PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_YOUR_NOTIFICATION, {
            notifications: data.resultsPage,
            pageNumber: pagination.page,
            domicileBannerType: domicileBannerTypeRef.current,
          });

          return;
        }

        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_NOTIFICATION_DELEGATED, {
          notifications: data.resultsPage,
          pageNumber: pagination.page,
        });
      })
      .catch(() => setPageReady(true));
  }, [
    filters,
    pagination.size,
    pagination.page,
    group,
    isDelegatedPage,
    registerNotificationSectionSuperProperties,
  ]);

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  // Sort handlers
  const handleChangeSorting = (s: Sort<NotificationColumnData<RecipientNotification>>) => {
    dispatch(setSorting(s));
  };

  const handleGroupSelction = (id: string) => {
    dispatch(setNotificationFilters({ ...filters, group: id }));
  };

  const handleDomicileBannerResolved = useCallback((domicileBannerType: string) => {
    // eslint-disable-next-line functional/immutable-data
    domicileBannerTypeRef.current = domicileBannerType;
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Announce every time loading goes from true -> false
  useEffect(() => {
    if (loading) {
      return;
    }

    const msg =
      notifications.length > 0
        ? t('filters.loading_completed_with_results')
        : t('filters.loading_completed_no_results');

    const timeoutId = setTimeout(() => {
      publishEvent({ message: msg });
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading, notifications.length]);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box p={3}>
        {userHasAdminPermissions && !organizationGroup && !isDelegatedPage && (
          <DomicileBanner
            source={ContactSource.HOME_NOTIFICHE}
            onBannerResolved={handleDomicileBannerResolved}
          />
        )}
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
              <GroupSelector currentGroup={group ?? ''} onGroupSelection={handleGroupSelction} />
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
