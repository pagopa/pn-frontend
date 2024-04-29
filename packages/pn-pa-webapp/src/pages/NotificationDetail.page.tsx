import _ from 'lodash';
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
  NotificationRelatedDowntimes,
  PnBreadcrumb,
  TitleBox,
  appStateActions,
  dateIsLessThan10Years,
  downloadDocument,
  useDownloadDocument,
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
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../redux/notification/actions';
import { resetLegalFactState, resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { ServerResponseErrorCode } from '../utility/AppError/types';

type Props = {
  notification: NotificationDetailType;
};

const AlertNotificationCancel: React.FC<Props> = (notification) => {
  const { t } = useTranslation(['notifiche']);
  const { cancelled, cancellationInProgress } = useIsCancelled(notification);

  if (cancelled || cancellationInProgress) {
    return (
      <Alert tabIndex={0} data-testid="alert" sx={{ mt: 1 }} severity={'warning'}>
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

  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const otherDocumentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.otherDocumentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
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

  const showInfoMessageIfRetryAfter = (response: {
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
    }
  };

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (_.isObject(document)) {
      void dispatch(
        getSentNotificationOtherDocument({ iun: notification.iun, otherDocument: document })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfter);
    } else {
      const documentIndex = document as string;
      void dispatch(getSentNotificationDocument({ iun: notification.iun, documentIndex }));
    }
  };

  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in pn-commons/src/types/NotificationDetail.ts.
  const legalFactDownloadHandler = (legalFact: LegalFactId | NotificationDetailOtherDocument) => {
    if ((legalFact as LegalFactId).key) {
      const legalFactAsLegalFact = legalFact as LegalFactId;
      dispatch(resetLegalFactState());
      void dispatch(
        getSentNotificationLegalfact({
          iun: notification.iun,
          legalFact: {
            key: legalFactAsLegalFact.key.substring(legalFactAsLegalFact.key.lastIndexOf('/') + 1),
            category: legalFactAsLegalFact.category,
          },
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfter);
    } else if ((legalFact as NotificationDetailOtherDocument).documentId) {
      const otherDocument = legalFact as NotificationDetailOtherDocument;
      void dispatch(getSentNotificationOtherDocument({ iun: notification.iun, otherDocument }));
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
      .then((res) => {
        if (res.url) {
          downloadDocument(res.url);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  useDownloadDocument({ url: legalFactDownloadUrl });
  useDownloadDocument({ url: documentDownloadUrl });
  useDownloadDocument({ url: otherDocumentDownloadUrl });

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
