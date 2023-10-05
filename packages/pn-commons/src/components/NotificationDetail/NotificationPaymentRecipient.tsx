import _ from 'lodash';
import React, { Fragment, memo, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, Link, RadioGroup, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  NotificationDetailPayment,
  PagoPAPaymentFullDetails,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentStatus,
  PaymentsData,
} from '../../types';
import { formatEurocentToCurrency } from '../../utility';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

type Props = {
  payments: PaymentsData;
  isCancelled: boolean;
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleDownloadAttachment: (
    name: PaymentAttachmentSName,
    recIndex: number,
    attachmentIdx?: number
  ) => void;
  handleReloadPayment: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  isCancelled,
  onPayClick,
  handleDownloadAttachment,
  handleReloadPayment,
}) => {
  const { pagoPaF24, f24Only } = payments;

  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;

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

  const downloadAttachment = (attachmentName: PaymentAttachmentSName) => {
    if (selectedPayment && !_.isNil(selectedPayment.recIndex)) {
      handleDownloadAttachment(
        attachmentName,
        selectedPayment.recIndex,
        selectedPayment.attachmentIdx
      );
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} data-testid="paymentInfoBox">
      <Typography variant="h6" data-testid="notification-payment-recipient-title">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.title')}
      </Typography>

      {isCancelled ? (
        <Alert tabIndex={0} data-testid="cancelledAlertPayment" severity="info">
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.cancelled-message')}
          &nbsp;
          <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.disclaimer-link')}
          </Link>
        </Alert>
      ) : (
        <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
          {getTitle()}
        </Typography>
      )}

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
                    isCancelled={isCancelled}
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
                onClick={() => downloadAttachment(PaymentAttachmentSName.PAGOPA)}
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
                  <ButtonNaked
                    color="primary"
                    onClick={() => downloadAttachment(PaymentAttachmentSName.F24)}
                  >
                    <Download fontSize="small" sx={{ mr: 1 }} />
                    {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
                  </ButtonNaked>
                </Box>
              ) : null}
            </Fragment>
          )}
        </>
      )}

      {!isCancelled && (
        <Fragment>
          {f24Only.length > 0 && pagoPaF24.length > 0 && (
            <Typography variant="overline" mt={3}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.f24Models')}
            </Typography>
          )}

          {f24Only.map((f24Item, index) => (
            <Box key={index}>
              <NotificationPaymentF24Item
                f24Item={f24Item}
                handleDownloadAttachment={handleDownloadAttachment}
              />
            </Box>
          ))}
        </Fragment>
      )}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
