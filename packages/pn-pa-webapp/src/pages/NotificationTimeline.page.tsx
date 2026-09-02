import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';
import {
  ApiError,
  LegalFactId,
  LoadingPage,
  NotificationDetailTimeline,
  NotificationDocumentResponse,
  NotificationDocumentType,
  NotificationEventsTimeline,
  appStateActions,
  downloadDocument,
  useErrors,
} from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs, MIPaper } from '@pagopa/mui-italia';

import { PAEventsType } from '../models/PAEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationTimeline,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PAEventStrategyFactory from '../utility/MixpanelUtils/PAEventStrategyFactory';

const NotificationTimeline: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { hasApiErrors } = useErrors();
  const { t, i18n } = useTranslation(['common', 'notifiche', 'appStatus']);
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const notificationTimeline = useAppSelector(
    (state: RootState) => state.notificationState.notificationTimeline
  );
  const { IS_NEW_TIMELINE_ENABLED } = getConfiguration();
  const [pageReady, setPageReady] = useState(false);
  const navigate = useNavigate();

  const timelineApiId = IS_NEW_TIMELINE_ENABLED
    ? NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION_TIMELINE
    : NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION;
  const hasNotificationSentApiError = hasApiErrors(timelineApiId);

  const notificationIUN = IS_NEW_TIMELINE_ENABLED ? notificationTimeline.iun : notification.iun;

  const fetchSentNotification = useCallback(() => {
    if (!id) {
      return;
    }
    setPageReady(false);
    const request = IS_NEW_TIMELINE_ENABLED
      ? dispatch(getSentNotificationTimeline(id))
      : dispatch(getSentNotification(id));

    void request
      .unwrap()
      .catch(() => {})
      .finally(() => setPageReady(true));
  }, [id, IS_NEW_TIMELINE_ENABLED]);

  useEffect(() => {
    fetchSentNotification();
    return () => void dispatch(resetState());
  }, [fetchSentNotification]);

  const showInfoMessageIfRetryAfterOrDownload = (response: NotificationDocumentResponse) => {
    if (response.retryAfter) {
      dispatch(
        appStateActions.addInfo({
          title: '',
          message: t('detail.document-not-available', { ns: 'notifiche' }),
        })
      );
    } else if (response.url) {
      downloadDocument(response.url);
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_TIMELINE_DOWNLOAD, { legalFact });

    const isAAR = legalFact.category === NotificationDocumentType.AAR;
    const documentType = isAAR ? NotificationDocumentType.AAR : NotificationDocumentType.LEGAL_FACT;
    const documentId = isAAR
      ? legalFact.key
      : legalFact.key.substring(legalFact.key.lastIndexOf('/') + 1);

    dispatch(getSentNotificationDocument({ iun: notificationIUN, documentType, documentId }))
      .unwrap()
      .then(showInfoMessageIfRetryAfterOrDownload)
      .catch(() => {});
  };

  const trackTimelineShowMore = (collapsed: boolean) => {
    if (!collapsed) {
      PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_TIMELINE_SHOW_MORE);
    }
  };

  const properBreadcrumb = useMemo(() => {
    if (!id) {
      return null;
    }

    return (
      <MIBreadcrumbs
        backButtonLabel={t('button.indietro', { ns: 'common' })}
        backButtonAction={() =>
          location.state?.fromNotificationDetail
            ? navigate(-1)
            : navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(id), { replace: true })
        }
      >
        <MIBreadcrumbItem
          label={t('detail.breadcrumb-root', { ns: 'notifiche' })}
          onClick={() => navigate(routes.DASHBOARD)}
          data-testid="breadcrumb-root-button"
        />
        <MIBreadcrumbItem
          label={notificationIUN}
          onClick={() => navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(id))}
        />
        <MIBreadcrumbItem
          label={t('detail.notification-timeline-section.title', { ns: 'notifiche' })}
          current
        />
      </MIBreadcrumbs>
    );
  }, [id, i18n.language, location.state, notificationIUN]);

  return (
    <>
      {hasNotificationSentApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError onClick={fetchSentNotification} mt={3} apiId={timelineApiId} />
        </Box>
      )}

      {!hasNotificationSentApiError && !pageReady && (
        <LoadingPage
          sx={{
            backgroundColor: 'background.paper',
            minHeight: '60vh',
          }}
        />
      )}

      {!hasNotificationSentApiError && pageReady && (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }} gap={3}>
          {properBreadcrumb}
          <Stack gap={3}>
            <Typography variant="h4" component="h1">
              {t('detail.notification-timeline-section.title', { ns: 'notifiche' })}
            </Typography>
            <MIPaper>
              {IS_NEW_TIMELINE_ENABLED ? (
                <NotificationEventsTimeline
                  language={i18n.language}
                  recipients={notificationTimeline.recipients}
                  statusHistory={notificationTimeline.notificationStatusHistory}
                  clickHandler={legalFactDownloadHandler}
                  isSenderTimeline
                />
              ) : (
                <NotificationDetailTimeline
                  language={i18n.language}
                  recipients={notification.recipients}
                  statusHistory={notification.notificationStatusHistory}
                  clickHandler={legalFactDownloadHandler}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  handleTrackShowMoreLess={trackTimelineShowMore}
                />
              )}
            </MIPaper>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default NotificationTimeline;
