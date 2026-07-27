import { isObject } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import {
  AbstractPaper,
  ApiError,
  AppResponse,
  AppResponsePublisher,
  GetDowntimeHistoryParams,
  LoadingPage,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailSection,
  NotificationDetail as NotificationDetailType,
  NotificationDocumentResponse,
  NotificationDocumentType,
  NotificationRelatedDowntimes,
  NotificationTimelineBox,
  PnBreadcrumb,
  appStateActions,
  dateIsLessThan10Years,
  downloadDocument,
  useErrors,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import type { DocumentsDownloadFilesMessage } from '@pagopa-pn/pn-commons/src/components/NotificationDetail/NotificationDetailDocuments';
import { MIAlert, MIPaper, Tag } from '@pagopa/mui-italia';

import NotificationCancellationAction from '../components/Notifications/NotificationCancellationAction';
import NotificationDetailsDrawer, {
  NotificationDetailsDrawerItem,
} from '../components/Notifications/NotificationDetailsDrawer';
import NotificationPaymentSender from '../components/Notifications/NotificationPaymentSender';
import { PAEventsType } from '../models/PAEventsType';
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
import PAEventStrategyFactory from '../utility/MixpanelUtils/PAEventStrategyFactory';

type Props = {
  notification: NotificationDetailType;
};

const AlertNotificationCancel: React.FC<Props> = (notification) => {
  const { t } = useTranslation(['notifiche']);
  const { cancelled, cancellationInProgress } = useIsCancelled(notification);

  if (cancelled || cancellationInProgress) {
    return (
      <MIAlert severity="warning" sx={{ mt: 1 }} data-testid="alert">
        {cancellationInProgress
          ? t('detail.alert-cancellation-in-progress')
          : t('detail.alert-cancellation-confirmed')}
      </MIAlert>
    );
  }

  return <></>;
};

const NotificationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasApiErrors } = useErrors();
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
  const { t } = useTranslation(['common', 'notifiche', 'appStatus']);
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);
  const [pageReady, setPageReady] = useState(false);

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

  const documentDownloadHandler = (
    document: string | NotificationDetailOtherDocument | undefined
  ) => {
    PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT, {
      document,
    });

    if (isObject(document)) {
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
    (type: 'aar' | 'attachments'): DocumentsDownloadFilesMessage => {
      if (type === 'attachments') {
        return {
          key: notification.documentsAvailable
            ? 'detail.download-message-available'
            : 'detail.download-message-expired',
          ns: 'notifiche',
          components: [<strong key="0" />],
        };
      } else {
        return {
          key: dateIsLessThan10Years(notification.sentAt) // 10 years
            ? 'detail.download-aar-available'
            : 'detail.download-aar-expired',
          ns: 'notifiche',
        };
      }
    },
    [notification.documentsAvailable]
  );

  const fetchSentNotification = useCallback(() => {
    if (id) {
      setPageReady(false);
      void dispatch(getSentNotification(id))
        .unwrap()
        .catch(() => {})
        .finally(() => setPageReady(true));
    }
  }, [id]);

  useEffect(() => {
    fetchSentNotification();
    return () => void dispatch(resetState());
  }, [fetchSentNotification]);

  useEffect(() => {
    if (!hasNotificationSentApiError && notification.iun) {
      PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_NOTIFICATION_DETAIL);
    }
  }, [hasNotificationSentApiError, notification.iun]);

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
      currentLocationLabel={notification.iun}
      goBackLabel={t('button.indietro', { ns: 'common' })}
    />
  );

  const handleGoToTimeline = () => {
    if (!id) {
      return;
    }
    navigate(routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(id), {
      state: { fromNotificationDetail: true },
    });
  };

  const handleOpenDetailsDrawer = () => {
    setOpenDetailsDrawer(true);
  };

  const handleCloseDetailsDrawer = () => {
    setOpenDetailsDrawer(false);
  };

  const notificationSummaryDetails = [
    {
      label: t('detail.protocol-number', { ns: 'notifiche' }),
      value: notification.paProtocolNumber,
    },
    {
      label: t('detail.subject', { ns: 'notifiche' }),
      value: notification.subject,
    },
    {
      label: t('detail.sender', { ns: 'notifiche' }),
      value: notification.senderDenomination,
    },
    {
      label:
        recipients.length > 1
          ? t('detail.recipients', { ns: 'notifiche' })
          : t('detail.recipient', { ns: 'notifiche' }),
      value: recipients
        .map((recipient) => `${recipient.denomination} - ${recipient.taxId}`)
        .join(', '),
    },
  ].filter((detail) => detail.value);

  const notificationDrawerDetails: Array<NotificationDetailsDrawerItem> = [
    {
      label: t('detail.iun', { ns: 'notifiche' }),
      value: notification.iun,
    },
    {
      label: t('detail.protocol-number', { ns: 'notifiche' }),
      value: notification.paProtocolNumber,
    },
    {
      label: t('detail.subject', { ns: 'notifiche' }),
      value: notification.subject,
    },
    {
      label: t('detail.sender', { ns: 'notifiche' }),
      value: notification.senderDenomination,
    },
    {
      label:
        recipients.length > 1
          ? t('detail.recipient-list-multi', { ns: 'notifiche' })
          : t('detail.recipient-list-mono', { ns: 'notifiche' }),
      value: (
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {recipients.map((recipient) => (
            <Box component="li" key={recipient.taxId}>
              {recipient.denomination} - {recipient.taxId}
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: t('detail.notification-text', { ns: 'notifiche' }),
      value: notification.abstract,
    },
    {
      label: t('detail.groups', { ns: 'notifiche' }),
      value: notification.group?.trim() ? (
        <Box mt={0.5}>
          <Tag value={notification.group} />
        </Box>
      ) : undefined,
    },
  ].filter((detail) => detail.value);

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
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'start',
            }}
            gap={2}
          >
            <Stack
              sx={{
                display: { xs: 'flex', md: 'contents', xxl: 'flex' },
                flexDirection: 'column',
                width: { xs: '100%', xxl: 'calc(58% - 8px)' },
              }}
              gap={2}
            >
              <Stack sx={{ width: { xs: '100%', md: '100%' } }} gap={2}>
                <AlertNotificationCancel notification={notification} />
                <AbstractPaper
                  title={notification.iun}
                  senderDenomination={notification.senderDenomination}
                  filedAt={notification.sentAt}
                  iun={notification.iun}
                  details={notificationSummaryDetails}
                  onDetailsClick={handleOpenDetailsDrawer}
                  detailsAriaLabel={t('detail.notification-details-aria-label', {
                    ns: 'notifiche',
                  })}
                />
              </Stack>

              <Stack
                sx={{
                  width: { xs: '100%', md: 'calc(58% - 8px)', xxl: '100%' },
                }}
                gap={2}
              >
                {checkIfNotificationHasPayments && (
                  <NotificationPaymentSender
                    iun={notification.iun}
                    recipients={recipients}
                    timeline={notification.timeline}
                  />
                )}
                <MIPaper padding={24}>
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={notification.documents}
                    clickHandler={documentDownloadHandler}
                    documentsAvailable={notification.documentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage('attachments')}
                    downloadFilesLink={t('detail.download-files-link', { ns: 'notifiche' })}
                    titleVariant="h5"
                    inlineDownloadFilesMessage
                  />
                  {notification.radd && (
                    <MIAlert
                      severity="success"
                      data-testid="raddAlert"
                      sx={{ mt: 2 }}
                      title={t('detail.timeline.radd.title', { ns: 'notifiche' })}
                    >
                      {notification.recipients.length === 1
                        ? t('detail.timeline.radd.description-mono-recipient', {
                            ns: 'notifiche',
                          })
                        : t('detail.timeline.radd.description-multi-recipients', {
                            ns: 'notifiche',
                          })}
                    </MIAlert>
                  )}
                </MIPaper>
                <NotificationCancellationAction
                  notification={notification}
                  onCancelNotification={handleCancelNotification}
                />
              </Stack>
            </Stack>

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
                isDelegate={false}
                recipient={recipients[0]}
                documents={notification.otherDocuments ?? []}
                clickHandler={documentDownloadHandler}
                isCancelled={false}
                isLessThan10Years={dateIsLessThan10Years(notification.sentAt)}
                downloadFilesMessage={getDownloadFilesMessage('aar')}
              />

              <NotificationRelatedDowntimes
                downtimeEvents={downtimeEvents}
                fetchDowntimeEvents={fetchDowntimeEvents}
                notificationStatusHistory={notification.notificationStatusHistory}
                fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
                apiId={NOTIFICATION_ACTIONS.GET_DOWNTIME_HISTORY}
                downtimeExampleLink={DOWNTIME_EXAMPLE_LINK}
              />
            </Stack>
          </Box>
        </Box>
      )}
      <NotificationDetailsDrawer
        open={openDetailsDrawer}
        title={t('detail.notification-detail-section.title', { ns: 'notifiche' })}
        details={notificationDrawerDetails}
        onClose={handleCloseDetailsDrawer}
      />
    </>
  );
};

export default NotificationDetail;
