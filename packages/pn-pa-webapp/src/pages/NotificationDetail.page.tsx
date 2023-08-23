import _ from 'lodash';
import React, { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  ApiError,
  GetNotificationDowntimeEventsParams, // PN-1714
  // NotificationStatus,
  LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationDetailTable,
  NotificationDetailTableRow,
  NotificationDetailTimeline,
  NotificationPaidDetail,
  NotificationRelatedDowntimes,
  NotificationStatus,
  NotificationStatusHistory,
  PnBreadcrumb,
  TimedMessage,
  TitleBox,
  dataRegex,
  formatEurocentToCurrency,
  useDownloadDocument,
  useErrors,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  cancelNotification,
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../redux/notification/actions';
import {
  clearDowntimeLegalFactData,
  resetLegalFactState,
  resetState,
} from '../redux/notification/reducers';
import { RootState } from '../redux/store';
import { TrackEventType } from '../utils/events';
import { trackEventByType } from '../utils/mixpanel';
import ConfirmCancellationDialog from './components/Notifications/ConfirmCancellationDialog';

const AlertNotificationCancel: React.FC<{ notificationStatus: NotificationStatus }> = (
  notification
) => {
  const { t } = useTranslation(['notifiche']);

  if (
    notification.notificationStatus === NotificationStatus.CANCELLATION_IN_PROGRESS ||
    notification.notificationStatus === NotificationStatus.CANCELLED
  ) {
    return (
      <Alert tabIndex={0} data-testid="alert" sx={{ mt: 1 }} severity={'warning'}>
        <Typography component="span" variant="body1">
          {notification.notificationStatus === NotificationStatus.CANCELLATION_IN_PROGRESS
            ? t('detail.alert-cancellation-in-progress')
            : t('detail.alert-cancellation-confirmed')}
        </Typography>
      </Alert>
    );
  }

  return <></>;
};

type Props = {
  openModal: () => void;
};

const RenderNotificationDetailTable = ({ openModal }: Props) => {
  const { t } = useTranslation();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);

  const { recipients } = notification;
  const recipientsWithNoticeCode = recipients.filter((recipient) => recipient.payment?.noticeCode);
  const recipientsWithAltNoticeCode = recipients.filter(
    (recipient) => recipient.payment?.noticeCodeAlternative
  );
  const getRecipientsNoticeCodeField = (
    filteredRecipients: Array<NotificationDetailRecipient>,
    alt: boolean = false
  ): ReactNode => {
    if (filteredRecipients.length > 1) {
      return filteredRecipients.map((recipient) => (
        <Box key={recipient.taxId} fontWeight={600}>
          {recipient.taxId} - {recipient?.payment?.creditorTaxId} -{' '}
          {alt ? recipient.payment?.noticeCodeAlternative : recipient.payment?.noticeCode}
        </Box>
      ));
    }

    return (
      <Box fontWeight={600}>
        {filteredRecipients[0]?.payment?.creditorTaxId} -{' '}
        {alt
          ? filteredRecipients[0]?.payment?.noticeCodeAlternative
          : filteredRecipients[0]?.payment?.noticeCode}
      </Box>
    );
  };

  const getTaxIdLabel = (taxId: string): string =>
    dataRegex.pIva.test(taxId)
      ? 'detail.tax-id-organization-recipient'
      : 'detail.tax-id-citizen-recipient';

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
      rawValue: recipients.length > 1 ? '' : recipients[0]?.denomination,
      value: <Box fontWeight={600}>{recipients[0]?.denomination}</Box>,
    },
    {
      label:
        recipients.length > 1
          ? t('detail.recipients', { ns: 'notifiche' })
          : t(getTaxIdLabel(recipients[0]?.taxId), { ns: 'notifiche' }),
      rawValue: recipients.map((recipient) => recipient.denomination).join(', '),
      value: (
        <>
          {recipients.map((recipient) => (
            <Box key={recipient.taxId} fontWeight={600}>
              {recipients.length > 1
                ? `${recipient.taxId} - ${recipient.denomination}`
                : recipient.taxId}
            </Box>
          ))}
        </>
      ),
    },
    {
      label: t('detail.date', { ns: 'notifiche' }),
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
    },
    {
      label: t('detail.payment-terms', { ns: 'notifiche' }),
      rawValue: notification.paymentExpirationDate,
      value: (
        <Box fontWeight={600} display="inline">
          {notification.paymentExpirationDate}
        </Box>
      ),
    },
    {
      label: t('detail.amount', { ns: 'notifiche' }),
      rawValue: notification.amount
        ? formatEurocentToCurrency(notification.amount).toString()
        : undefined,
      value: (
        <Box fontWeight={600}>
          {notification.amount && formatEurocentToCurrency(notification.amount)}
        </Box>
      ),
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
    {
      label: t('detail.notice-code', { ns: 'notifiche' }),
      rawValue: recipientsWithNoticeCode.join(', '),
      value: getRecipientsNoticeCodeField(recipientsWithNoticeCode),
    },
    {
      label: t('detail.secondary-notice-code', { ns: 'notifiche' }),
      rawValue: recipientsWithAltNoticeCode.join(', '),
      value: getRecipientsNoticeCodeField(recipientsWithAltNoticeCode, true),
    },
    {
      label: t('detail.groups', { ns: 'notifiche' }),
      rawValue: notification.group,
      value: notification.group && (
        <TagGroup visibleItems={4}>
          <Tag value={notification.group} />
        </TagGroup>
      ),
    },
  ];

  const detailTableRows: Array<NotificationDetailTableRow> = unfilteredDetailTableRows
    .filter((row) => row.rawValue)
    .map((row, index) => ({
      id: index + 1,
      label: row.label,
      value: row.value,
    }));

  return (
    <NotificationDetailTable rows={detailTableRows}>
      {notification.notificationStatus !== NotificationStatus.CANCELLATION_IN_PROGRESS &&
        notification.notificationStatus !== NotificationStatus.CANCELLED && (
          <Button
            variant="outlined"
            sx={{
              my: {
                xs: 3,
                md: 2,
              },
              borderColor: 'error.dark',
              outlineColor: 'error.dark',
              color: 'error.dark',
            }}
            onClick={openModal}
            data-testid="cancelNotificationBtn"
          >
            {t('detail.cancel-notification', { ns: 'notifiche' })}
          </Button>
        )}
    </NotificationDetailTable>
  );
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
  const downtimeLegalFactUrl = useAppSelector(
    (state: RootState) => state.notificationState.downtimeLegalFactUrl
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
  const legalFactDownloadRetryAfter = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadRetryAfter
  );
  const { recipients } = notification;

  /*
   * appStatus is included since it is used inside NotificationRelatedDowntimes, a component
   * in pn-commons (hence cannot access the i18n files) used in this page
   * ---------------------------------
   * Carlos Lombardi, 2023.02.03
   */
  const { t } = useTranslation(['common', 'notifiche', 'appStatus']);

  const hasNotificationSentApiError = hasApiErrors(NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION);

  const documentDowloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    if (_.isObject(document)) {
      void dispatch(
        getSentNotificationOtherDocument({ iun: notification.iun, otherDocument: document })
      );
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
      );
    } else if ((legalFact as NotificationDetailOtherDocument).documentId) {
      const otherDocument = legalFact as NotificationDetailOtherDocument;
      void dispatch(getSentNotificationOtherDocument({ iun: notification.iun, otherDocument }));
    }
  };

  const handleCancelNotification = () => {
    void dispatch(cancelNotification(notification.iun));
  };

  const withPayment =
    notification.notificationStatusHistory.findIndex(
      (el: NotificationStatusHistory) => el.status === NotificationStatus.PAID
    ) > -1;
  const hasDocumentsAvailable = !notification.documentsAvailable;

  const getDownloadFilesMessage = useCallback(
    (type: 'aar' | 'attachments'): string => {
      if (hasDocumentsAvailable) {
        return type === 'aar'
          ? t('detail.download-aar-available', { ns: 'notifiche' })
          : t('detail.download-message-available', { ns: 'notifiche' });
      }
      return type === 'aar'
        ? t('detail.download-aar-expired', { ns: 'notifiche' })
        : t('detail.download-message-expired', { ns: 'notifiche' });
    },
    [hasDocumentsAvailable]
  );

  const openModal = () => {
    trackEventByType(TrackEventType.NOTIFICATION_DETAIL_CANCEL_NOTIFICATION);
    setShowModal(true);
  };

  const fetchSentNotification = useCallback(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
  }, [id]);

  useEffect(() => {
    fetchSentNotification();
    return () => void dispatch(resetState());
  }, [fetchSentNotification]);

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

  const viewMoreTimeline = () => trackEventByType(TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE);

  useDownloadDocument({ url: legalFactDownloadUrl });
  useDownloadDocument({ url: documentDownloadUrl });
  useDownloadDocument({ url: otherDocumentDownloadUrl });

  const timeoutMessage = legalFactDownloadRetryAfter * 1000;

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

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalCloseAndProceed = () => {
    setShowModal(false);
    handleCancelNotification();
  };

  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;

  return (
    <>
      {hasNotificationSentApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError onClick={() => fetchSentNotification()} mt={3} />
        </Box>
      )}
      {!hasNotificationSentApiError && (
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumb}
          <Grid container direction={direction} spacing={spacing}>
            <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumb}
              <Stack spacing={3}>
                <AlertNotificationCancel notificationStatus={notification.notificationStatus} />
                <RenderNotificationDetailTable openModal={openModal} />
                {notification.paymentHistory && notification.paymentHistory.length > 0 && (
                  <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
                    <Typography variant="h5">{t('payment.title', { ns: 'notifiche' })}</Typography>
                    {notification.paymentHistory.length === 1 && (
                      <Typography>{t('payment.subtitle-single', { ns: 'notifiche' })}</Typography>
                    )}
                    {notification.paymentHistory.length > 1 && (
                      <Typography>{t('payment.subtitle-multiple', { ns: 'notifiche' })}</Typography>
                    )}
                    <NotificationPaidDetail
                      paymentDetailsList={notification.paymentHistory}
                      isSender
                    />
                  </Paper>
                )}
                <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={notification.documents}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={hasDocumentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage('attachments')}
                    downloadFilesLink={t('detail.download-files-link', { ns: 'notifiche' })}
                  />
                </Paper>
                <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
                  <NotificationDetailDocuments
                    title={t('detail.aar-acts', { ns: 'notifiche' })}
                    documents={notification.otherDocuments}
                    clickHandler={documentDowloadHandler}
                    documentsAvailable={hasDocumentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage('aar')}
                    downloadFilesLink={t('detail.download-files-link', { ns: 'notifiche' })}
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
              </Stack>
            </Grid>
            <Grid item lg={5} xs={12}>
              <Box sx={{ backgroundColor: 'white', height: '100%', p: 3, pb: { xs: 0, lg: 3 } }}>
                <TimedMessage
                  timeout={timeoutMessage}
                  message={
                    <Alert severity={'warning'} sx={{ mb: 3 }}>
                      {t('detail.document-not-available', { ns: 'notifiche' })}
                    </Alert>
                  }
                />
                <NotificationDetailTimeline
                  recipients={recipients}
                  statusHistory={notification.notificationStatusHistory}
                  title={t('detail.timeline-title', { ns: 'notifiche' })}
                  clickHandler={legalFactDownloadHandler}
                  historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                  showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                  showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                  eventTrackingCallbackShowMore={viewMoreTimeline}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <ConfirmCancellationDialog
        onClose={handleModalClose}
        onConfirm={handleModalCloseAndProceed}
        payment={withPayment}
        showModal={showModal}
      />
    </>
  );
};

export default NotificationDetail;
