import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper as MIPaper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AbstractPaper,
  EventPaymentRecipientType,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationPaymentRecipient,
  PaymentAttachmentSName,
  PaymentStatus,
  PaymentsData,
  PnBreadcrumb,
} from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import { informalNotificationMock } from '../__mocks__/InformalNotification.mock';
import { BffFullInformalNotificationV1 } from '../generated-client/informal-notifications';
import { PFEventsType } from '../models/PFEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  INFORMAL_NOTIFICATION_ACTIONS,
  getReceivedInformalNotificationDocument,
  getReceivedInformalNotificationPayment,
  getReceivedInformalNotificationPaymentInfo,
} from '../redux/notification/informalActions';
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
  const { id } = useParams();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  const { F24_DOWNLOAD_WAIT_TIME, NOTIFICATION_COST_DETAILS_ASSISTANCE_LINK } = getConfiguration();

  const dispatch = useAppDispatch();
  const paymentTpp = useAppSelector((state: RootState) => state.generalInfoState.paymentTpp);

  const [informalNotification, setInformalNotification] =
    React.useState<BffFullInformalNotificationV1>();

  const [paymentsData, setPaymentsData] = React.useState<PaymentsData>({
    pagoPaF24: [],
    f24Only: [],
  });

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

  const currentRecipient = informalNotification?.recipients?.[0];

  useEffect(() => {
    const payments = currentRecipient?.payments;

    if (!payments?.length) {
      return;
    }

    const paymentInfoRequest = payments.map((payment) => ({
      noticeCode: payment.pagoPa.noticeCode,
      creditorTaxId: payment.pagoPa.creditorTaxId,
    }));

    void dispatch(getReceivedInformalNotificationPaymentInfo({ paymentInfoRequest }))
      .unwrap()
      .then((paymentInfo) => {
        setPaymentsData({
          pagoPaF24: paymentInfo.map((info, index) => ({
            pagoPa: {
              ...currentRecipient?.payments?.[index]?.pagoPa,
              ...info,
              applyCost: false,
            },
          })),
          f24Only: [],
        });
      })
      .catch(() => {});
  }, [currentRecipient?.payments, dispatch]);

  const primaryMessage = currentRecipient
    ? (currentRecipient as any).message?.primaryMessage
    : undefined;

  const properBreadcrumb = useMemo(() => {
    const backRoute = routes.NOTIFICHE;

    return (
      <PnBreadcrumb
        linkRoute={backRoute}
        linkLabel={t('title', { ns: 'notifiche' })}
        currentLocationLabel={primaryMessage?.subject ?? ''}
        showBackAction={false}
      />
    );
  }, [i18n.language, primaryMessage?.subject]);

  const breadcrumb = <Fragment>{properBreadcrumb}</Fragment>;

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getReceivedInformalNotificationPayment({
        iun: informalNotification?.iun ?? '',
        attachmentName: name,
        attachmentIdx,
      })
    );

  const trackEventPaymentRecipient = (event: EventPaymentRecipientType, param?: object) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType[event], param);
  };

  const handleDocumentDownload = (document?: string | NotificationDetailOtherDocument) => {
    if (!informalNotification?.iun || !document || typeof document !== 'string') {
      return;
    }

    void dispatch(
      getReceivedInformalNotificationDocument({
        iun: informalNotification.iun,
        docIdx: Number(document),
      })
    );
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {breadcrumb}

      <MIPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
        <AbstractPaper
          title={primaryMessage?.subject ?? ''}
          senderDenomination={informalNotification?.senderDenomination ?? ''}
          sentAt={informalNotification?.sentAt ?? ''}
          iun={informalNotification?.iun ?? ''}
          isLegal={false}
          abstract={primaryMessage?.longBody ?? ''}
        />
      </MIPaper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
        <Stack spacing={2} sx={{ width: { xs: '100%', md: '65%' } }}>
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
          <MIPaper sx={{ p: 3 }} variant="outlined">
            <NotificationPaymentRecipient
              payments={
                paymentsData.pagoPaF24.length || paymentsData.f24Only.length
                  ? paymentsData
                  : mockPaymentsData
              }
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
              paymentTppUrlActionID={
                INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION_PAYMENT
              }
            />
          </MIPaper>
        </Stack>

        <MIPaper sx={{ p: 3, width: { xs: '100%', md: '35%' } }} variant="outlined">
          <Stack spacing={2}>
            <Typography component="h2" variant="h5">
              Contatta il mittente
            </Typography>

            <List>
              <ListItem disableGutters>
                <ListItemText
                  primary="Numero di telefono dell'ente"
                  sx={{ color: theme.palette.primary.light }}
                  secondary={currentRecipient?.phoneNumber ?? '-'}
                />
              </ListItem>

              <Divider />

              <ListItem disableGutters>
                <ListItemText
                  primary="Email dell'ente"
                  sx={{ color: theme.palette.primary.light }}
                  secondary={currentRecipient?.email ?? '-'}
                />
              </ListItem>
            </List>
          </Stack>
        </MIPaper>
      </Stack>
    </Box>
  );
};

export default InformalNotificationDetail;
