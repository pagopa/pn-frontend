import React, { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper as MIPaper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AbstractPaper,
  NotificationDetailDocuments,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationPaymentRecipient,
  PaymentAttachmentSName,
  PaymentsData,
  PnBreadcrumb,
} from '@pagopa-pn/pn-commons';

import { informalNotificationMock } from '../__mocks__/InformalNotification.mock';
import { BffFullInformalNotificationV1 } from '../generated-client/informal-notifications';
import { PFEventsType } from '../models/PFEventsType';
import * as routes from '../navigation/routes.const';
import { useAppDispatch } from '../redux/hooks';
import {
  getReceivedNotificationPayment,
  getReceivedNotificationPaymentUrl,
} from '../redux/notification/actions';
import {
  getReceivedInformalNotificationDocument,
  getReceivedInformalNotificationPaymentInfo,
} from '../redux/notification/informalActions';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const InformalNotificationDetail: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['common', 'notifiche']);

  const dispatch = useAppDispatch();

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
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_PAYMENT_DETAIL_REFRESH);
  };

  useEffect(() => {
    const payments = currentRecipient?.payments;

    if (!payments?.length) {
      return;
    }

    if (!payments?.length) {
      return;
    }

    fetchPaymentsInfo(payments as Array<NotificationDetailPayment>);
  }, [currentRecipient?.payments]);

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

  const onPayClick = (noticeCode?: string, creditorTaxId?: string, amount?: number) => {
    if (noticeCode && creditorTaxId && amount && informalNotification?.senderDenomination) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_START_PAYMENT, { psp: 'pagopa' });
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

  const getPaymentAttachmentAction = (name: PaymentAttachmentSName, attachmentIdx?: number) =>
    dispatch(
      getReceivedNotificationPayment({
        iun: informalNotification?.iun ?? '',
        attachmentName: name,
        attachmentIdx,
      })
    );

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
              /* va aggiunto il campo all API */
              documentsAvailable={false}
              downloadFilesMessage={t('detail.acts_files.informal_downloadable_acts', {
                ns: 'notifiche',
              })}
              titleVariant="h5"
            />
          </MIPaper>
          <MIPaper sx={{ p: 3 }} variant="outlined">
            <NotificationPaymentRecipient
              payments={paymentsData}
              isCancelled={false}
              iun={informalNotification?.iun ?? ''}
              onPayClick={onPayClick}
              handleFetchPaymentsInfo={reloadPaymentsInfo}
              getPaymentAttachmentAction={getPaymentAttachmentAction}
            />
          </MIPaper>
        </Stack>

        <MIPaper sx={{ p: 3, width: { xs: '100%', md: '35%' } }} variant="outlined">
          <Stack spacing={2}>
            <Typography component="h2" variant="h5">
              {t('detail.contact_sender.title', { ns: 'notifiche' })}
            </Typography>

            <List>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CallOutlinedIcon />
                  </ListItemIcon>
                </ListItemAvatar>
                <ListItemText sx={{ p: 0 }}>
                  <Typography variant="body2">
                    {t('detail.contact_sender.phone', { ns: 'notifiche' })}
                  </Typography>
                  <Typography variant="sidenav" color="text.primary">
                    {currentRecipient?.phoneNumber ?? '-'}
                  </Typography>
                </ListItemText>
              </ListItem>

              <Divider />

              <ListItem disableGutters>
                <ListItemAvatar>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LanguageRoundedIcon />
                  </ListItemIcon>
                </ListItemAvatar>
                <ListItemText sx={{ p: 0 }}>
                  <Typography variant="body2">
                    {t('detail.contact_sender.website', { ns: 'notifiche' })}
                  </Typography>
                  <Typography variant="sidenav" color="text.primary">
                    {currentRecipient?.email ?? '-'}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Stack>
        </MIPaper>
      </Stack>
    </Box>
  );
};

export default InformalNotificationDetail;
