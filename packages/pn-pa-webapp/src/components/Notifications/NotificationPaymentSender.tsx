import { ChangeEvent, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Box, Divider, MenuItem, Stack, SxProps, TextField, Typography } from '@mui/material';
import {
  CustomPagination,
  F24PaymentDetails,
  INotificationDetailTimeline,
  NotificationPayment,
  PaginationData,
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentStatus,
  RecipientType,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';
import { MIPaper } from '@pagopa/mui-italia';

import NotificationPaymentF24 from './NotificationPaymentF24';
import NotificationPaymentPagoPa from './NotificationPaymentPagoPa';

type NotificationPaymentRecipient = {
  recipientType: `${RecipientType}`;
  taxId: string;
  denomination: string;
  payments?: Array<NotificationPayment>;
};

type Props = {
  iun: string;
  recipients: Array<NotificationPaymentRecipient>;
  timeline?: Array<INotificationDetailTimeline>;
  sx?: SxProps;
  onPagoPaDownload?: (payment: PagoPAPaymentFullDetails) => void;
};

const renderRecipientMenuItem = (
  index: number,
  option: NotificationPaymentRecipient,
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
  recipients: Array<NotificationPaymentRecipient>
): string => {
  const recipient = recipients.find((recipient) => recipient.taxId === value);
  return recipient ? `${recipient.denomination} - ${recipient.taxId}` : '';
};

const getPaymentDetails = (
  payments: NotificationPaymentRecipient['payments'],
  recipientIndex: number,
  timeline?: Array<INotificationDetailTimeline>
): Array<PaymentDetails> => {
  const paymentDetails = getPagoPaF24Payments(payments ?? [], recipientIndex, false);

  if (!timeline) {
    return paymentDetails;
  }

  return populatePaymentsPagoPaF24(timeline, paymentDetails, []).map((payment) => ({
    ...payment,
    pagoPa: payment.pagoPa
      ? {
          ...payment.pagoPa,
          status: payment.pagoPa.status ?? PaymentStatus.REQUIRED,
        }
      : undefined,
  }));
};

const NotificationPaymentSender: React.FC<Props> = ({
  iun,
  recipients,
  timeline,
  sx,
  onPagoPaDownload,
}) => {
  const { t } = useTranslation(['notifiche']);
  const [recipientSelected, setRecipientSelected] = useState<string>('');

  const [paymentDetails, setPaymentDetails] = useState<Array<PaymentDetails>>(
    recipients.length === 1 ? getPaymentDetails(recipients[0].payments, 0, timeline) : []
  );

  const [f24PaymentDetails, setF24PaymentDetails] = useState<Array<F24PaymentDetails>>(
    recipients.length === 1 ? getF24Payments(recipients[0].payments ?? [], 0, false) : []
  );
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 0,
    size: 5,
    totalElements: paymentDetails.length,
  });

  const recipientSelectionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientSelected(event.target.value);
    const recipientIndex = recipients.findIndex(
      (recipient) => recipient.taxId === event.target.value
    );
    if (recipientIndex === -1 || !recipients[recipientIndex].payments) {
      return;
    }

    setPaymentDetails(
      getPaymentDetails(recipients[recipientIndex].payments, recipientIndex, timeline)
    );

    setF24PaymentDetails(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getF24Payments(recipients[recipientIndex].payments!, recipientIndex, false)
    );
    setPaginationData({
      ...paginationData,
      totalElements: recipients[recipientIndex].payments!.length,
    });
  };

  const pagoPAPaymentFullDetails = paymentDetails
    .reduce((arr, payment) => {
      if (payment.pagoPa) {
        // eslint-disable-next-line functional/immutable-data
        arr.push(payment.pagoPa);
      }
      return arr;
    }, [] as Array<PagoPAPaymentFullDetails>)
    .slice(
      paginationData.page * paginationData.size,
      (paginationData.page + 1) * paginationData.size
    );

  return (
    <MIPaper padding={24} data-testid="paymentInfoBox" sx={sx}>
      <Typography variant="h5" component="h2" mb={2}>
        {t('payment.title', { ns: 'notifiche' })}
      </Typography>
      {recipients.length === 1 && (
        <Typography variant="body2" my={2}>
          {f24PaymentDetails.length > 0 && pagoPAPaymentFullDetails.length === 0
            ? t('payment.subtitle-single-f24', { ns: 'notifiche' })
            : t('payment.subtitle-single', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <Typography variant="body2" my={2}>
          {f24PaymentDetails.length > 0 &&
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
          label={t('payment.recipient')}
          required
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
      {pagoPAPaymentFullDetails.length > 0 && (
        <Stack gap={2}>
          {pagoPAPaymentFullDetails.map((payment) => (
            <NotificationPaymentPagoPa
              iun={iun}
              payment={payment}
              key={payment.noticeCode}
              onDownload={onPagoPaDownload}
            />
          ))}
        </Stack>
      )}
      {paginationData.totalElements > paginationData.size && (
        <Box width="full" display="flex" justifyContent="right" mt={1} data-testid="pagination-box">
          <CustomPagination
            hideSizeSelector
            paginationData={paginationData}
            onPageRequest={setPaginationData}
          />
        </Box>
      )}
      {f24PaymentDetails.length > 0 && pagoPAPaymentFullDetails.length > 0 && (
        <Divider sx={{ my: 2 }} />
      )}
      {f24PaymentDetails.length > 0 && (
        <NotificationPaymentF24 iun={iun} payments={f24PaymentDetails} />
      )}
    </MIPaper>
  );
};

export default NotificationPaymentSender;
