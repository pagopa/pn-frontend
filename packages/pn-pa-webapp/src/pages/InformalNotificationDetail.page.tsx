import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import {
  AbstractPaper,
  ApiError,
  InformalNotificationStatus,
  LoadingPage,
  NotificationDetailDocuments,
  NotificationStatusBox,
  appStateActions,
  downloadDocument,
  useErrors,
} from '@pagopa-pn/pn-commons';
import { getInformalNotificationStatusInfos } from '@pagopa-pn/pn-commons/src/utility/notification.utility';
import { MIBreadcrumbItem, MIBreadcrumbs, MIPaper } from '@pagopa/mui-italia';

import InformalNotificationChannelStatusBox from '../components/Notifications/InformalNotificationChannelStatus/InformalNotificationChannelStatusBox';
import InformalNotificationPaymentSender from '../components/Notifications/InformalNotificationPaymentSender';
import NotificationDetailsDrawer, {
  NotificationDetailsDrawerItem,
} from '../components/Notifications/NotificationDetailsDrawer';
import NotificationRecipientsDetail from '../components/Notifications/NotificationRecipientsDetail';
import { BffDocumentDownloadMetadataResponse } from '../generated-client/informal-notifications';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getSentInformalNotification,
  getSentInformalNotificationDocument,
} from '../redux/notification/actions';
import { RootState } from '../redux/store';

const InformalNotificationDetail: React.FC = () => {
  const { campaignId, id } = useParams();
  const { t } = useTranslation(['campaigns', 'common']);
  const dispatch = useAppDispatch();
  const { hasApiErrors } = useErrors();
  const navigate = useNavigate();
  const informalNotification = useAppSelector(
    (state: RootState) => state.notificationState.informalNotification
  );

  const [pageReady, setPageReady] = useState(false);
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);

  const hasNotificationSentApiError = hasApiErrors(
    NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION
  );

  const fetchSentInformalNotification = useCallback(() => {
    if (!id) {
      return;
    }

    setPageReady(false);

    void dispatch(getSentInformalNotification(id))
      .unwrap()
      .catch(() => {})
      .finally(() => setPageReady(true));
  }, [dispatch, id]);

  useEffect(() => {
    fetchSentInformalNotification();
  }, [fetchSentInformalNotification]);

  const goToCampaignDetail = () => {
    if (campaignId) {
      navigate(routes.GET_CAMPAIGN_DETAIL_PATH(campaignId));
    }
  };

  const goToCommunicationTimeline = () => {
    if (campaignId && id) {
      navigate(routes.GET_DETTAGLIO_COMBO_TIMELINE_PATH(campaignId, id));
    }
  };

  const properBreadcrumb = (
    <MIBreadcrumbs
      backButtonLabel={t('button.indietro', { ns: 'common' })}
      backButtonAction={goToCampaignDetail}
    >
      <MIBreadcrumbItem
        label={t('detail.breadcrumb-root')}
        onClick={() => navigate(routes.CAMPAIGNS)}
        data-testid="breadcrumb-root-button"
      />
      <MIBreadcrumbItem label={campaignId ?? ''} onClick={goToCampaignDetail} />
      <MIBreadcrumbItem label={informalNotification.iun} current />
    </MIBreadcrumbs>
  );

  const handleOpenDetailsDrawer = () => {
    setOpenDetailsDrawer(true);
  };

  const handleCloseDetailsDrawer = () => {
    setOpenDetailsDrawer(false);
  };

  const recipients = informalNotification.recipients;

  const notificationStatusInfos = getInformalNotificationStatusInfos(
    informalNotification.notificationStatus as InformalNotificationStatus
  );

  const showInfoMessageIfRetryAfterOrDownload = (response: BffDocumentDownloadMetadataResponse) => {
    if (response.retryAfter) {
      dispatch(
        appStateActions.addInfo({
          title: '',
          message: t('informal.detail.documents.document-not-available'),
        })
      );
    } else if (response.url) {
      downloadDocument(response.url);
    }
  };

  const documentDownloadHandler = (document: string | undefined) => {
    if (!document) {
      return;
    }

    void dispatch(
      getSentInformalNotificationDocument({
        iun: informalNotification.iun,
        docIdx: Number(document),
      })
    )
      .unwrap()
      .then(showInfoMessageIfRetryAfterOrDownload)
      .catch(() => {});
  };

  const documentsDownloadFilesMessage = {
    key: informalNotification.documentsAvailable
      ? 'informal.detail.documents.download-message-available'
      : 'informal.detail.documents.download-message-expired',
    ns: 'campaigns',
    components: [<strong key="0" />],
  };

  const notificationSummaryDetails = [
    {
      label: t('informal.detail.sender'),
      value: informalNotification.senderDenomination,
    },
    {
      label: t(`informal.detail.${recipients.length > 1 ? 'recipients' : 'recipient'}`),
      value: <NotificationRecipientsDetail recipients={recipients} />,
    },
    {
      label: t('informal.detail.subject'),
      value: informalNotification.subject,
    },
  ].filter((detail) => detail.value);

  const notificationDrawerDetails: Array<NotificationDetailsDrawerItem> = [
    {
      label: t('informal.detail.iun'),
      value: informalNotification.iun,
    },
    {
      label: t('informal.detail.sender'),
      value: informalNotification.senderDenomination,
    },
    {
      label:
        recipients.length > 1 ? t('informal.detail.recipients') : t('informal.detail.recipient'),
      value: <NotificationRecipientsDetail recipients={recipients} showAll />,
    },
    {
      label: t('informal.detail.subject'),
      value: informalNotification.subject,
    },
    {
      label: t('informal.detail.text'),
      value: recipients[0]?.message.primaryMessage.longBody,
    },
  ].filter((detail) => detail.value);

  return (
    <>
      {hasNotificationSentApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError
            onClick={() => fetchSentInformalNotification()}
            mt={3}
            apiId={NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION}
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
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
            <Stack sx={{ width: { xs: '100%', md: 'calc(58% - 8px)' } }} gap={2}>
              <AbstractPaper
                isSender
                isLegal={false}
                title={informalNotification.iun}
                senderDenomination={informalNotification.senderDenomination}
                iun={informalNotification.iun}
                details={notificationSummaryDetails}
                onDetailsClick={handleOpenDetailsDrawer}
                detailsAriaLabel={t('informal.detail.aria-label')}
              />
              {/**
               * - null/undefined = no documents were attached since ComBo creation → we should hide the following box
               * - false = documents existed but are no longer available → we should show the box and the contained Alert
               *  */}
              {informalNotification.documentsAvailable != null && (
                <MIPaper padding={24}>
                  <NotificationDetailDocuments
                    title={t('informal.detail.documents.title')}
                    documents={informalNotification.documents}
                    documentsAvailable={informalNotification.documentsAvailable}
                    downloadFilesMessage={documentsDownloadFilesMessage}
                    clickHandler={(document) => {
                      documentDownloadHandler(typeof document === 'string' ? document : undefined);
                    }}
                    titleVariant="h5"
                    inlineDownloadFilesMessage
                  />
                </MIPaper>
              )}

              {recipients[0]?.payments?.[0] && (
                <InformalNotificationPaymentSender
                  iun={informalNotification.iun}
                  payment={recipients[0].payments[0]}
                  recipientIdx={0}
                />
              )}
            </Stack>

            <Stack component="aside" sx={{ width: { xs: '100%', md: 'calc(42% - 8px)' } }} gap={2}>
              <NotificationStatusBox
                ariaLabel={t('informal.detail.status.aria-label')}
                color={notificationStatusInfos.color}
                description={notificationStatusInfos.description}
                detailsLabel={t('informal.detail.status.go-to-detail')}
                label={notificationStatusInfos.label}
                title={t('informal.detail.status.title')}
                onDetailsClick={goToCommunicationTimeline}
              />

              <InformalNotificationChannelStatusBox
                channelsStatus={informalNotification.channelsStatus}
              />
            </Stack>
          </Stack>
        </Box>
      )}
      <NotificationDetailsDrawer
        open={openDetailsDrawer}
        title={t('informal.detail.title')}
        details={notificationDrawerDetails}
        onClose={handleCloseDetailsDrawer}
      />
    </>
  );
};

export default InformalNotificationDetail;
