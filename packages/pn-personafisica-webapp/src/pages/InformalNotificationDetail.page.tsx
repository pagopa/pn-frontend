import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Box, Paper as MIPaper, Stack, Typography } from '@mui/material';
import {
  AbstractPaper,
  EventPaymentRecipientType,
  NotificationDetailDocuments,
  NotificationPaymentRecipient,
  PaymentAttachmentSName,
  PaymentStatus,
  PaymentsData,
  PnBreadcrumb,
} from '@pagopa-pn/pn-commons';

import { informalNotificationMock } from '../__mocks__/InformalNotification.mock';
import { BffFullInformalNotificationV1 } from '../generated-client/informal-notifications';
import { PFEventsType } from '../models/PFEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getReceivedNotificationPayment,
} from '../redux/notification/actions';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const mockPaymentsData: PaymentsData = {
  pagoPaF24: [
    {
      pagoPa: {
        amount: 999,
        noticeCode: '302000100000019421',
        creditorTaxId: '12345678901',
        applyCost: false,
        status: PaymentStatus.REQUIRED,
      },
    },
  ],
  f24Only: [],
};

const InformalNotificationDetail: React.FC = () => {
  const { id, mandateId } = useParams();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  const { F24_DOWNLOAD_WAIT_TIME, NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK } = getConfiguration();

  const dispatch = useAppDispatch();
  const paymentTpp = useAppSelector((state: RootState) => state.generalInfoState.paymentTpp);

  const [informalNotification, setInformalNotification] =
    React.useState<BffFullInformalNotificationV1>();

  /*   
  
   // TODO: rimuovere quando il BE sarà disponibile
  useEffect(() => {
    if (id) {
      void dispatch(getReceivedInformalNotification(id))
        .unwrap()
        .then(setInformalNotification)
        .catch(() => {});
    }
  }, [id, dispatch]); */

  useEffect(() => {
    if (!id) {
      return;
    }

    // TODO: rimuovere quando il BE sarà disponibile
    setInformalNotification(informalNotificationMock);
  }, [id]);

  const properBreadcrumb = useMemo(() => {
    const backRoute = routes.NOTIFICHE;

    return (
      <PnBreadcrumb
        linkRoute={backRoute}
        linkLabel={t('title', { ns: 'notifiche' })}
        currentLocationLabel={informalNotification?.subject ?? ''}
        showBackAction={false}
      />
    );
  }, [i18n.language, informalNotification?.subject]);

  const breadcrumb = <Fragment>{properBreadcrumb}</Fragment>;

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getReceivedNotificationPayment({
        iun: informalNotification?.iun ?? '',
        attachmentName: name,
        mandateId,
        attachmentIdx,
      })
    );

  const trackEventPaymentRecipient = (event: EventPaymentRecipientType, param?: object) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType[event], param);
  };

  const handleDocumentDownload = () => {
    console.log('download documento combo');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {breadcrumb}

      <MIPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
        <AbstractPaper
          title={informalNotification?.subject}
          senderDenomination={informalNotification?.senderDenomination}
          sentAt={informalNotification?.sentAt ?? ''}
          iun={informalNotification?.iun ?? ''}
          abstract=""
        />
      </MIPaper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <MIPaper sx={{ p: 3, flex: 1 }} variant="outlined">
          <NotificationDetailDocuments
            title={t('detail.acts', { ns: 'notifiche' })}
            documents={informalNotification?.documents}
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
          payments={mockPaymentsData}
          paymentTpp={paymentTpp}
          isCancelled={false}
          iun={informalNotification?.iun ?? ''}
          handleTrackEvent={trackEventPaymentRecipient}
          onPayClick={() => {}}
          onPayTppClick={() => {}}
          handleFetchPaymentsInfo={() => {}}
          getPaymentAttachmentAction={getPaymentAttachmentAction}
          timerF24={F24_DOWNLOAD_WAIT_TIME}
          costDetailsAssistanceLink={NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK}
          costDetails={undefined}
          paymentTppUrlActionID={NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION_PAYMENT_TPP_URL}
        />
      </MIPaper>
    </Box>
  );
};

export default InformalNotificationDetail;
