import React, { Fragment, memo, useEffect, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, Link, RadioGroup, Typography } from '@mui/material';

import { downloadDocument } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  F24PaymentDetails,
  NotificationDetailPayment,
  PagoPAPaymentFullDetails,
  PaymentAttachment,
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
  timerF24: number;
  getPaymentAttachmentAction: (
    name: PaymentAttachmentSName,
    attachmentIdx?: number
  ) => {
    abort: (reason?: string) => void;
    unwrap: () => Promise<PaymentAttachment>;
  };
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleReloadPayment: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  isCancelled,
  timerF24,
  getPaymentAttachmentAction,
  onPayClick,
  handleReloadPayment,
}) => {
  const { pagoPaF24, f24Only } = payments;

  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;

  const [selectedPayment, setSelectedPayment] = useState<PagoPAPaymentFullDetails | null>(null);

  const allPaymentsIsPaid = pagoPaF24.every(
    (payment) => payment.pagoPa?.status === PaymentStatus.SUCCEEDED
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
      pagoPaF24.find((item) => item.pagoPa?.noticeCode === radioSelection)?.pagoPa || null
    );
  };

  const handleDeselectPayment = () => {
    setSelectedPayment(null);
  };

  const downloadAttachment = (attachmentName: PaymentAttachmentSName) => {
    if (selectedPayment) {
      void getPaymentAttachmentAction(attachmentName, selectedPayment.attachmentIdx)
        .unwrap()
        .then((response) => {
          if (response.url) {
            downloadDocument(response.url);
          }
        });
    }
  };

  useEffect(() => {
    setSelectedPayment(isSinglePayment ? pagoPaF24[0].pagoPa ?? null : null);
  }, [payments]);

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
              payment.pagoPa ? (
                <Box mb={2} key={`payment-${index}`} data-testid="pagopa-item">
                  <NotificationPaymentPagoPAItem
                    pagoPAItem={payment.pagoPa}
                    loading={payment.isLoading ?? false}
                    isSelected={payment.pagoPa.noticeCode === selectedPayment?.noticeCode}
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
                {selectedPayment?.amount ? formatEurocentToCurrency(selectedPayment.amount) : null}
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
              pagoPaF24.find((payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode)
                ?.f24 ? (
                <Box key="attachment" data-testid="f24-download">
                  <NotificationPaymentF24Item
                    f24Item={
                      pagoPaF24.find(
                        (payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode
                      )?.f24 as F24PaymentDetails
                    }
                    getPaymentAttachmentAction={getPaymentAttachmentAction}
                    isPagoPaAttachment
                    timerF24={timerF24}
                  />
                </Box>
              ) : null}
            </Fragment>
          )}
        </>
      )}

      {!isCancelled && f24Only.length > 0 && (
        <Box data-testid="f24only-box">
          {f24Only.length > 0 && pagoPaF24.length > 0 && (
            <Typography variant="overline" mt={3}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.f24Models')}
            </Typography>
          )}

          {f24Only.map((f24Item, index) => (
            <Box key={index}>
              <NotificationPaymentF24Item
                f24Item={f24Item}
                getPaymentAttachmentAction={getPaymentAttachmentAction}
                timerF24={timerF24}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
