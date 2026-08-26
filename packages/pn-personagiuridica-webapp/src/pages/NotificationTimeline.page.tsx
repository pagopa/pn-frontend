/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';
import {
  ApiError,
  LegalFactId,
  LegalFactType,
  NotificationDetailTimeline,
  NotificationDocumentType,
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
  const { NOTIFICATION_CANCELLED_HELP_LINK } = getConfiguration();
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);

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
      void dispatch(
        getReceivedNotification({
          iun: id,
          mandateId,
        })
      ).then(() => setPageReady(true));
    }
  }, []);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  const properBreadcrumb = useMemo(() => {
    if (!id) {
      return null;
    }

    return (
      <MIBreadcrumbs>
        <MIBreadcrumbItem
          label={t('menu.notifiche', { ns: 'notifiche' })}
          href={mandateId ? routes.NOTIFICHE_DELEGATO : routes.NOTIFICHE}
        />
        <MIBreadcrumbItem
          label={notification.subject ?? t('menu.fallback-communication', { ns: 'notifiche' })}
          current
        />
      </MIBreadcrumbs>
    );
  }, [i18n.language, notification.subject]);

  const breadcrumb = <Fragment>{properBreadcrumb}</Fragment>;

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
                handleTrackShowMoreLess={trackTimelineShowMore}
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
  );
};

export default NotificationTimeline;
