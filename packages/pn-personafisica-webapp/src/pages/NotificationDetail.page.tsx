/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */
import { isObject } from 'lodash-es';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import {
  AbstractPaper,
  AccessDenied,
  ApiError,
  ApiErrorWrapper,
  AppResponse,
  AppRouteParams,
  DeliveryOutcomeType,
  EventPaymentRecipientType,
  GetDowntimeHistoryParams,
  IllusQuestion,
  NotificationDetailBilingualFacsimileDocuments,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationDetailSection,
  NotificationDocumentType,
  NotificationFeePolicy,
  NotificationPaymentRecipient,
  NotificationRelatedDowntimes,
  NotificationTimelineBox,
  PagoPaIntegrationMode,
  PaymentAttachmentSName,
  PaymentDetails,
  PnBreadcrumb,
  StatusHistoryParser,
  appStateActions,
  dateIsLessThan10Years,
  downloadDocument,
  getPaymentCache,
  useErrors,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import { useDismissToastOnError } from '@pagopa-pn/pn-commons/src/hooks/useDismissToastOnError';
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';
import { MIAlert, MIPaper } from '@pagopa/mui-italia';

import NotificationDetailOnboardingPrompt from '../components/Contacts/Onboarding/NotificationDetailOnboardingPrompt';
import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { NotificationCostBanner } from '../components/Notifications/NotificationCostBanner';
import { NotificationDetailRouteState } from '../models/NotificationDetail';
import { PFEventsType } from '../models/PFEventsType';
import { ContactSource } from '../models/contacts';
import * as routes from '../navigation/routes.const';
import { getDowntimeLegalFact } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector, useSafeAppDispatch } from '../redux/hooks';
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
  const safeDispatch = useSafeAppDispatch();
  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t, i18n } = useTranslation(['common', 'notifiche', 'appStatus']);

  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const [isUserForbidden, setIsUserForbidden] = useState(false);
  const [downtimesReady, setDowntimesReady] = useState(false);
  const {
    F24_DOWNLOAD_WAIT_TIME,
    DOWNTIME_EXAMPLE_LINK,
    NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK,
    NOTIFICATION_CANCELLED_HELP_LINK,
    FACSIMILE_EN,
    FACSIMILE_FR,
    FACSIMILE_DE,
    FACSIMILE_SL,
  } = getConfiguration();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const delegatorsFromStore = useAppSelector(
    (state: RootState) => state.generalInfoState.delegators
  );
  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const notificationLanguage = notification.additionalLanguages?.[0] ?? 'IT';
  const i18nLang = i18n.language.toUpperCase();
  const isSameLang = notificationLanguage === i18nLang;

  const showBilingualFacsimileSection = !isSameLang && i18nLang !== 'IT';
  const isCancelled = useIsCancelled({ notification });
  const isCancelledOrCancelling = isCancelled.cancelled || isCancelled.cancellationInProgress;
  const currentRecipient = notification?.currentRecipient;

  const userPayments = useAppSelector((state: RootState) => state.notificationState.paymentsData);
  const paymentTpp = useAppSelector((state: RootState) => state.generalInfoState.paymentTpp);

  const checkIfUserHasPayments: boolean =
    !!currentRecipient.payments && currentRecipient.payments.length > 0;

  const historyParser = useMemo(
    () => StatusHistoryParser.parse(notification.notificationStatusHistory),
    [notification.notificationStatusHistory]
  );
  const deliveryOutcome = useMemo(() => historyParser.resolveDeliveryOutcome(), [historyParser]);

  const isBannerVisible = !mandateId && !isCancelledOrCancelling;
  const isNotificationCostBanner =
    isBannerVisible &&
    notification.notificationFeePolicy === NotificationFeePolicy.DeliveryMode &&
    notification.pagoPaIntMode === PagoPaIntegrationMode.Async &&
    notification.recipients.length === 1;

  const banner = useMemo(() => {
    if (isNotificationCostBanner) {
      return (
        <NotificationCostBanner
          my={0}
          deliveryOutcome={deliveryOutcome}
          notificationCost={notification.notificationCostDetails}
        />
      );
    }

    return isBannerVisible && historyParser.hasViewedStatus() ? (
      <DomicileBanner source={ContactSource.DETTAGLIO_NOTIFICA} my={0} />
    ) : null;
  }, [
    isNotificationCostBanner,
    deliveryOutcome,
    isBannerVisible,
    historyParser,
    notification.notificationCostDetails,
  ]);

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
    if (isCancelledOrCancelling) {
      return;
    }

    if (isObject(document)) {
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
    tppName?: string,
    amount?: number
  ) => {
    if (noticeCode && creditorTaxId && retrievalId) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_START_PAYMENT, { psp: tppName });
      dispatch(
        getReceivedNotificationPaymentTppUrl({
          noticeCode,
          creditorTaxId,
          retrievalId,
          amount,
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
      if (isCancelledOrCancelling) {
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
    [isCancelledOrCancelling, notification.documentsAvailable, notification.sentAt]
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

      void safeDispatch(getReceivedNotificationPaymentInfo, {
        taxId: currentRecipient.taxId,
        paymentInfoRequest,
      });
    },
    [currentRecipient.payments]
  );

  const handleUserInvalidError = useCallback((e: AppResponse) => {
    const error = e.errors?.[0];
    return error?.code !== ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR;
  }, []);

  useEffect(() => {
    if (checkIfUserHasPayments && !isCancelledOrCancelling) {
      // get current page stored in cache
      const pageFromCache = getPaymentCache(notification.iun)?.currentPaymentPage ?? 0;
      fetchPaymentsInfo(currentRecipient.payments?.slice(pageFromCache, 5 + pageFromCache) ?? []);
    }
  }, [
    checkIfUserHasPayments,
    isCancelledOrCancelling,
    fetchPaymentsInfo,
    currentRecipient.payments,
  ]);

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

  useDismissToastOnError(NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION, handleUserInvalidError);

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

  const pecUnreachableAlert = isNotificationCostBanner &&
    historyParser.hasSimpleRegisteredLetter() && (
      <MIAlert data-testid="pecUnreachableAlertText" severity="warning">
        {t('detail.pec-unreachable', { ns: 'notifiche' })}
      </MIAlert>
    );

  const trackEventPaymentRecipient = (event: EventPaymentRecipientType, param?: object) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType[event], param);
  };

  const reloadPaymentsInfo = (data: Array<NotificationDetailPayment>) => {
    fetchPaymentsInfo(data);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_DETAIL_REFRESH);
  };

  const getFlowType = (): EventDeliveryFlowType => {
    if (deliveryOutcome?.type === DeliveryOutcomeType.ANALOG) {
      return 'physical_flow';
    }
    if (deliveryOutcome?.type === DeliveryOutcomeType.DIGITAL) {
      return 'digital';
    }
    return 'not_available';
  };

  const getDeliveryMode = (): EventDeliveryModeType => {
    if (notification.pagoPaIntMode === 'SYNC') {
      return 'sync';
    }
    if (notification.pagoPaIntMode === 'ASYNC') {
      return 'async';
    }
    if (notification.notificationFeePolicy === 'FLAT_RATE') {
      return 'flat_rate';
    }
    return 'not_set';
  };

  useEffect(() => {
    if (downtimesReady && pageReady && !isUserForbidden) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_DETAIL, {
        downtimeEvents,
        mandateId,
        notificationStatus: notification.notificationStatus,
        checkIfUserHasPayments,
        userPayments,
        source: rapidAccessSource,
        timeline: notification.timeline,
        notificationStatusHistory: notification.notificationStatusHistory,
        flow: getFlowType(),
        delivery_mode: getDeliveryMode(),
      });

      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATIONS_COUNT, {
        timeline: notification.timeline,
      });
    }
  }, [downtimesReady, pageReady, isUserForbidden]);

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

  const getFacSimileLink = (): string | undefined => {
    switch (i18n.language) {
      case 'en':
        return FACSIMILE_EN;
      case 'fr':
        return FACSIMILE_FR;
      case 'de':
        return FACSIMILE_DE;
      case 'sl':
        return FACSIMILE_SL;
      default:
        return undefined;
    }
  };

  const handleGoToTimeline = () => {
    if (id) {
      const targetUrl = routes.TIMELINE.replace(':id', id);
      navigate(targetUrl);
    }
  };

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
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'start',
              }}
              gap={2}
            >
              {/* start intro, banner, document and payment */}
              <Stack
                sx={{
                  display: { xs: 'flex', md: 'contents', xxl: 'flex' },
                  flexDirection: 'column',
                  width: { xs: '100%', xxl: 'calc(58% - 8px)' },
                }}
                gap={2}
              >
                {/* ELEMENT 1: intro and banner */}
                <Stack sx={{ width: { xs: '100%', md: '100%' } }} gap={2}>
                  {cancelledAlert}
                  <AbstractPaper
                    title={notification.subject}
                    senderPaId={notification.senderPaId}
                    senderDenomination={notification.senderDenomination}
                    sentAt={notification.sentAt}
                    iun={notification.iun}
                    abstract={notification.abstract}
                  />
                  {banner}
                  {pecUnreachableAlert}
                </Stack>
                {/* end ELEMENT 1: intro and banner */}

                {/* ELEMENT 2: document and payment */}
                <Stack
                  sx={{
                    width: { xs: '100%', md: 'calc(58% - 8px)', xxl: '100%' },
                  }}
                  gap={2}
                >
                  <MIPaper padding={24}>
                    <NotificationDetailDocuments
                      title={t('detail.acts', { ns: 'notifiche' })}
                      documents={notification.documents}
                      clickHandler={documentDowloadHandler}
                      documentsAvailable={notification.documentsAvailable}
                      downloadFilesMessage={getDownloadFilesMessage('attachments')}
                      downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                      disableDownloads={isCancelled.cancellationInTimeline}
                      titleVariant="h5"
                    />
                    {notification.radd && (
                      <MIAlert
                        severity="success"
                        data-testid="raddAlert"
                        sx={{ mb: 3, mt: 2 }}
                        title={t('detail.timeline.radd.title', { ns: 'notifiche' })}
                      >
                        {t('detail.timeline.radd.description', { ns: 'notifiche' })}
                      </MIAlert>
                    )}
                  </MIPaper>
                  {checkIfUserHasPayments && (
                    <MIPaper padding={24}>
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
                          isCancelled={isCancelledOrCancelling}
                          iun={notification.iun}
                          handleTrackEvent={trackEventPaymentRecipient}
                          onPayClick={onPayClick}
                          onPayTppClick={onPayTppClick}
                          handleFetchPaymentsInfo={reloadPaymentsInfo}
                          getPaymentAttachmentAction={getPaymentAttachmentAction}
                          timerF24={F24_DOWNLOAD_WAIT_TIME}
                          costDetailsAssistanceLink={NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK}
                          costDetails={notification.notificationCostDetails}
                          paymentTppUrlActionID={
                            NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_TPP_URL
                          }
                        />
                      </ApiErrorWrapper>
                    </MIPaper>
                  )}
                </Stack>
                {/* end ELEMENT 2: document and payment */}
              </Stack>
              {/* end intro, banner, document and payment */}

              {/* ELEMENT 3: aside */}
              <Stack
                order={{ xs: 3, md: 3, xxl: 2 }}
                component="aside"
                sx={{
                  width: { xs: '100%', md: 'calc(42% - 8px)', xxl: 'calc(42% - 8px)' },
                }}
                gap={2}
              >
                {notification.notificationStatusHistory.length > 0 && (
                  <NotificationTimelineBox
                    statusHistory={notification.notificationStatusHistory}
                    recipients={notification.recipients}
                    isParty={false}
                    onTimelineClick={handleGoToTimeline}
                  />
                )}
                <NotificationDetailSection
                  recipient={currentRecipient}
                  documents={notification.otherDocuments ?? []}
                  clickHandler={documentDowloadHandler}
                  downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                  disableDownloads={
                    isCancelled.cancellationInTimeline ||
                    !dateIsLessThan10Years(notification.sentAt)
                  }
                />
                <NotificationRelatedDowntimes
                  downtimeEvents={downtimeEvents}
                  fetchDowntimeEvents={(fromDate, toDate) => fetchDowntimeEvents(fromDate, toDate)}
                  notificationStatusHistory={notification.notificationStatusHistory}
                  fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                  apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY}
                  disableDownloads={isCancelled.cancellationInTimeline}
                  downtimeExampleLink={DOWNTIME_EXAMPLE_LINK}
                />
                {showBilingualFacsimileSection && (
                  <NotificationDetailBilingualFacsimileDocuments
                    title={t('detail.bilingual.title', { ns: 'notifiche' })}
                    description={t('detail.bilingual.description', { ns: 'notifiche' })}
                    action={t('detail.bilingual.action', { ns: 'notifiche' })}
                    link={getFacSimileLink()}
                  />
                )}
              </Stack>
              {/* end ELEMENT 3: aside */}
              {/* end document, payment and aside */}
            </Box>
          </Box>
        )}
      </LoadingPageWrapper>
    </NotificationDetailOnboardingPrompt>
  );
};

export default NotificationDetail;
