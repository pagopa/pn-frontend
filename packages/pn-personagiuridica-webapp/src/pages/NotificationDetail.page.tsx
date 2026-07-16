import { isObject } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import {
  AbstractPaper,
  ApiError,
  ApiErrorWrapper,
  DeliveryOutcomeType,
  GetDowntimeHistoryParams,
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
  useHasPermissions,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
  EventNotificationSource,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';
import { MIAlert, MIPaper } from '@pagopa/mui-italia';

import DomicileBanner from '../components/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { NotificationCostBanner } from '../components/Notifications/NotificationCostBanner';
import { PGEventsType } from '../models/PGEventsType';
import { PNRole } from '../models/User';
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
  getReceivedNotificationPaymentUrl,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PGEventStrategyFactory from '../utility/MixpanelUtils/PGEventStrategyFactory';

// state for the invocations to this component
// (to include in navigation or Link to the route/s arriving to it)
type LocationState = {
  fromQrCode?: boolean; // indicates whether the user arrived to the notification detail page from the QR code
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const NotificationDetail = () => {
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
  const [downtimesReady, setDowntimesReady] = useState(false);
  const {
    F24_DOWNLOAD_WAIT_TIME,
    DOWNTIME_EXAMPLE_LINK,
    NOTIFICATION_CANCELLED_HELP_LINK,
    NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK,
    FACSIMILE_EN,
    FACSIMILE_FR,
    FACSIMILE_DE,
    FACSIMILE_SL,
    SELFCARE_CDN_URL,
  } = getConfiguration();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;

  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);
  const downtimeEvents = useAppSelector(
    (state: RootState) => state.notificationState.downtimeEvents
  );
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const notificationLanguage = notification.additionalLanguages?.[0] ?? 'IT';
  const i18nLang = i18n.language.toUpperCase();
  const isSameLang = notificationLanguage === i18nLang;

  const showBilingualFacsimileSection = !isSameLang && i18nLang !== 'IT';

  const currentRecipient = notification?.currentRecipient;
  const isCancelled = useIsCancelled({ notification });
  const isCancelledOrCancelling = isCancelled.cancelled || isCancelled.cancellationInProgress;

  const userPayments = useAppSelector((state: RootState) => state.notificationState.paymentsData);

  const checkIfUserHasPayments: boolean =
    !!currentRecipient.payments && currentRecipient.payments.length > 0;

  const canManageContacts = userHasAdminPermissions && !currentUser.hasGroup;

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
          deliveryOutcome={deliveryOutcome}
          notificationCost={notification.notificationCostDetails}
          canManageContacts={canManageContacts}
        />
      );
    }

    return canManageContacts && isBannerVisible && historyParser.hasViewedStatus() ? (
      <DomicileBanner source={ContactSource.DETTAGLIO_NOTIFICA} my={0} />
    ) : null;
  }, [
    canManageContacts,
    deliveryOutcome,
    historyParser,
    isNotificationCostBanner,
    isBannerVisible,
    notification.notificationCostDetails,
  ]);

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
    if (notification.pagoPaIntMode === PagoPaIntegrationMode.Sync) {
      return 'sync';
    }
    if (notification.pagoPaIntMode === PagoPaIntegrationMode.Async) {
      return 'async';
    }
    if (notification.notificationFeePolicy === NotificationFeePolicy.FlatRate) {
      return 'flat_rate';
    }
    return 'not_set';
  };

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

    PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT, {
      document,
    });

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
      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_START_PAYMENT);

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
      void dispatch(
        getReceivedNotification({
          iun: id,
          mandateId,
        })
      ).then(() => setPageReady(true));
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

  const getNotificationSource = (): EventNotificationSource =>
    fromQrCode ? 'QRcode' : 'LISTA_NOTIFICHE';

  useEffect(() => {
    if (checkIfUserHasPayments && !isCancelledOrCancelling) {
      // get current page stored in cache
      const pageFromCache = getPaymentCache(notification.iun)?.currentPaymentPage ?? 0;
      fetchPaymentsInfo(currentRecipient.payments?.slice(pageFromCache, 5 + pageFromCache) ?? []);
    }
  }, [currentRecipient.payments]);

  useEffect(() => {
    fetchReceivedNotification();
    return () => void dispatch(resetState());
  }, []);

  /* Loads relevant information about downtimes */
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

  const fromQrCode = useMemo(
    () => !!(location.state && (location.state as LocationState).fromQrCode),
    [location]
  );

  useEffect(() => {
    if (downtimesReady && pageReady && !hasNotificationReceivedApiError) {
      PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_NOTIFICATION_DETAIL, {
        downtimeEvents,
        mandateId,
        notificationStatus: notification.notificationStatus,
        checkIfUserHasPayments,
        userPayments,
        notificationStatusHistory: notification.notificationStatusHistory,
        source: getNotificationSource(),
        flow: getFlowType(),
        deliveryMode: getDeliveryMode(),
      });
    }
  }, [
    downtimesReady,
    pageReady,
    hasNotificationReceivedApiError,
    downtimeEvents,
    mandateId,
    notification,
    checkIfUserHasPayments,
    userPayments,
    fromQrCode,
    deliveryOutcome,
  ]);

  const fetchDowntimeLegalFactDocumentDetails = useCallback((legalFactId: string) => {
    if (!isCancelled.cancelled || !isCancelled.cancellationInProgress) {
      dispatch(getDowntimeLegalFact(legalFactId))
        .unwrap()
        .then(showInfoMessageIfRetryAfterOrDownload)
        .catch((e) => console.log(e));
    }
  }, []);

  const properBreadcrumb = useMemo(() => {
    const backRoute = mandateId ? routes.NOTIFICHE_DELEGATO : routes.NOTIFICHE;
    return (
      <PnBreadcrumb
        showBackAction={!fromQrCode}
        linkRoute={backRoute}
        linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
        currentLocationLabel={`${t('detail.breadcrumb-leaf', { ns: 'notifiche' })}`}
        goBackAction={() => navigate(backRoute)}
      />
    );
  }, [fromQrCode, i18n.language]);

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

  const pecUnreachableAlert = isNotificationCostBanner &&
    historyParser.hasSimpleRegisteredLetter() && (
      <MIAlert data-testid="pecUnreachableAlertText" severity="warning">
        {t('detail.pec-unreachable', { ns: 'notifiche' })}
      </MIAlert>
    );

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
    if (!id) {
      return;
    }
    return mandateId
      ? navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH(id, mandateId))
      : navigate(routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(id));
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
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }} gap={3}>
          {properBreadcrumb}
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
                  filedAt={notification.filedAt}
                  iun={notification.iun}
                  abstract={notification.abstract}
                  senderLogoUrl={SELFCARE_CDN_URL}
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
                    disableDownloads={
                      isCancelled.cancellationInTimeline ||
                      !dateIsLessThan10Years(notification.sentAt)
                    }
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
                        isCancelled={isCancelledOrCancelling}
                        iun={notification.iun}
                        onPayClick={onPayClick}
                        handleFetchPaymentsInfo={fetchPaymentsInfo}
                        getPaymentAttachmentAction={getPaymentAttachmentAction}
                        timerF24={F24_DOWNLOAD_WAIT_TIME}
                        costDetailsAssistanceLink={NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK}
                        costDetails={notification.notificationCostDetails}
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
                isDelegate={!!mandateId}
                recipient={currentRecipient}
                documents={notification.otherDocuments ?? []}
                clickHandler={documentDowloadHandler}
                isCancelled={isCancelled.cancellationInTimeline}
                isLessThan10Years={dateIsLessThan10Years(notification.sentAt)}
                downloadFilesMessage={getDownloadFilesMessage('aar')}
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
  );
};

export default NotificationDetail;
