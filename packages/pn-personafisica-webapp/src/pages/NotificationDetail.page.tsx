import _ from 'lodash';
import { Fragment, ReactNode, useCallback, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Paper, Stack, Typography, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  LegalFactId,
  NotificationDetailDocuments,
  // HelpNotificationDetails,
  NotificationDetailTableRow,
  NotificationDetailTable,
  NotificationDetailTimeline,
  TitleBox,
  useIsMobile,
  PnBreadcrumb,
  NotificationStatus,
  useErrors,
  ApiError,
  TimedMessage,
  useDownloadDocument,
  NotificationDetailOtherDocument,
  NotificationRelatedDowntimes,
  GetNotificationDowntimeEventsParams,
} from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  getDowntimeEvents,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
  getReceivedNotificationOtherDocument,
  getDowntimeLegalFactDocumentDetails,
  NOTIFICATION_ACTIONS,
} from '../redux/notification/actions';
import {
  resetLegalFactState,
  resetState,
  clearDowntimeLegalFactData,
} from '../redux/notification/reducers';
import NotificationPayment from '../component/Notifications/NotificationPayment';
import DomicileBanner from '../component/DomicileBanner/DomicileBanner';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

// state for the invocations to this component
// (to include in navigation or Link to the route/s arriving to it)
type LocationState = {
  fromQrCode?: boolean; // indicates whether the user arrived to the notification detail page from the QR code
};

const NotificationDetail = () => {
  const classes = useStyles();
  const { id, mandateId } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t } = useTranslation(['common', 'notifiche', 'appStatus']);

  const isMobile = useIsMobile();
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
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

  const currentRecipient = notification && notification.currentRecipient;

  const noticeCode = currentRecipient?.payment?.noticeCode;
  const creditorTaxId = currentRecipient?.payment?.creditorTaxId;
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
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
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

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (_.isObject(document)) {
      const otherDocument = document as NotificationDetailOtherDocument;
      void dispatch(
        getReceivedNotificationOtherDocument({ iun: notification.iun, otherDocument, mandateId })
      );
    } else {
      const documentIndex = document as string;
      void dispatch(
        getReceivedNotificationDocument({ iun: notification.iun, documentIndex, mandateId })
      );
    }
  };

  // legalFact can be either a LegalFactId, or a NotificationDetailOtherDocument 
  // (generated from details.generatedAarUrl in ANALOG_FAILURE_WORKFLOW timeline elements).
  // Cfr. comment in the definition of INotificationDetailTimeline in pn-commons/src/types/NotificationDetail.ts.
  const legalFactDownloadHandler = (legalFact: LegalFactId | NotificationDetailOtherDocument) => {
    if ((legalFact as LegalFactId).key) {
      dispatch(resetLegalFactState());
      void dispatch(
        getReceivedNotificationLegalfact({ iun: notification.iun, legalFact: legalFact as LegalFactId, mandateId })
      );
    } else if ((legalFact as NotificationDetailOtherDocument).documentId) {
      const otherDocument = legalFact as NotificationDetailOtherDocument;
      void dispatch(
        getReceivedNotificationOtherDocument({ iun: notification.iun, otherDocument, mandateId })
      );
    }
  };

  const isCancelled = notification.notificationStatus === NotificationStatus.CANCELLED;

  const hasDocumentsAvailable = isCancelled || !notification.documentsAvailable ? false : true;

  const hasNotificationReceivedApiError = hasApiErrors(
    NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION
  );

  const getDownloadFilesMessage = useCallback((): string => {
    if (isCancelled) {
      return t('detail.acts_files.notification_cancelled', { ns: 'notifiche' });
    } else if (hasDocumentsAvailable) {
      return t('detail.acts_files.downloadable_acts', { ns: 'notifiche' });
    } else {
      return t('detail.acts_files.not_downloadable_acts', { ns: 'notifiche' });
    }
  }, [isCancelled, hasDocumentsAvailable]);

  const fetchReceivedNotification = useCallback(() => {
    if (id) {
      void dispatch(
        getReceivedNotification({
          iun: id,
          currentUserTaxId: currentUser.fiscal_number,
          delegatorsFromStore,
          mandateId,
        })
      ).then(() => setPageReady(true));
    }
  }, []);

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

  const fetchDowntimeLegalFactDocumentDetails = useCallback(
    (legalFactId: string) => void dispatch(getDowntimeLegalFactDocumentDetails(legalFactId)),
    []
  );

  useDownloadDocument({ url: documentDownloadUrl });
  useDownloadDocument({ url: legalFactDownloadUrl });
  useDownloadDocument({ url: otherDocumentDownloadUrl });

  const timeoutMessage = legalFactDownloadRetryAfter * 1000;

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
        linkLabel={
          <Fragment>
            <EmailIcon sx={{ mr: 0.5 }} />
            {t('detail.breadcrumb-root', { ns: 'notifiche' })}
          </Fragment>
        }
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

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      {hasNotificationReceivedApiError && (
        <Box className={classes.root} sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError onClick={fetchReceivedNotification} mt={3} />
        </Box>
      )}
      {!hasNotificationReceivedApiError && (
        <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumb}
          <Grid
            container
            direction={isMobile ? 'column-reverse' : 'row'}
            spacing={isMobile ? 3 : 0}
          >
            <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumb}
              <Stack spacing={3}>
                <NotificationDetailTable rows={detailTableRows} />
                {!isCancelled && currentRecipient?.payment && creditorTaxId && noticeCode && (
                  <NotificationPayment
                    iun={notification.iun}
                    paymentHistory={notification.paymentHistory}
                    senderDenomination={notification.senderDenomination}
                    subject={notification.subject}
                    notificationPayment={currentRecipient.payment}
                    mandateId={mandateId}
                  />
                )}
                <DomicileBanner />
                <Paper sx={{ p: 3 }} className="paperContainer">
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={isCancelled ? [] : notification.documents}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={hasDocumentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage()}
                    downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                  />
                </Paper>
                <Paper sx={{ p: 3, mb: 3 }} className="paperContainer">
                  <NotificationDetailDocuments
                    title={t('detail.other-acts', { ns: 'notifiche' })}
                    documents={notification.otherDocuments ?? []}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={hasDocumentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage()}
                    downloadFilesLink={t('detail.acts_files.effected_faq', { ns: 'notifiche' })}
                  />
                </Paper>
                <NotificationRelatedDowntimes
                  downtimeEvents={downtimeEvents}
                  fetchDowntimeEvents={fetchDowntimeEvents}
                  notificationStatusHistory={notification.notificationStatusHistory}
                  downtimeLegalFactUrl={downtimeLegalFactUrl}
                  fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                  clearDowntimeLegalFactData={() => dispatch(clearDowntimeLegalFactData())}
                  apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_EVENTS}
                />
                {/* TODO decommentare con pn-841
            <Paper sx={{ p: 3 }} className="paperContainer">
              <HelpNotificationDetails 
                title="Hai bisogno di aiuto?"
                subtitle="Se hai domande relative al contenuto della notifica, contatta il"
                courtName="Tribunale di Milano"
                phoneNumber="848.800.444"
                mail="nome.cognome@email.it"
                website="https://www.tribunale.milano.it/"
              />              
            </Paper>
                */}
              </Stack>
            </Grid>
            <Grid item lg={5} xs={12}>
              <Box component="section" sx={{ backgroundColor: 'white', height: '100%', p: 3 }}>
                <TimedMessage
                  timeout={timeoutMessage}
                  message={
                    <Alert severity={'warning'} sx={{ mb: 3 }}>
                      {t('detail.document-not-available', { ns: 'notifiche' })}
                    </Alert>
                  }
                />
                <NotificationDetailTimeline
                  recipients={notification.recipients}
                  statusHistory={notification.notificationStatusHistory}
                  title={t('detail.timeline-title', { ns: 'notifiche' })}
                  clickHandler={legalFactDownloadHandler}
                  historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  eventTrackingCallbackShowMore={() =>
                    trackEventByType(TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE)
                  }
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
