import * as _ from 'lodash-es';
import React, { Fragment, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Alert, AlertTitle, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  ApiError,
  AppResponse,
  AppResponsePublisher,
  GetDowntimeHistoryParams,
  LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailTimeline,
  NotificationDetail as NotificationDetailType,
  NotificationDocumentResponse,
  NotificationDocumentType,
  NotificationRelatedDowntimes,
  PnBreadcrumb,
  TitleBox,
  appStateActions,
  dateIsLessThan10Years,
  downloadDocument,
  useErrors,
  useIsCancelled,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import NotificationDetailTableSender from '../components/Notifications/NotificationDetailTableSender';
import NotificationPaymentSender from '../components/Notifications/NotificationPaymentSender';
import * as routes from '../navigation/routes.const';
import { getDowntimeLegalFact } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  cancelNotification,
  getDowntimeHistory,
  getSentNotification,
  getSentNotificationDocument,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { ServerResponseErrorCode } from '../utility/AppError/types';

type Props = {
  notification: NotificationDetailType;
};

const AlertNotificationCancel: React.FC<Props> = (notification) => {
  const { t } = useTranslation(['notifiche']);
  const { cancelled, cancellationInProgress } = useIsCancelled(notification);

  if (cancelled || cancellationInProgress) {
    return (
      <Alert data-testid="alert" sx={{ mt: 1 }} severity="warning">
        <Typography component="span" variant="body1">
          {cancellationInProgress
            ? t('detail.alert-cancellation-in-progress')
            : t('detail.alert-cancellation-confirmed')}
        </Typography>
      </Alert>
    );
  }

  return <></>;
};

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { hasApiErrors } = useErrors();
  const isMobile = useIsMobile();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const { DOWNTIME_EXAMPLE_LINK } = getConfiguration();

  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );

  const { recipients } = notification;
  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t, i18n } = useTranslation(['common', 'notifiche', 'appStatus']);

  const hasNotificationSentApiError = hasApiErrors(NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION);

  const checkIfNotificationHasPayments = notification.recipients.some(
    (recipient) => recipient.payments && recipient.payments.length > 0
  );

  const showInfoMessageIfRetryAfterOrDownload = (response: NotificationDocumentResponse) => {
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

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (_.isObject(document)) {
      // AAR case
      dispatch(
        getSentNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.AAR,
          documentId: document.documentId,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
    } else {
      // Attachment case
      dispatch(
        getSentNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.ATTACHMENT,
          documentIdx: Number(document as string),
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    if (legalFact.category !== 'AAR') {
      // Legal fact case
      dispatch(
        getSentNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.LEGAL_FACT,
          documentId: legalFact.key.substring(legalFact.key.lastIndexOf('/') + 1),
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
    } else {
      // AAR in timeline case
      dispatch(
        getSentNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.AAR,
          documentId: legalFact.key,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
    }
  };

  const handleCancelNotification = () => {
    void dispatch(cancelNotification(notification.iun))
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`detail.cancel-notification-modal.notification-cancelled-successfully`, {
              ns: 'notifiche',
            }),
          })
        );
        // reload notification detail
        fetchSentNotification();
      });
  };

  const handleCancellationError = useCallback((responseError: AppResponse) => {
    if (Array.isArray(responseError.errors)) {
      const managedErrors = (
        Object.keys(ServerResponseErrorCode) as Array<keyof typeof ServerResponseErrorCode>
      ).map((key) => ServerResponseErrorCode[key]);
      const error = responseError.errors[0];
      if (!managedErrors.includes(error.code as ServerResponseErrorCode)) {
        dispatch(
          appStateActions.addError({
            title: '',
            message: t(`detail.errors.generic_error.message`, {
              ns: 'notifiche',
            }),
            showTechnicalData: false,
          })
        );
        return false;
      }
      return true;
    }
    return true;
  }, []);

  const getDownloadFilesMessage = useCallback(
    (type: 'aar' | 'attachments'): string => {
      if (type === 'attachments') {
        return notification.documentsAvailable
          ? t('detail.download-message-available', { ns: 'notifiche' })
          : t('detail.download-message-expired', { ns: 'notifiche' });
      } else {
        return dateIsLessThan10Years(notification.sentAt) // 10 years
          ? t('detail.download-aar-available', { ns: 'notifiche' })
          : t('detail.download-aar-expired', { ns: 'notifiche' });
      }
    },
    [notification.documentsAvailable]
  );

  const fetchSentNotification = useCallback(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, [id]);

  useEffect(() => {
    fetchSentNotification();
    return () => void dispatch(resetState());
  }, [fetchSentNotification]);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('cancelNotification', handleCancellationError);

    return () => {
      AppResponsePublisher.error.unsubscribe('cancelNotification', handleCancellationError);
    };
  }, [handleCancellationError]);

  /* function which loads relevant information about donwtimes */
  const fetchDowntimeEvents = useCallback((fromDate: string, toDate: string | undefined) => {
    const fetchParams: GetDowntimeHistoryParams = {
      startDate: fromDate,
      endDate: toDate,
    };
    void dispatch(getDowntimeHistory(fetchParams));
  }, []);

  const fetchDowntimeLegalFactDocumentDetails = useCallback((legalFactId: string) => {
    dispatch(getDowntimeLegalFact(legalFactId))
      .unwrap()
      .then(showInfoMessageIfRetryAfterOrDownload)
      .catch((e) => console.log(e));
  }, []);

  const properBreadcrumb = (
    <PnBreadcrumb
      linkRoute={routes.DASHBOARD}
      linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
      currentLocationLabel={t('detail.breadcrumb-leaf', { ns: 'notifiche' })}
      goBackLabel={t('button.indietro', { ns: 'common' })}
    />
  );

  const breadcrumb = (
    <Fragment>
      {properBreadcrumb}
      <TitleBox
        variantTitle="h4"
        title={notification.subject}
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      ></TitleBox>
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {notification.abstract}
      </Typography>
    </Fragment>
  );

  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;
  return (
    <>
      {hasNotificationSentApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError
            onClick={() => fetchSentNotification()}
            mt={3}
            apiId={NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION}
          />
        </Box>
      )}
      {!hasNotificationSentApiError && (
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumb}
          <Grid container direction={direction} spacing={spacing}>
            <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumb}
              <Stack spacing={3}>
                <AlertNotificationCancel notification={notification} />
                <NotificationDetailTableSender
                  notification={notification}
                  onCancelNotification={handleCancelNotification}
                />
                {checkIfNotificationHasPayments && (
                  <NotificationPaymentSender
                    iun={notification.iun}
                    recipients={recipients}
                    timeline={notification.timeline}
                  />
                )}
                <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={notification.documents}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={notification.documentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage('attachments')}
                    downloadFilesLink={t('detail.download-files-link', { ns: 'notifiche' })}
                  />
                  {notification.radd && (
                    <Alert severity={'success'} sx={{ mb: 3, mt: 2 }} data-testid="raddAlert">
                      <AlertTitle>
                        {t('detail.timeline.radd.title', { ns: 'notifiche' })}
                      </AlertTitle>
                      {notification.recipients.length === 1
                        ? t('detail.timeline.radd.description-mono-recipient', { ns: 'notifiche' })
                        : t('detail.timeline.radd.description-multi-recipients', {
                            ns: 'notifiche',
                          })}
                    </Alert>
                  )}
                </Paper>
                <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="aarDownload">
                  <NotificationDetailDocuments
                    title={t('detail.aar-acts', { ns: 'notifiche' })}
                    documents={notification.otherDocuments ?? []}
                    recipients={notification.recipients}
                    clickHandler={documentDowloadHandler}
                    disableDownloads={!dateIsLessThan10Years(notification.sentAt)}
                    downloadFilesMessage={getDownloadFilesMessage('aar')}
                    downloadFilesLink={t('detail.download-files-link', { ns: 'notifiche' })}
                  />
                </Paper>
                <NotificationRelatedDowntimes
                  downtimeEvents={downtimeEvents}
                  fetchDowntimeEvents={fetchDowntimeEvents}
                  notificationStatusHistory={notification.notificationStatusHistory}
                  fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                  apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY}
                  downtimeExampleLink={DOWNTIME_EXAMPLE_LINK}
                />
              </Stack>
            </Grid>
            <Grid item lg={5} xs={12}>
              <Box sx={{ backgroundColor: 'white', height: '100%', p: 3, pb: { xs: 0, lg: 3 } }}>
                <NotificationDetailTimeline
                  language={i18n.language}
                  recipients={recipients}
                  statusHistory={notification.notificationStatusHistory}
                  title={t('detail.timeline-title', { ns: 'notifiche' })}
                  clickHandler={legalFactDownloadHandler}
                  historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default NotificationDetail;
