import { Download } from '@mui/icons-material/';
import { Box, Button, Link, RadioGroup, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import React, { Fragment, memo, useState } from 'react';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  NotificationDetailPayment,
  PagoPAPaymentFullDetails,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentStatus,
  PaymentsData,
} from '../../types';
import { formatEurocentToCurrency } from '../../utils';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

type Props = {
  payments: PaymentsData;
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleDownloadAttachamentPagoPA: (name: PaymentAttachmentSName) => void;
  handleReloadPayment: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  onPayClick,
  handleDownloadAttachamentPagoPA,
  handleReloadPayment,
}) => {
  const { pagoPaF24, f24Only } = payments;

  const isSinglePayment = pagoPaF24.length === 1;

  const [selectedPayment, setSelectedPayment] = useState<PagoPAPaymentFullDetails | null>(
    isSinglePayment ? pagoPaF24[0].pagoPA ?? null : null
  );

  const allPaymentsIsPaid = pagoPaF24.every(
    (payment) => payment.pagoPA?.status === PaymentStatus.SUCCEEDED
  );

  const getTitle = () => {
    const FaqLink = (
      <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how')}
      </Link>
    );

    if (pagoPaF24.length > 0 && f24Only.length > 0) {
      return (
        <>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-mixed')}
          &nbsp;
          {FaqLink}
        </>
      );
    }

    if (pagoPaF24.length > 0) {
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
      pagoPaF24.find((item) => item.pagoPA?.noticeCode === radioSelection)?.pagoPA || null
    );
  };

  const handleDeselectPayment = () => {
    setSelectedPayment(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" data-testid="notification-payment-recipient-title">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.title')}
      </Typography>

      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getTitle()}
      </Typography>

      {f24Only.length > 0 && pagoPaF24.length > 0 && (
        <Typography variant="overline" mt={3}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.pagoPANotices')}
        </Typography>
      )}

      {pagoPaF24.length > 0 && (
        <>
          <RadioGroup name="radio-buttons-group" value={selectedPayment} onChange={handleClick}>
            {pagoPaF24.map((payment, index) =>
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
              pagoPaF24.find((payment) => payment.pagoPA?.noticeCode === selectedPayment.noticeCode)
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

      {f24Only.length > 0 && pagoPaF24.length > 0 && (
        <Typography variant="overline" mt={3}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.f24Models')}
        </Typography>
      )}

      {f24Only.map((f24Item, index) => (
        <Box key={index}>
          <NotificationPaymentF24Item f24Item={f24Item} />
        </Box>
      ))}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
