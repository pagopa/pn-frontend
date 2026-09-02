/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';
import {
  ApiError,
  LegalFactId,
  LegalFactType,
  NotificationDetailTimeline,
  NotificationDocumentType,
  NotificationEventsTimeline,
  appStateActions,
  downloadDocument,
  useErrors,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import { MIAlert, MIBreadcrumbItem, MIBreadcrumbs, MIPaper } from '@pagopa/mui-italia';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PGEventsType } from '../models/PGEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationTimeline,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PGEventStrategyFactory from '../utility/MixpanelUtils/PGEventStrategyFactory';

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
  const { NOTIFICATION_CANCELLED_HELP_LINK, IS_NEW_TIMELINE_ENABLED } = getConfiguration();
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const navigate = useNavigate();

  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const notificationTimeline = useAppSelector(
    (state: RootState) => state.notificationState.notificationTimeline
  );
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const organization = currentUser.organization;

  const isCancelled = useIsCancelled({
    notification: IS_NEW_TIMELINE_ENABLED ? notificationTimeline : notification,
  });
  const isCancelledOrCancelling = isCancelled.cancelled || isCancelled.cancellationInProgress;

  const timelineApiId = IS_NEW_TIMELINE_ENABLED
    ? NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_TIMELINE
    : NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION;
  const hasNotificationTimelineApiError = hasApiErrors(timelineApiId);

  const notificationIUN = IS_NEW_TIMELINE_ENABLED ? notificationTimeline.iun : notification.iun;
  const notificationSubject = IS_NEW_TIMELINE_ENABLED
    ? notificationTimeline.subject
    : notification.subject;

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

  const trackTimelineShowMore = (collapsed: boolean) => {
    if (!collapsed) {
      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_TIMELINE_SHOW_MORE);
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    if (legalFact.category !== LegalFactType.NOTIFICATION_CANCELLED && isCancelledOrCancelling) {
      return;
    }

    PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_TIMELINE_DOWNLOAD, { legalFact });

    const isAAR = legalFact.category === NotificationDocumentType.AAR;
    const documentType = isAAR ? NotificationDocumentType.AAR : NotificationDocumentType.LEGAL_FACT;
    const documentId = isAAR
      ? legalFact.key
      : legalFact.key.substring(legalFact.key.lastIndexOf('/') + 1);

    dispatch(
      getReceivedNotificationDocument({ iun: notificationIUN, documentType, documentId, mandateId })
    )
      .unwrap()
      .then(showInfoMessageIfRetryAfterOrDownload)
      .catch(() => {});
  };

  const fetchReceivedNotification = useCallback(() => {
    if (!id) {
      return;
    }

    const request = IS_NEW_TIMELINE_ENABLED
      ? dispatch(getReceivedNotificationTimeline({ iun: id, mandateId }))
      : dispatch(getReceivedNotification({ iun: id, mandateId }));

    void request
      .unwrap()
      .catch(() => {})
      .finally(() => setPageReady(true));
  }, [id, IS_NEW_TIMELINE_ENABLED, mandateId]);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  const properBreadcrumb = useMemo(() => {
    if (!id) {
      return null;
    }

    const notificationDetailRoute = mandateId
      ? routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(id, mandateId)
      : routes.GET_DETTAGLIO_NOTIFICA_PATH(id);

    const breadcrumbLabel = mandateId
      ? t('menu.notifiche-delegato')
      : t('menu.notifiche-impresa', { organization: organization?.name });

    return (
      <MIBreadcrumbs
        backButtonLabel={t('button.indietro', { ns: 'common' })}
        backButtonAction={() => navigate(notificationDetailRoute)}
      >
        <MIBreadcrumbItem
          label={breadcrumbLabel}
          onClick={() => {
            navigate(mandateId ? routes.NOTIFICHE_DELEGATO : routes.NOTIFICHE);
          }}
          data-testid="breadcrumb-root-button"
        />
        <MIBreadcrumbItem
          label={notification.subject || t('menu.fallback-notification')}
          onClick={() => navigate(notificationDetailRoute)}
        />
        <MIBreadcrumbItem
          label={t('detail.notification-timeline-section.title', { ns: 'notifiche' })}
          current
        />
      </MIBreadcrumbs>
    );
  }, [id, i18n.language, notificationSubject, mandateId]);

  const cancelledAlert = isCancelledOrCancelling && (
    <MIAlert
      data-testid="cancelledAlertText"
      severity="warning"
      sx={{ mb: { xs: 2, lg: 0 } }}
      action={{
        label: t('detail.cancelled.cta', { ns: 'notifiche' }),
        href: NOTIFICATION_CANCELLED_HELP_LINK,
        rel: 'noopener noreferrer',
        target: '_blank',
      }}
    >
      {t('detail.cancelled.message', { ns: 'notifiche' })}
    </MIAlert>
  );

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      {hasNotificationTimelineApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError onClick={fetchReceivedNotification} mt={3} apiId={timelineApiId} />
        </Box>
      )}
      {!hasNotificationTimelineApiError && (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }} gap={3}>
          {properBreadcrumb}
          <Stack gap={3}>
            <Typography variant="h4" component="h1">
              {t('detail.notification-timeline-section.title', { ns: 'notifiche' })}
            </Typography>
            {isCancelledOrCancelling && cancelledAlert}
            <MIPaper>
              {IS_NEW_TIMELINE_ENABLED ? (
                <NotificationEventsTimeline
                  language={i18n.language}
                  recipients={notificationTimeline.recipients}
                  statusHistory={notificationTimeline.notificationStatusHistory}
                  clickHandler={legalFactDownloadHandler}
                  disableDownloads={isCancelled.cancellationInTimeline}
                />
              ) : (
                <NotificationDetailTimeline
                  language={i18n.language}
                  recipients={notification.recipients}
                  statusHistory={notification.notificationStatusHistory}
                  clickHandler={legalFactDownloadHandler}
                  handleTrackShowMoreLess={trackTimelineShowMore}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  disableDownloads={isCancelled.cancellationInTimeline}
                  isParty={false}
                />
              )}
            </MIPaper>
          </Stack>
        </Box>
      )}
    </LoadingPageWrapper>
  );
};

export default NotificationTimeline;
