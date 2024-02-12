import _ from 'lodash';
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  ApiError,
  ApiErrorWrapper,
  Downtime,
  EventDowntimeType,
  EventNotificationDetailType,
  EventPaymentRecipientType,
  F24PaymentDetails,
  GetNotificationDowntimeEventsParams,
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationDetailTable,
  NotificationDetailTableRow,
  NotificationDetailTimeline,
  NotificationPaymentRecipient,
  NotificationRelatedDowntimes,
  NotificationStatus,
  PaymentAttachmentSName,
  PaymentDetails,
  PnBreadcrumb,
  TimedMessage,
  TimelineCategory,
  TitleBox,
  dateIsLessThan10Years,
  formatDate,
  useDownloadDocument,
  useErrors,
  useIsCancelled,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
  getNotificationPaymentInfo,
  getNotificationPaymentUrl,
  getPaymentAttachment,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  getReceivedNotificationOtherDocument,
} from '../redux/notification/actions';
import {
  clearDowntimeLegalFactData,
  resetLegalFactState,
  resetState,
} from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import { TrackEventType } from '../utility/events';
import { trackEventByType } from '../utility/mixpanel';

const getNotificationDetailData = (
  downtimeEvents: Array<Downtime>,
  mandateId: string | undefined,
  notificationStatus: NotificationStatus,
  checkIfUserHasPayments: boolean,
  userPayments: { pagoPaF24: Array<PaymentDetails>; f24Only: Array<F24PaymentDetails> },
  fromQrCode: boolean,
  timeline: Array<INotificationDetailTimeline>
): EventNotificationDetailType => {
  // eslint-disable-next-line functional/no-let
  let typeDowntime: EventDowntimeType;
  if (downtimeEvents.length === 0) {
    typeDowntime = EventDowntimeType.NOT_DISSERVICE;
  } else {
    typeDowntime =
      downtimeEvents.filter((downtime) => !!downtime.endDate).length === downtimeEvents.length
        ? EventDowntimeType.COMPLETED
        : EventDowntimeType.IN_PROGRESS;
  }
  const hasF24 =
    userPayments.f24Only.length > 0 ||
    userPayments.pagoPaF24.filter((payment) => payment.f24).length > 0;

  return {
    notification_owner: !mandateId,
    notification_status: notificationStatus,
    contains_payment: checkIfUserHasPayments,
    disservice_status: typeDowntime,
    contains_multipayment:
      userPayments.f24Only.length + userPayments.pagoPaF24.length > 1 ? 'yes' : 'no',
    count_payment: userPayments.pagoPaF24.filter((payment) => payment.pagoPa).length,
    contains_f24: hasF24 ? 'yes' : 'no',
    first_time_opening:
      timeline.findIndex((el) => el.category === TimelineCategory.NOTIFICATION_VIEWED) === -1,
    source: fromQrCode ? 'QRcode' : 'LISTA_NOTIFICHE',
  };
};

// state for the invocations to this component
// (to include in navigation or Link to the route/s arriving to it)
type LocationState = {
  fromQrCode?: boolean; // indicates whether the user arrived to the notification detail page from the QR code
};

const NotificationDetail = () => {
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
  const [downtimesReady, setDowntimesReady] = useState(false);
  const { F24_DOWNLOAD_WAIT_TIME, LANDING_SITE_URL } = getConfiguration();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );
  const downtimeLegalFactUrl = useAppSelector(
    (state: RootState) => state.notificationState.downtimeLegalFactUrl
  );

  const isCancelled = useIsCancelled({ notification });
  const currentRecipient = notification?.currentRecipient;

  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const otherDocumentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.otherDocumentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const legalFactDownloadRetryAfter = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadRetryAfter
  );
  const legalFactDownloadAARRetryAfter = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadAARRetryAfter
  );

  const userPayments = useAppSelector((state: RootState) => state.notificationState.paymentsData);

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
      label: t('detail.payment-terms', { ns: 'notifiche' }),
      rawValue: notification.paymentExpirationDate,
      value: <Box fontWeight={600}>{notification.paymentExpirationDate}</Box>,
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

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (isCancelled.cancelled || isCancelled.cancellationInProgress) {
      return;
    }

    if (_.isObject(document)) {
      void dispatch(
        getReceivedNotificationOtherDocument({
          iun: notification.iun,
          otherDocument: document,
          mandateId,
        })
      );
      trackEventByType(TrackEventType.SEND_DOWNLOAD_RECEIPT_NOTICE);
    } else {
      const documentIndex = document as string;
      void dispatch(
        getReceivedNotificationDocument({ iun: notification.iun, documentIndex, mandateId })
      );
      trackEventByType(TrackEventType.SEND_DOWNLOAD_ATTACHMENT);
    }
  };

  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in pn-commons/src/types/NotificationDetail.ts.
  const legalFactDownloadHandler = (legalFact: LegalFactId | NotificationDetailOtherDocument) => {
    if (isCancelled.cancelled || isCancelled.cancellationInProgress) {
      return;
    }
    if ((legalFact as LegalFactId).key) {
      dispatch(resetLegalFactState());
      void dispatch(
        getReceivedNotificationLegalfact({
          iun: notification.iun,
          legalFact: legalFact as LegalFactId,
          mandateId,
        })
      );
      trackEventByType(TrackEventType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES, {
        source: 'dettaglio_notifica',
      });
    } else if ((legalFact as NotificationDetailOtherDocument).documentId) {
      const otherDocument = legalFact as NotificationDetailOtherDocument;
      void dispatch(
        getReceivedNotificationOtherDocument({ iun: notification.iun, otherDocument, mandateId })
      );
    }
  };

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getPaymentAttachment({
        iun: notification.iun,
        attachmentName: name,
        mandateId,
        attachmentIdx,
      })
    );

  const onPayClick = (noticeCode?: string, creditorTaxId?: string, amount?: number) => {
    if (noticeCode && creditorTaxId && amount && notification.senderDenomination) {
      trackEventByType(TrackEventType.SEND_START_PAYMENT);
      dispatch(
        getNotificationPaymentUrl({
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
      void dispatch(
        getReceivedNotification({
          iun: id,
          currentUserTaxId: currentUser.fiscal_number,
          delegatorsFromStore,
          mandateId,
        })
      ).then(() => {
        setPageReady(true);
      });
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
        getNotificationPaymentInfo({
          taxId: currentRecipient.taxId,
          paymentInfoRequest,
        })
      )
        .unwrap()
        .catch(() => trackEventByType(TrackEventType.SEND_PAYMENT_DETAIL_ERROR));
    },
    [currentRecipient.payments]
  );

  useEffect(() => {
    if (checkIfUserHasPayments && !(isCancelled.cancelled || isCancelled.cancellationInProgress)) {
      fetchPaymentsInfo(currentRecipient.payments?.slice(0, 5) ?? []);
    }
  }, [currentRecipient.payments]);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  /* function which loads relevant information about donwtimes */
  const fetchDowntimeEvents = useCallback((fromDate: string, toDate: string | undefined) => {
    const fetchParams: GetNotificationDowntimeEventsParams = {
      startDate: fromDate,
      endDate: toDate,
    };
    void dispatch(getDowntimeEvents(fetchParams));
  }, []);

  const fetchDowntimeLegalFactDocumentDetails = useCallback((legalFactId: string) => {
    if (!isCancelled.cancelled || !isCancelled.cancellationInProgress) {
      void dispatch(getDowntimeLegalFactDocumentDetails(legalFactId));
    }
  }, []);

  useDownloadDocument({ url: documentDownloadUrl });
  useDownloadDocument({ url: legalFactDownloadUrl });
  useDownloadDocument({ url: otherDocumentDownloadUrl });

  const timeoutMessage = legalFactDownloadRetryAfter * 1000;
  const timeoutAARMessage = legalFactDownloadAARRetryAfter * 1000;

  const fromQrCode = useMemo(
    () => !!(location.state && (location.state as LocationState).fromQrCode),
    [location]
  );

  const properBreadcrumb = useMemo(() => {
    const backRoute = mandateId ? routes.GET_NOTIFICHE_DELEGATO_PATH(mandateId) : routes.NOTIFICHE;
    return (
      <PnBreadcrumb
        showBackAction={!fromQrCode}
        linkRoute={backRoute}
        linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
        currentLocationLabel={`${t('detail.breadcrumb-leaf', { ns: 'notifiche' })}`}
        goBackAction={() => navigate(backRoute)}
      />
    );
  }, [fromQrCode]);

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
    // eslint-disable-next-line functional/no-let
    trackEventByType(
      event as unknown as TrackEventType,
      event === EventPaymentRecipientType.SEND_PAYMENT_STATUS ? param : undefined
    );
  };

  const reloadPaymentsInfo = (data: Array<NotificationDetailPayment>) => {
    fetchPaymentsInfo(data);
    trackEventByType(TrackEventType.SEND_PAYMENT_DETAIL_REFRESH);
  };

  const trackShowMoreLess = (collapsed: boolean) => {
    trackEventByType(TrackEventType.SEND_NOTIFICATION_STATUS_DETAIL, {
      accordion: collapsed ? 'collapsed' : 'expanded',
    });
  };

  useEffect(() => {
    if (downtimesReady && pageReady) {
      trackEventByType(
        TrackEventType.SEND_NOTIFICATION_DETAIL,
        getNotificationDetailData(
          downtimeEvents,
          mandateId,
          notification.notificationStatus,
          checkIfUserHasPayments,
          userPayments,
          fromQrCode,
          notification.timeline
        )
      );
    }
  }, [downtimesReady, pageReady]);

  const handleDowntimesReadyEvent = () => {
    setDowntimesReady(true);
  };

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
                  <Alert tabIndex={0} data-testid="cancelledAlertText" severity="warning">
                    {t('detail.cancelled-alert-text', { ns: 'notifiche' })}
                  </Alert>
                )}
                <NotificationDetailTable rows={detailTableRows} />

                {!mandateId && <DomicileBanner source="dettaglio_notifica" />}
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
                </Paper>

                {checkIfUserHasPayments && (
                  <Paper sx={{ p: 3 }} elevation={0}>
                    <ApiErrorWrapper
                      apiId={NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_INFO}
                      reloadAction={() => fetchPaymentsInfo(currentRecipient.payments ?? [])}
                      mainText={t('detail.payment.message-error-fetch-payment', {
                        ns: 'notifiche',
                      })}
                    >
                      <NotificationPaymentRecipient
                        payments={userPayments}
                        isCancelled={isCancelled.cancelled}
                        iun={notification.iun}
                        handleTrackEvent={trackEventPaymentRecipient}
                        onPayClick={onPayClick}
                        handleFetchPaymentsInfo={reloadPaymentsInfo}
                        getPaymentAttachmentAction={getPaymentAttachmentAction}
                        timerF24={F24_DOWNLOAD_WAIT_TIME}
                        landingSiteUrl={LANDING_SITE_URL}
                      />
                    </ApiErrorWrapper>
                  </Paper>
                )}

                <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="aarBox">
                  <TimedMessage timeout={timeoutAARMessage}>
                    <Alert severity={'warning'} sx={{ mb: 3 }} data-testid="docNotAvailableAlert">
                      {t('detail.document-not-available', { ns: 'notifiche' })}
                    </Alert>
                  </TimedMessage>
                  <NotificationDetailDocuments
                    title={t('detail.aar-acts', { ns: 'notifiche' })}
                    documents={notification.otherDocuments ?? []}
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
                  componentReady={handleDowntimesReadyEvent}
                  fetchDowntimeEvents={(fromDate, toDate) => fetchDowntimeEvents(fromDate, toDate)}
                  notificationStatusHistory={notification.notificationStatusHistory}
                  downtimeLegalFactUrl={downtimeLegalFactUrl}
                  fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                  clearDowntimeLegalFactData={() => dispatch(clearDowntimeLegalFactData())}
                  apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_EVENTS}
                  disableDownloads={isCancelled.cancellationInTimeline}
                />
              </Stack>
            </Grid>
            <Grid item lg={5} xs={12}>
              <Box
                component="section"
                sx={{ backgroundColor: 'white', height: '100%', p: 3, pb: { xs: 0, lg: 3 } }}
              >
                <TimedMessage timeout={timeoutMessage}>
                  <Alert severity={'warning'} sx={{ mb: 3 }} data-testid="docNotAvailableAlert">
                    {t('detail.document-not-available', { ns: 'notifiche' })}
                  </Alert>
                </TimedMessage>
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
