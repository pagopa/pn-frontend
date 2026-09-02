import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import {
  AbstractPaper,
  ApiError,
  InformalNotificationStatus,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationDocumentType,
  NotificationPaymentRecipient,
  PaymentAttachmentSName,
  PaymentsData,
  PnSenderContacts,
  appStateActions,
  downloadDocument,
  useErrors,
} from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs, MIPaper } from '@pagopa/mui-italia';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import type { BffFullInformalNotificationV1 } from '../generated-client/informal-notifications';
import { PGEventsType } from '../models/PGEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getReceivedNotificationPaymentUrl } from '../redux/notification/actions';
import {
  INFORMAL_NOTIFICATION_ACTIONS,
  getReceivedInformalNotification,
  getReceivedInformalNotificationDocument,
  getReceivedInformalNotificationPayment,
  getReceivedInformalNotificationPaymentInfo,
} from '../redux/notification/informalActions';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PGEventStrategyFactory from '../utility/MixpanelUtils/PGEventStrategyFactory';

const InformalNotificationDetail: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const dispatch = useAppDispatch();
  const [pageReady, setPageReady] = useState(false);
  const { hasApiErrors } = useErrors();
  const { SELFCARE_CDN_URL } = getConfiguration();

  const [informalNotification, setInformalNotification] =
    React.useState<BffFullInformalNotificationV1>();
  const currentOrganizationName = useAppSelector((state: RootState) => state.userState.user)
    .organization.name;

  const [paymentsData, setPaymentsData] = React.useState<PaymentsData>({
    pagoPaF24: [],
    f24Only: [],
  });

  const documentsAvailable = informalNotification?.documentsAvailable ?? false;

  const getDownloadFilesMessage = (): { key: string; ns: string } => ({
    key: documentsAvailable
      ? 'detail.acts_files.informal_downloadable_acts'
      : 'detail.acts_files.not_downloadable_acts',
    ns: 'notifiche',
  });

  const fetchReceivedInformalNotification = useCallback(() => {
    if (!id) {
      return;
    }
    void dispatch(getReceivedInformalNotification(id))
      .unwrap()
      .then(setInformalNotification)
      .catch(() => {})
      .finally(() => setPageReady(true));
  }, [id, dispatch]);

  useEffect(() => {
    fetchReceivedInformalNotification();
  }, []);

  const currentRecipient = informalNotification?.recipients?.[0];

  const paymentCount = currentRecipient?.payments?.length ?? 0;
  const hasPayments = paymentCount > 0;

  const hasInformalReceivedApiError = hasApiErrors(
    INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION
  );

  const phone = informalNotification?.senderContacts?.phone;
  const site = informalNotification?.senderContacts?.site;

  const fetchPaymentsInfo = (payments: Array<NotificationDetailPayment>) => {
    const paymentInfoRequest = payments.reduce((acc, payment) => {
      if (payment.pagoPa && Object.keys(payment.pagoPa).length > 0) {
        return [
          ...acc,
          {
            noticeCode: payment.pagoPa.noticeCode,
            creditorTaxId: payment.pagoPa.creditorTaxId,
          },
        ];
      }
      return acc;
    }, [] as Array<{ noticeCode: string; creditorTaxId: string }>);

    if (paymentInfoRequest.length === 0) {
      return;
    }

    void dispatch(getReceivedInformalNotificationPaymentInfo({ paymentInfoRequest }))
      .unwrap()
      .then((paymentInfo) => {
        setPaymentsData({
          pagoPaF24: paymentInfo.map((info, index) => ({
            pagoPa: {
              ...payments[index]?.pagoPa,
              ...info,
              // applyCost is false because informal notifications do not have notification costs.
              applyCost: false,
            },
          })),
          f24Only: [],
        });
      })
      .catch(() => {});
  };

  const reloadPaymentsInfo = (data: Array<NotificationDetailPayment>) => {
    fetchPaymentsInfo(data);
  };

  useEffect(() => {
    const payments = currentRecipient?.payments?.map((payment) => ({
      ...payment,
      pagoPa: {
        ...payment.pagoPa,
        // applyCost is false because informal notifications do not have notification costs.
        applyCost: false,
      },
    }));

    if (!payments?.length) {
      return;
    }

    fetchPaymentsInfo(payments as Array<NotificationDetailPayment>);
  }, [currentRecipient?.payments]);

  const primaryMessage = currentRecipient
    ? (currentRecipient as any).message?.primaryMessage
    : undefined;

  const properBreadcrumb = useMemo(
    () => (
      <MIBreadcrumbs>
        <MIBreadcrumbItem
          label={
            currentRecipient?.denomination
              ? t('menu.notifiche-impresa', {
                  organization: currentOrganizationName ?? '',
                })
              : t('menu.notifiche')
          }
          href={routes.NOTIFICHE}
        />
        <MIBreadcrumbItem
          label={primaryMessage?.subject ?? t('menu.fallback-communication')}
          current
        />
      </MIBreadcrumbs>
    ),
    [
      i18n.language,
      primaryMessage?.subject,
      currentRecipient?.denomination,
      currentOrganizationName,
    ]
  );

  const onPayClick = (noticeCode?: string, creditorTaxId?: string, amount?: number) => {
    if (noticeCode && creditorTaxId && amount && informalNotification?.senderDenomination) {
      PGEventStrategyFactory.triggerEvent(
        PGEventsType.SEND_PG_START_PAYMENT,
        { notificationType: 'INFORMAL' },
        { sendImmediately: true }
      );
      dispatch(
        getReceivedNotificationPaymentUrl({
          paymentNotice: {
            noticeNumber: noticeCode,
            fiscalCode: creditorTaxId,
            amount,
            companyName: informalNotification.senderDenomination,
            description: informalNotification.subject,
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

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) => {
    PGEventStrategyFactory.triggerEvent(
      PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT,
      { notificationType: 'INFORMAL', documentType: name },
      { sendImmediately: true }
    );

    return dispatch(
      getReceivedInformalNotificationPayment({
        iun: informalNotification?.iun ?? '',
        attachmentName: name,
        attachmentIdx,
      })
    );
  };

  const showInfoMessageIfRetryAfterOrDownload = (response: {
    url: string;
    retryAfter?: number;
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

  const handleDocumentDownload = (document?: string | NotificationDetailOtherDocument) => {
    if (!informalNotification?.iun || !document || typeof document !== 'string') {
      return;
    }

    PGEventStrategyFactory.triggerEvent(
      PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT,
      { notificationType: 'INFORMAL', documentType: NotificationDocumentType.ATTACHMENT },
      { sendImmediately: true }
    );

    dispatch(
      getReceivedInformalNotificationDocument({
        iun: informalNotification.iun,
        docIdx: Number(document),
      })
    )
      .unwrap()
      .then(showInfoMessageIfRetryAfterOrDownload)
      .catch(() => {});
  };

  useEffect(() => {
    if (!pageReady || hasInformalReceivedApiError || !informalNotification) {
      return;
    }

    PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_NOTIFICATION_DETAIL, {
      notificationType: 'INFORMAL',
      notificationStatus: informalNotification.notificationStatus as InformalNotificationStatus,
      paymentCount,
      timeline: informalNotification.timeline,
    });
  }, [
    pageReady,
    hasInformalReceivedApiError,
    informalNotification?.iun,
    informalNotification?.notificationStatus,
    informalNotification?.timeline,
    paymentCount,
  ]);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      {hasInformalReceivedApiError && (
        <Box sx={{ p: 3 }}>
          {properBreadcrumb}
          <ApiError
            onClick={fetchReceivedInformalNotification}
            mt={3}
            apiId={INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION}
          />
        </Box>
      )}
      {!hasInformalReceivedApiError && (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {properBreadcrumb}

          <AbstractPaper
            title={primaryMessage?.subject ?? ''}
            senderPaId={informalNotification?.senderPaId}
            senderDenomination={informalNotification?.senderDenomination ?? ''}
            filedAt={informalNotification?.filedAt ?? ''}
            iun={informalNotification?.iun ?? ''}
            isLegal={false}
            abstract={primaryMessage?.longBody ?? ''}
            recipientDenomination={currentRecipient?.denomination}
            hasAttachments={documentsAvailable}
            hasPayment={hasPayments}
            selfcareCdnUrl={SELFCARE_CDN_URL}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
            <Stack spacing={2} sx={{ width: { xs: '100%', md: '58%' } }}>
              {documentsAvailable && (
                <MIPaper padding={24}>
                  <NotificationDetailDocuments
                    title={t('detail.acts', { ns: 'notifiche' })}
                    documents={informalNotification?.documents}
                    clickHandler={handleDocumentDownload}
                    documentsAvailable={documentsAvailable}
                    downloadFilesMessage={getDownloadFilesMessage()}
                    titleVariant="h5"
                  />
                </MIPaper>
              )}
              {hasPayments && (
                <MIPaper padding={24}>
                  <NotificationPaymentRecipient
                    payments={paymentsData}
                    isCancelled={false}
                    iun={informalNotification?.iun ?? ''}
                    onPayClick={onPayClick}
                    handleFetchPaymentsInfo={reloadPaymentsInfo}
                    getPaymentAttachmentAction={getPaymentAttachmentAction}
                  />
                </MIPaper>
              )}
            </Stack>

            <PnSenderContacts phone={phone} site={site} />
          </Stack>
        </Box>
      )}
    </LoadingPageWrapper>
  );
};

export default InformalNotificationDetail;
