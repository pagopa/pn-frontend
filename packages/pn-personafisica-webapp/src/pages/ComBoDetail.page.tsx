import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Box, Paper as MIPaper, Stack, Typography } from '@mui/material';
import {
  EventPaymentRecipientType,
  NotificationDetailDocuments,
  NotificationDetailPayment,
  NotificationPaymentRecipient,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentStatus,
  PaymentsData,
  PnBreadcrumb,
  getPaymentCache,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../models/PFEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector, useSafeAppDispatch } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getReceivedNotificationPayment,
  getReceivedNotificationPaymentInfo,
} from '../redux/notification/actions';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const ComBoDetail: React.FC = () => {
  const { mandateId } = useParams();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  const { F24_DOWNLOAD_WAIT_TIME, NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK } = getConfiguration();
  const dispatch = useAppDispatch();
  const safeDispatch = useSafeAppDispatch();

  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const userPayments = useAppSelector((state: RootState) => state.notificationState.paymentsData);
  const currentRecipient = notification?.currentRecipient;
  const paymentTpp = useAppSelector((state: RootState) => state.generalInfoState.paymentTpp);

  const checkIfUserHasPayments: boolean =
    !!currentRecipient.payments && currentRecipient.payments.length > 0;
  const isCancelled = useIsCancelled({ notification });
  const isCancelledOrCancelling = isCancelled.cancelled || isCancelled.cancellationInProgress;

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

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getReceivedNotificationPayment({
        iun: notification.iun,
        attachmentName: name,
        mandateId,
        attachmentIdx,
      })
    );

  const trackEventPaymentRecipient = (event: EventPaymentRecipientType, param?: object) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType[event], param);
  };

  const reloadPaymentsInfo = (data: Array<NotificationDetailPayment>) => {
    fetchPaymentsInfo(data);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_DETAIL_REFRESH);
  };

  const properBreadcrumb = useMemo(() => {
    const backRoute = routes.NOTIFICHE;

    return (
      <PnBreadcrumb
        linkRoute={backRoute}
        linkLabel={t('title', { ns: 'notifiche' })}
        currentLocationLabel="Avviso di pagamento per la fornitura idrica"
        showBackAction={false}
      />
    );
  }, [i18n.language]);

  const breadcrumb = <Fragment>{properBreadcrumb}</Fragment>;

  const mockDocuments = [
    {
      title: 'Bolletta servizio idrico 76543210',
      ref: {
        key: 'mock-document-key',
        versionToken: 'mock-version-token',
      },
      digests: {
        sha256: 'mock-sha256',
      },
      contentType: 'application/pdf',
    },
  ];

  const mockPaymentsData: PaymentsData = {
    pagoPaF24: [
      {
        pagoPa: {
          amount: 57,
          noticeCode: '302000100000019421',
          creditorTaxId: '12345678901',
          applyCost: false,
          status: PaymentStatus.REQUIRED,
        },
      },
    ],
    f24Only: [],
  };
  const handleDocumentDownload = () => {
    console.log('download');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {breadcrumb}
      <MIPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
        <Stack spacing={3}>
          <Typography variant="h4">Avviso di pagamento per la fornitura idrica</Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight={700}>
                Sorical S.p.A.
              </Typography>

              <Typography variant="body2" color="text.secondary">
                12 aprile 2026
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Codice IUN
              </Typography>

              <Typography variant="body2" fontWeight={700}>
                YYYYMM-1-ABCD-EFGH-X
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography>Ciao Adalgisa,</Typography>

            <Typography>
              <strong>Sorical S.p.A.</strong> ti ha inviato un avviso di pagamento relativo alla
              fornitura idrica per immobile situato in
            </Typography>

            <Typography>Persona a cui è intestato il pagamento:</Typography>

            <Typography>Importo:</Typography>

            <Typography>Da pagare entro il giorno:</Typography>

            <Typography>
              Puoi completare il pagamento premendo <strong>Paga</strong>, oppure utilizzare avviso
              allegato per saldare importo dovuto.
            </Typography>

            <Typography>
              Hai bisogno di assistenza? Contatta Sorical S.p.A. attraverso i suoi canali ufficiali.
            </Typography>
          </Stack>
        </Stack>
      </MIPaper>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <MIPaper sx={{ p: 3, flex: 1 }} variant="outlined">
          <NotificationDetailDocuments
            title={t('detail.acts', { ns: 'notifiche' })}
            documents={mockDocuments}
            clickHandler={handleDocumentDownload}
            documentsAvailable={true}
            downloadFilesMessage=""
            downloadFilesLink=""
            titleVariant="h5"
          />
        </MIPaper>
        <MIPaper sx={{ p: 3, width: { xs: '100%', md: 360 } }} variant="outlined">
          <Stack spacing={2}>
            <Typography variant="h5">Contatta il mittente</Typography>

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Numero di telefono dell&apos;ente
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                +39 123 456 4444
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Sito web dell&apos;ente
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                www.soricalspa.com
              </Typography>
            </Stack>
          </Stack>
        </MIPaper>
      </Stack>

      <MIPaper sx={{ p: 3 }} variant="outlined">
        <NotificationPaymentRecipient
          payments={userPayments ?? mockPaymentsData}
          paymentTpp={paymentTpp}
          isCancelled={isCancelledOrCancelling}
          iun={notification.iun}
          handleTrackEvent={trackEventPaymentRecipient}
          onPayClick={() => {}}
          onPayTppClick={() => {}}
          handleFetchPaymentsInfo={reloadPaymentsInfo}
          getPaymentAttachmentAction={getPaymentAttachmentAction}
          timerF24={F24_DOWNLOAD_WAIT_TIME}
          costDetailsAssistanceLink={NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK}
          costDetails={notification.notificationCostDetails}
          paymentTppUrlActionID={NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_TPP_URL}
        />
      </MIPaper>
    </Box>
  );
};

export default ComBoDetail;
