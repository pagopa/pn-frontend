/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';
import {
  AccessDenied,
  ApiError,
  AppResponse,
  IllusQuestion,
  LegalFactId,
  LegalFactType,
  NotificationDetailTimeline,
  NotificationDocumentType,
  PnBreadcrumb,
  appStateActions,
  downloadDocument,
  useErrors,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import { useDismissToastOnError } from '@pagopa-pn/pn-commons/src/hooks/useDismissToastOnError';
import { MIAlert, MIPaper } from '@pagopa/mui-italia';

import NotificationDetailOnboardingPrompt from '../components/Contacts/Onboarding/NotificationDetailOnboardingPrompt';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getReceivedNotification,
  getReceivedNotificationDocument,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { ServerResponseErrorCode } from '../utility/AppError/types';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const NotificationTimeline: React.FC = () => {
  const { id, mandateId } = useParams();
  const dispatch = useAppDispatch();

  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t, i18n } = useTranslation(['common', 'notifiche', 'appStatus']);
  const { NOTIFICATION_CANCELLED_HELP_LINK } = getConfiguration();
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const [isUserForbidden, setIsUserForbidden] = useState(false);
  const navigate = useNavigate();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );

  const notification = useAppSelector((state: RootState) => state.notificationState.notification);

  const isCancelled = useIsCancelled({ notification });
  const isCancelledOrCancelling = isCancelled.cancelled || isCancelled.cancellationInProgress;

  const showInfoMessageIfRetryAfterOrDownload = (response: {
    url: string;
    retryAfter?: number | undefined;
  }) => {
    if (response.retryAfter) {
      dispatch(
        appStateActions.addInfo({
          title: '',
          message: t(`detail.document-not-available`, {
            ns: 'notifiche',
          }),
        })
      );
    } else if (response.url) {
      downloadDocument(response.url);
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    if (legalFact.category !== LegalFactType.NOTIFICATION_CANCELLED && isCancelledOrCancelling) {
      return;
    }
    if (legalFact.category !== 'AAR') {
      // Legal fact case
      dispatch(
        getReceivedNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.LEGAL_FACT,
          documentId: legalFact.key.substring(legalFact.key.lastIndexOf('/') + 1),
          mandateId,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES,
        {
          source: 'dettaglio_notifica',
        }
      );
    } else {
      // AAR in timeline case
      dispatch(
        getReceivedNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.AAR,
          documentId: legalFact.key,
          mandateId,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
    }
  };

  const hasNotificationReceivedApiError = hasApiErrors(
    NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION
  );

  const fetchReceivedNotification = useCallback(() => {
    if (id) {
      dispatch(
        getReceivedNotification({
          iun: id,
          currentUserTaxId: currentUser.fiscal_number,
          delegatorsFromStore,
          mandateId,
        })
      )
        .unwrap()
        .catch((error) => {
          if (
            error?.response?.data?.errors?.[0]?.code ===
            ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR
          ) {
            setIsUserForbidden(true);
          }
        })
        .finally(() => setPageReady(true));
    }
  }, []);

  const handleUserInvalidError = useCallback((e: AppResponse) => {
    const error = e.errors?.[0];
    return error?.code !== ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR;
  }, []);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  useDismissToastOnError(NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION, handleUserInvalidError);

  const trackShowMoreLess = (collapsed: boolean) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL, {
      accordion: collapsed ? 'collapsed' : 'expanded',
    });
  };

  const properBreadcrumb = useMemo(() => {
    const backRoute = mandateId ? routes.GET_NOTIFICHE_DELEGATO_PATH(mandateId) : routes.NOTIFICHE;

    return (
      <PnBreadcrumb
        linkRoute={backRoute}
        linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
        currentLocationLabel={`${t('detail.breadcrumb-leaf', { ns: 'notifiche' })}`}
        goBackAction={() => navigate(backRoute)}
      />
    );
  }, [i18n.language]);

  const breadcrumb = <Fragment>{properBreadcrumb}</Fragment>;

  const cancelledAlert = isCancelledOrCancelling && (
    <MIAlert
      data-testid="cancelledAlertText"
      severity="warning"
      sx={{ mb: { xs: 2, lg: 0 } }}
      action={{
        label: t('detail.cancelled.cta', { ns: 'notifiche' }),
        onClick: () => {
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO
          );
          window.open(NOTIFICATION_CANCELLED_HELP_LINK, '_blank', 'noopener noreferrer');
        },
      }}
    >
      {t('detail.cancelled.message', { ns: 'notifiche' })}
    </MIAlert>
  );

  /**
   * If the user is not authorized to view the notification (PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR),
   * we will show an AccessDenied component. PN-17207
   */
  if (pageReady && isUserForbidden) {
    const i18nKey = currentUser.source?.retrievalId ? 'from-tpp' : 'from-qrcode';
    return (
      <AccessDenied
        icon={<IllusQuestion />}
        message={t(`${i18nKey}.not-found`, { ns: 'notifiche' })}
        subtitle={t(`${i18nKey}.not-found-subtitle`, { ns: 'notifiche' })}
        isLogged={true}
        goToHomePage={() => navigate(routes.NOTIFICHE, { replace: true })}
        goToLogin={() => {}}
      />
    );
  }

  return (
    <NotificationDetailOnboardingPrompt
      iun={notification.iun}
      mandateId={mandateId}
      route={routes.NOTIFICHE}
    >
      <LoadingPageWrapper isInitialized={pageReady}>
        {hasNotificationReceivedApiError && (
          <Box sx={{ p: 3 }}>
            {properBreadcrumb}
            <ApiError
              onClick={fetchReceivedNotification}
              mt={3}
              apiId={NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION}
            />
          </Box>
        )}
        {!hasNotificationReceivedApiError && (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }} gap={3}>
            {breadcrumb}
            <Stack gap={3}>
              <Typography variant="h4" component="h1">
                {t('detail.notification-timeline-section.title', { ns: 'notifiche' })}
              </Typography>
              {isCancelledOrCancelling && cancelledAlert}
              <MIPaper>
                <NotificationDetailTimeline
                  language={i18n.language}
                  recipients={notification.recipients}
                  statusHistory={notification.notificationStatusHistory}
                  clickHandler={legalFactDownloadHandler}
                  handleTrackShowMoreLess={trackShowMoreLess}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  disableDownloads={isCancelled.cancellationInTimeline}
                  isParty={false}
                />
              </MIPaper>
            </Stack>
          </Box>
        )}
      </LoadingPageWrapper>
    </NotificationDetailOnboardingPrompt>
  );
};

export default NotificationTimeline;
