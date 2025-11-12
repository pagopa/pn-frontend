/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */
import _ from 'lodash';
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Alert, AlertTitle, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  AccessDenied,
  ApiError,
  ApiErrorWrapper,
  AppResponse,
  AppResponsePublisher,
  AppRouteParams,
  EventPaymentRecipientType,
  GetDowntimeHistoryParams,
  IllusQuestion,
  LegalFactId,
  LegalFactType,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationDetailTable,
  NotificationDetailTableRow,
  NotificationDetailTimeline,
  NotificationDocumentType,
  NotificationPaymentRecipient,
  NotificationRelatedDowntimes,
  NotificationStatus,
  PaymentAttachmentSName,
  PaymentDetails,
  PnBreadcrumb,
  TitleBox,
  appStateActions,
  dateIsLessThan10Years,
  downloadDocument,
  formatDate,
  useErrors,
  useIsCancelled,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { NotificationDetailRouteState } from '../models/NotificationDetail';
import { PFEventsType } from '../models/PFEventsType';
import { ContactSource } from '../models/contacts';
import * as routes from '../navigation/routes.const';
import { getDowntimeLegalFact } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getDowntimeHistory,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationPayment,
  getReceivedNotificationPaymentInfo,
  getReceivedNotificationPaymentTppUrl,
  getReceivedNotificationPaymentUrl,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { exchangeNotificationRetrievalId } from '../redux/sidemenu/actions';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { ServerResponseErrorCode } from '../utility/AppError/types';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const NotificationDetail: React.FC = () => {
  const { id, mandateId } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t, i18n } = useTranslation(['common', 'notifiche', 'appStatus']);

  const isMobile = useIsMobile();
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const [isUserValid, setIsUserValid] = useState(true);
  const [downtimesReady, setDowntimesReady] = useState(false);
  const { F24_DOWNLOAD_WAIT_TIME, LANDING_SITE_URL, DOWNTIME_EXAMPLE_LINK } = getConfiguration();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );

  const isCancelled = useIsCancelled({ notification });
  const currentRecipient = notification?.currentRecipient;

  const userPayments = useAppSelector((state: RootState) => state.notificationState.paymentsData);
  const paymentTpp = useAppSelector((state: RootState) => state.generalInfoState.paymentTpp);

  const unfilteredDetailTableRows: Array<{
    label: string;
    rawValue: string | undefined;
    value: ReactNode;
  }> = [
    {
      label: t('detail.sender', { ns: 'notifiche' }),
      rawValue: notification.senderDenomination,
      value: <Box fontWeight={600}>{notification.senderDenomination}</Box>,
    },
    {
      label: t('detail.recipient', { ns: 'notifiche' }),
      rawValue: currentRecipient?.denomination,
      value: <Box fontWeight={600}>{currentRecipient?.denomination}</Box>,
    },
    {
      label: t('detail.date', { ns: 'notifiche' }),
      rawValue: formatDate(notification.sentAt),
      value: <Box fontWeight={600}>{formatDate(notification.sentAt)}</Box>,
    },
    {
      label: t('detail.iun', { ns: 'notifiche' }),
      rawValue: notification.iun,
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    {
      label: t('detail.cancelled-iun', { ns: 'notifiche' }),
      rawValue: notification.cancelledIun,
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
  ];

  const detailTableRows: Array<NotificationDetailTableRow> = unfilteredDetailTableRows
    .filter((row) => row.rawValue)
    .map((row, index) => ({
      id: index + 1,
      label: row.label,
      value: row.value,
    }));

  const checkIfUserHasPayments: boolean =
    !!currentRecipient.payments && currentRecipient.payments.length > 0;

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

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (isCancelled.cancelled || isCancelled.cancellationInProgress) {
      return;
    }

    if (_.isObject(document)) {
      // AAR case
      dispatch(
        getReceivedNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.AAR,
          documentId: document.documentId,
          mandateId,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DOWNLOAD_RECEIPT_NOTICE);
    } else {
      // Attachment case
      dispatch(
        getReceivedNotificationDocument({
          iun: notification.iun,
          documentType: NotificationDocumentType.ATTACHMENT,
          documentIdx: Number(document as string),
          mandateId,
        })
      )
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch(() => {});
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DOWNLOAD_ATTACHMENT);
    }
  };

  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    if (
      legalFact.category !== LegalFactType.NOTIFICATION_CANCELLED &&
      (isCancelled.cancelled || isCancelled.cancellationInProgress)
    ) {
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

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getReceivedNotificationPayment({
        iun: notification.iun,
        attachmentName: name,
        mandateId,
        attachmentIdx,
      })
    );

  const onPayClick = (noticeCode?: string, creditorTaxId?: string, amount?: number) => {
    if (noticeCode && creditorTaxId && amount && notification.senderDenomination) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_START_PAYMENT, { psp: 'pagopa' });
      dispatch(
        getReceivedNotificationPaymentUrl({
          paymentNotice: {
            noticeNumber: noticeCode,
            fiscalCode: creditorTaxId,
            amount,
            companyName: notification.senderDenomination,
            description: notification.subject,
          },
          returnUrl: window.location.href,
        })
      )
        .unwrap()
        .then((res: { checkoutUrl: string }) => {
          window.location.assign(res.checkoutUrl);
        })
        .catch(() => undefined);
    }
  };

  const onPayTppClick = (
    noticeCode?: string,
    creditorTaxId?: string,
    retrievalId?: string,
    tppName?: string
  ) => {
    if (noticeCode && creditorTaxId && retrievalId) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_START_PAYMENT, { psp: tppName });
      dispatch(
        getReceivedNotificationPaymentTppUrl({
          noticeCode,
          creditorTaxId,
          retrievalId,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.paymentUrl) {
            window.location.assign(res.paymentUrl);
          }
        })
        .catch(() => undefined);
    }
  };

  const hasNotificationReceivedApiError = hasApiErrors(
    NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION
  );

  const getDownloadFilesMessage = useCallback(
    (type: 'aar' | 'attachments'): string => {
      if (isCancelled.cancelled || isCancelled.cancellationInProgress) {
        return type === 'aar'
          ? t('detail.acts_files.notification_cancelled_aar', { ns: 'notifiche' })
          : t('detail.acts_files.notification_cancelled_acts', { ns: 'notifiche' });
      } else if (type === 'attachments') {
        return notification.documentsAvailable
          ? t('detail.acts_files.downloadable_acts', { ns: 'notifiche' })
          : t('detail.acts_files.not_downloadable_acts', { ns: 'notifiche' });
      } else {
        return dateIsLessThan10Years(notification.sentAt)
          ? t('detail.acts_files.downloadable_aar', { ns: 'notifiche' })
          : t('detail.acts_files.not_downloadable_aar', { ns: 'notifiche' });
      }
    },
    [isCancelled, notification.documentsAvailable]
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
            setIsUserValid(false);
          }
        })
        .finally(() => setPageReady(true));
    }
  }, []);

  const fetchPaymentsInfo = useCallback(
    (payments: Array<PaymentDetails | NotificationDetailPayment>) => {
      const paymentInfoRequest = payments.reduce((acc: any, payment) => {
        if (payment.pagoPa && Object.keys(payment.pagoPa).length > 0) {
          acc.push({
            noticeCode: payment.pagoPa.noticeCode,
            creditorTaxId: payment.pagoPa.creditorTaxId,
          });
        }
        return acc;
      }, []) as Array<{ noticeCode: string; creditorTaxId: string }>;

      if (paymentInfoRequest.length === 0) {
        return;
      }

      void dispatch(
        getReceivedNotificationPaymentInfo({
          taxId: currentRecipient.taxId,
          paymentInfoRequest,
        })
      );
    },
    [currentRecipient.payments]
  );

  const visibleDomicileBanner = () =>
    !mandateId &&
    notification.notificationStatusHistory.some(
      (history) => history.status === NotificationStatus.VIEWED
    );

  const handleUserInvalidError = useCallback((e: AppResponse) => {
    const error = e.errors?.[0];
    return error?.code !== ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR;
  }, []);

  useEffect(() => {
    if (checkIfUserHasPayments && !(isCancelled.cancelled || isCancelled.cancellationInProgress)) {
      fetchPaymentsInfo(currentRecipient.payments?.slice(0, 5) ?? []);
    }
  }, [currentRecipient.payments]);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  /* if retrievalId is in user token and payment info is not in redux, get payment info PN-13915 */
  useEffect(() => {
    if (!checkIfUserHasPayments) {
      return;
    }
    if (!currentUser.source?.retrievalId) {
      return;
    }
    if (currentUser.source?.retrievalId === paymentTpp.retrievalId) {
      return;
    }
    void dispatch(exchangeNotificationRetrievalId(currentUser.source.retrievalId));
  }, [currentUser, checkIfUserHasPayments]);

  // Dismiss toast if error is PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR
  useEffect(() => {
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
      handleUserInvalidError
    );

    return () => {
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION,
        handleUserInvalidError
      );
    };
  }, [handleUserInvalidError]);

  /* function which loads relevant information about donwtimes */
  const fetchDowntimeEvents = useCallback((fromDate: string, toDate: string | undefined) => {
    const fetchParams: GetDowntimeHistoryParams = {
      startDate: fromDate,
      endDate: toDate,
    };
    dispatch(getDowntimeHistory(fetchParams))
      .unwrap()
      .then(() => {
        setDowntimesReady(true);
      })
      .catch(() => {});
  }, []);

  const fetchDowntimeLegalFactDocumentDetails = useCallback((legalFactId: string) => {
    if (!isCancelled.cancelled || !isCancelled.cancellationInProgress) {
      dispatch(getDowntimeLegalFact(legalFactId))
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch((e) => console.log(e));
    }
  }, []);

  const rapidAccessSource = useMemo<AppRouteParams | undefined>(
    () => (location.state as NotificationDetailRouteState)?.source,
    [location]
  );

  const properBreadcrumb = useMemo(() => {
    const backRoute = mandateId ? routes.GET_NOTIFICHE_DELEGATO_PATH(mandateId) : routes.NOTIFICHE;
    return (
      <PnBreadcrumb
        showBackAction={!rapidAccessSource}
        linkRoute={backRoute}
        linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
        currentLocationLabel={`${t('detail.breadcrumb-leaf', { ns: 'notifiche' })}`}
        goBackAction={() => navigate(backRoute)}
      />
    );
  }, [rapidAccessSource, i18n.language]);

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

  const trackEventPaymentRecipient = (event: EventPaymentRecipientType, param?: object) => {
    PFEventStrategyFactory.triggerEvent(
      PFEventsType[event],
      event === EventPaymentRecipientType.SEND_PAYMENT_STATUS ||
        event === EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR
        ? param
        : undefined
    );
  };

  const reloadPaymentsInfo = (data: Array<NotificationDetailPayment>) => {
    fetchPaymentsInfo(data);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_DETAIL_REFRESH);
  };

  const trackShowMoreLess = (collapsed: boolean) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL, {
      accordion: collapsed ? 'collapsed' : 'expanded',
    });
  };

  useEffect(() => {
    if (downtimesReady && pageReady) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_DETAIL, {
        downtimeEvents,
        mandateId,
        notificationStatus: notification.notificationStatus,
        checkIfUserHasPayments,
        userPayments,
        source: rapidAccessSource,
        timeline: notification.timeline,
      });

      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATIONS_COUNT, {
        timeline: notification.timeline,
      });
    }
  }, [downtimesReady, pageReady]);

  /**
   * If the user is not authorized to view the notification (PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR),
   * we will show an AccessDenied component. PN-17207
   */
  if (pageReady && !isUserValid) {
    const i18nKey = paymentTpp ? 'from-tpp' : 'from-qrcode';
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
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumb}
          <Grid
            container
            direction={isMobile ? 'column-reverse' : 'row'}
            spacing={isMobile ? 3 : 0}
          >
            <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumb}
              <Stack spacing={3}>
                {(isCancelled.cancelled || isCancelled.cancellationInProgress) && (
                  <Alert data-testid="cancelledAlertText" severity="warning">
                    {t('detail.cancelled-alert-text', { ns: 'notifiche' })}
                  </Alert>
                )}

                {!isMobile && visibleDomicileBanner() && (
                  <DomicileBanner source={ContactSource.DETTAGLIO_NOTIFICA} />
                )}

                <NotificationDetailTable rows={detailTableRows} />
                <Paper sx={{ p: 3 }} elevation={0}>
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={notification.documents}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={notification.documentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage('attachments')}
                    downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                    disableDownloads={isCancelled.cancellationInTimeline}
                    titleVariant="h6"
                  />
                  {notification.radd && (
                    <Alert severity={'success'} sx={{ mb: 3, mt: 2 }} data-testid="raddAlert">
                      <AlertTitle>
                        {t('detail.timeline.radd.title', { ns: 'notifiche' })}
                      </AlertTitle>
                      {t('detail.timeline.radd.description', { ns: 'notifiche' })}
                    </Alert>
                  )}
                </Paper>
                {checkIfUserHasPayments && (
                  <Paper sx={{ p: 3 }} elevation={0}>
                    <ApiErrorWrapper
                      apiId={NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_INFO}
                      reloadAction={() => fetchPaymentsInfo(currentRecipient.payments ?? [])}
                      mainText={t('detail.payment.message-error-fetch-payment', {
                        ns: 'notifiche',
                      })}
                    >
                      <NotificationPaymentRecipient
                        payments={userPayments}
                        paymentTpp={paymentTpp}
                        isCancelled={isCancelled.cancelled}
                        iun={notification.iun}
                        handleTrackEvent={trackEventPaymentRecipient}
                        onPayClick={onPayClick}
                        onPayTppClick={onPayTppClick}
                        handleFetchPaymentsInfo={reloadPaymentsInfo}
                        getPaymentAttachmentAction={getPaymentAttachmentAction}
                        timerF24={F24_DOWNLOAD_WAIT_TIME}
                        landingSiteUrl={LANDING_SITE_URL}
                      />
                    </ApiErrorWrapper>
                  </Paper>
                )}
                <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="aarBox">
                  <NotificationDetailDocuments
                    title={t('detail.aar-acts', { ns: 'notifiche' })}
                    documents={notification.otherDocuments ?? []}
                    recipients={notification.recipients}
                    clickHandler={documentDowloadHandler}
                    downloadFilesMessage={getDownloadFilesMessage('aar')}
                    downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                    disableDownloads={
                      isCancelled.cancellationInTimeline ||
                      !dateIsLessThan10Years(notification.sentAt)
                    }
                  />
                </Paper>
                <NotificationRelatedDowntimes
                  downtimeEvents={downtimeEvents}
                  fetchDowntimeEvents={(fromDate, toDate) => fetchDowntimeEvents(fromDate, toDate)}
                  notificationStatusHistory={notification.notificationStatusHistory}
                  fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                  apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY}
                  disableDownloads={isCancelled.cancellationInTimeline}
                  downtimeExampleLink={DOWNTIME_EXAMPLE_LINK}
                />
              </Stack>
            </Grid>
            <Grid item lg={5} xs={12}>
              {isMobile && visibleDomicileBanner() && (
                <DomicileBanner source={ContactSource.DETTAGLIO_NOTIFICA} />
              )}
              <Box
                component="section"
                sx={{ backgroundColor: 'white', height: '100%', p: 3, pb: { xs: 0, lg: 3 } }}
              >
                <NotificationDetailTimeline
                  language={i18n.language}
                  recipients={notification.recipients}
                  statusHistory={notification.notificationStatusHistory}
                  title={t('detail.timeline-title', { ns: 'notifiche' })}
                  clickHandler={legalFactDownloadHandler}
                  historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  handleTrackShowMoreLess={trackShowMoreLess}
                  disableDownloads={isCancelled.cancellationInTimeline}
                  isParty={false}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </LoadingPageWrapper>
  );
};

export default NotificationDetail;
