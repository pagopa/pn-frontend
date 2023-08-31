import React, { Fragment, memo, useEffect, useState } from 'react';
import { Download } from '@mui/icons-material/';
import { Box, Button, Link, RadioGroup, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  F24PaymentDetails,
  NotificationDetailPayment,
  PagoPAPaymentHistory,
  PaymentAttachmentSName,
  PaymentHistory,
  PaymentStatus,
} from '../../types';
import { formatEurocentToCurrency } from '../../utils';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

type Props = {
  payments: Array<PaymentHistory>;
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleDownloadAttachamentPagoPA: (name: PaymentAttachmentSName) => void;
  handleReloadPayment: (payment: Array<PaymentHistory | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  onPayClick,
  handleDownloadAttachamentPagoPA,
  handleReloadPayment,
}) => {
  const isSinglePayment = payments.length === 1;

  const [selectedPayment, setSelectedPayment] = useState<PagoPAPaymentHistory | null>(null);

  const allPaymentsIsPaid = payments.every(
    (payment) => payment.pagoPA?.status === PaymentStatus.SUCCEEDED
  );

  const pagoPAPaymentHistory = payments.reduce((arr, payment) => {
    if (payment.pagoPA) {
      // eslint-disable-next-line functional/immutable-data
      arr.push(payment.pagoPA);
    }
    return arr;
  }, [] as Array<PagoPAPaymentHistory>);

  const f24PaymentHistory = payments.reduce((arr, payment) => {
    if (!payment.pagoPA && payment.f24) {
      // eslint-disable-next-line functional/immutable-data
      arr.push(payment.f24);
    }
    return arr;
  }, [] as Array<F24PaymentDetails>);

  const getTitle = () => {
    const FaqLink = (
      <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how')}
      </Link>
    );

    if (pagoPAPaymentHistory.length > 0 && f24PaymentHistory.length > 0) {
      return (
        <>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-mixed')}
          &nbsp;
          {FaqLink}
        </>
      );
    }

    if (pagoPAPaymentHistory.length > 0) {
      return (
        <>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle')}
          &nbsp;
          {FaqLink}
        </>
      );
    }

    return getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-f24');
  };

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = event.target.value;

    setSelectedPayment(
      payments.find((item) => item.pagoPA?.noticeCode === radioSelection)?.pagoPA || null
    );
  };

  const handleDeselectPayment = () => {
    setSelectedPayment(null);
  };

  useEffect(() => {
    if (isSinglePayment) {
      setSelectedPayment(payments[0].pagoPA || null);
    }
  }, [payments]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" data-testid="notification-payment-recipient-title">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.title')}
      </Typography>

      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getTitle()}
      </Typography>

      {f24PaymentHistory.length > 0 && pagoPAPaymentHistory.length > 0 && (
        <Typography variant="overline" mt={3}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.pagoPANotices')}
        </Typography>
      )}

      {pagoPAPaymentHistory.length > 0 && (
        <>
          <RadioGroup name="radio-buttons-group" value={selectedPayment} onChange={handleClick}>
            {payments.map((payment, index) =>
              payment.pagoPA ? (
                <Box mb={2} key={`payment-${index}`} data-testid="pagopa-item">
                  <NotificationPaymentPagoPAItem
                    pagoPAItem={payment.pagoPA}
                    loading={payment.isLoading ?? false}
                    isSelected={payment.pagoPA.noticeCode === selectedPayment?.noticeCode}
                    handleReloadPayment={() => handleReloadPayment([payment])}
                    handleDeselectPayment={handleDeselectPayment}
                    isSinglePayment={isSinglePayment}
                  />
                </Box>
              ) : null
            )}
          </RadioGroup>

          {!allPaymentsIsPaid && (
            <Fragment>
              <Button
                fullWidth
                variant="contained"
                data-testid="pay-button"
                disabled={!selectedPayment}
                onClick={() =>
                  onPayClick(
                    selectedPayment?.noticeCode,
                    selectedPayment?.creditorTaxId,
                    selectedPayment?.amount
                  )
                }
              >
                {getLocalizedOrDefaultLabel('notifications', 'detail.payment.submit')}
                &nbsp;
                {selectedPayment && selectedPayment.amount
                  ? formatEurocentToCurrency(selectedPayment.amount)
                  : null}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                data-testid="download-pagoPA-notice-button"
                disabled={!selectedPayment}
                onClick={() => handleDownloadAttachamentPagoPA(PaymentAttachmentSName.PAGOPA)}
              >
                <Download fontSize="small" sx={{ mr: 1 }} />
                {getLocalizedOrDefaultLabel(
                  'notifications',
                  'detail.payment.download-pagoPA-notice'
                )}
              </Button>
              {selectedPayment &&
              payments.find((payment) => payment.pagoPA?.noticeCode === selectedPayment.noticeCode)
                ?.f24 ? (
                <Box display="flex" justifyContent="space-between" data-testid="f24-download">
                  <Typography variant="body2">
                    {getLocalizedOrDefaultLabel('notifications', 'detail.payment.pay-with-f24')}
                  </Typography>
                  <ButtonNaked color="primary">
                    <Download fontSize="small" sx={{ mr: 1 }} />
                    {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
                  </ButtonNaked>
                </Box>
              ) : null}
            </Fragment>
          )}
        </>
      )}

      {f24PaymentHistory.length > 0 && pagoPAPaymentHistory.length > 0 && (
        <Typography variant="overline" mt={3}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.f24Models')}
        </Typography>
      )}

      {f24PaymentHistory.map((f24Item, index) => (
        <Box key={index}>
          <NotificationPaymentF24Item f24Item={f24Item} loading={false} />
        </Box>
      ))}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
