import { ChangeEvent, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Box, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material';
import {
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationDetailRecipient,
  PagoPAPaymentFullDetails,
  PaymentDetails,
  RecipientType,
  getF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import NotificationPaymentF24 from './NotificationPaymentF24';
import NotificationPaymentPagoPa from './NotificationPaymentPagoPa';

type Props = {
  iun: string;
  recipients: Array<NotificationDetailRecipient>;
  timeline: Array<INotificationDetailTimeline>;
};

const renderRecipientMenuItem = (
  index: number,
  option: NotificationDetailRecipient,
  t: TFunction<Array<string>, undefined>
) => (
  <MenuItem
    key={option.taxId}
    role="option"
    sx={{ mt: index === 0 ? 0 : 2, px: 4, py: 1 }}
    value={option.taxId}
  >
    <Box fontWeight={600}>
      {option.denomination} - {option.taxId}
      <Typography variant="body2" color="action.active">
        {option.recipientType === RecipientType.PF
          ? t('detail.physical-person')
          : t('detail.legal-person')}
      </Typography>
    </Box>
  </MenuItem>
);

const renderSelectValue = (
  value: string,
  recipients: Array<NotificationDetailRecipient>
): string => {
  const recipient = recipients.find((recipient) => recipient.taxId === value);
  return recipient ? `${recipient.denomination} - ${recipient.taxId}` : '';
};

const NotificationPaymentSender: React.FC<Props> = ({ iun, recipients, timeline }) => {
  const { t } = useTranslation(['notifiche']);
  const [recipientSelected, setRecipientSelected] = useState<string>('');
  const [paymentHistory, setPaymentHistory] = useState<Array<PaymentDetails>>(
    recipients.length === 1
      ? populatePaymentsPagoPaF24(timeline, recipients[0].payments ?? [], [])
      : []
  );
  const [f24PaymentHistory, setF24PaymentHistory] = useState<Array<F24PaymentDetails>>(
    recipients.length === 1 ? getF24Payments(recipients[0].payments ?? [], false) : []
  );

  const recipientSelectionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientSelected(event.target.value);
    const paymentsOfRecipient = recipients.find(
      (recipient) => recipient.taxId === event.target.value
    )?.payments;
    if (!paymentsOfRecipient) {
      return;
    }
    setPaymentHistory(populatePaymentsPagoPaF24(timeline, paymentsOfRecipient, []));
    setF24PaymentHistory(getF24Payments(paymentsOfRecipient, false));
  };

  const pagoPAPaymentFullDetails = paymentHistory.reduce((arr, payment) => {
    if (payment.pagoPA) {
      // eslint-disable-next-line functional/immutable-data
      arr.push(payment.pagoPA);
    }
    return arr;
  }, [] as Array<PagoPAPaymentFullDetails>);

  console.log('pagoPAPaymentFullDetails', pagoPAPaymentFullDetails);

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="paymentInfoBox">
      <Typography variant="h6">{t('payment.title', { ns: 'notifiche' })}</Typography>
      {recipients.length === 1 && (
        <Typography variant="body2" my={2}>
          {f24PaymentHistory.length > 0 && pagoPAPaymentFullDetails.length === 0
            ? t('payment.subtitle-single-f24', { ns: 'notifiche' })
            : t('payment.subtitle-single', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <Typography variant="body2" my={2}>
          {f24PaymentHistory.length > 0 &&
          pagoPAPaymentFullDetails.length === 0 &&
          recipientSelected
            ? t('payment.subtitle-multiple-f24', { ns: 'notifiche' })
            : t('payment.subtitle-multiple', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <TextField
          id="recipients-select"
          data-testid="recipients-select"
          name="recipients-select"
          size="small"
          fullWidth
          onChange={recipientSelectionHandler}
          label={`${t('detail.recipient')}*`}
          aria-label={`${t('detail.recipient')}*`}
          sx={{ mb: 1 }}
          select
          SelectProps={{
            MenuProps: { MenuListProps: { sx: { py: 3, px: 0 } } },
            renderValue: (value) => renderSelectValue(value as string, recipients),
          }}
          value={recipientSelected}
        >
          {recipients.map((recipient, index) => renderRecipientMenuItem(index, recipient, t))}
        </TextField>
      )}
      {pagoPAPaymentFullDetails.length > 0 &&
        pagoPAPaymentFullDetails.map((payment) => (
          <NotificationPaymentPagoPa iun={iun} payment={payment} key={payment.noticeCode} />
        ))}
      {f24PaymentHistory.length > 0 && pagoPAPaymentFullDetails.length > 0 && (
        <Divider sx={{ my: 2 }} />
      )}
      {f24PaymentHistory.length > 0 && (
        <NotificationPaymentF24 iun={iun} payments={f24PaymentHistory} />
      )}
    </Paper>
  );
};

export default NotificationPaymentSender;
