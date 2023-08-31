import React, { Fragment, memo, useEffect, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Box, Button, Link, RadioGroup, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  NotificationDetailPayment,
  PagoPAPaymentHistory,
  PaymentAttachmentSName,
  PaymentHistory,
  PaymentStatus,
} from '../../types';
import { formatEurocentToCurrency } from '../../utils';
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

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = event.target.value;

    setSelectedPayment(
      payments.find((item) => item.pagoPA?.noticeCode === radioSelection)?.pagoPA || null
    );
  };

  const handleDeselectPayment = () => {
    setSelectedPayment(null);
  };

  const allPaymentsIsPaid = payments.every(
    (payment) => payment.pagoPA?.status === PaymentStatus.SUCCEEDED
  );

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
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle')}
        &nbsp;
        <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how')}
        </Link>
      </Typography>

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
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-pagoPA-notice')}
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
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
