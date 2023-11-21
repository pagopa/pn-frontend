import React, { Fragment, memo, useEffect, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, Link, RadioGroup, Typography } from '@mui/material';

import { downloadDocument } from '../../hooks';
import {
  F24PaymentDetails,
  NotificationDetailPayment,
  PagoPAPaymentFullDetails,
  PaymentAttachment,
  PaymentAttachmentSName,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  PaymentsData,
} from '../../models';
import { formatEurocentToCurrency } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

type TrackEventPaymentStatus = {
  page_number: number;
  count_payment: number;
  count_unpaid: number;
  count_paid: number;
  count_error: number;
  count_expired: number;
  count_canceled: number;
  count_revoked: number;
};

type Props = {
  payments: PaymentsData;
  isCancelled: boolean;
  timerF24: number;
  landingSiteUrl: string;
  getPaymentAttachmentAction: (
    name: PaymentAttachmentSName,
    attachmentIdx?: number
  ) => {
    abort: (reason?: string) => void;
    unwrap: () => Promise<PaymentAttachment>;
  };
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleReloadPayment: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
  handleTrackNotificationCancelledRefoundInfo?: () => void;
  handleTrackMultipaymentMoreInfo?: () => void;
  handleTrackDownloadPaymentNotice?: () => void;
  handleTrackDownloadF24?: () => void;
  handleTrackDownloadF24Success?: () => void;
  handleTrackPaymentStatus?: (paymentStatus: TrackEventPaymentStatus) => void;
  handleTrackDownloadF24Timeout?: () => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  isCancelled,
  timerF24,
  landingSiteUrl,
  getPaymentAttachmentAction,
  onPayClick,
  handleReloadPayment,
  handleTrackNotificationCancelledRefoundInfo,
  handleTrackMultipaymentMoreInfo,
  handleTrackDownloadPaymentNotice,
  handleTrackDownloadF24,
  handleTrackDownloadF24Success,
  handleTrackPaymentStatus,
  handleTrackDownloadF24Timeout,
}) => {
  const { pagoPaF24, f24Only } = payments;

  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;

  const [selectedPayment, setSelectedPayment] = useState<PagoPAPaymentFullDetails | null>(null);

  const allPaymentsIsPaid = pagoPaF24.every(
    (payment) => payment.pagoPa?.status === PaymentStatus.SUCCEEDED
  );

  const FAQ_NOTIFICATION_COSTS = '/faq#costi-di-notifica';
  const FAQ_NOTIFICATION_CANCELLED_REFUND = '/faq#notifica-pagata-rimborso';

  const notificationCostsFaqLink = `${landingSiteUrl}${FAQ_NOTIFICATION_COSTS}`;
  const cancelledNotificationFAQ = `${landingSiteUrl}${FAQ_NOTIFICATION_CANCELLED_REFUND}`;

  const getTitle = () => {
    const FaqLink = (
      <Link
        href={notificationCostsFaqLink}
        onClick={handleTrackMultipaymentMoreInfo}
        target="_blank"
        fontWeight="bold"
        sx={{ cursor: 'pointer' }}
      >
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
      if (handleTrackDownloadPaymentNotice) {
        handleTrackDownloadPaymentNotice();
      }
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
    // some of following properties are set to -1 because of still missing features (or not implemented anymore)
    if (handleTrackPaymentStatus) {
      handleTrackPaymentStatus({
        page_number: -1,
        count_payment: pagoPaF24.length,
        count_canceled: pagoPaF24.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail === PaymentInfoDetail.PAYMENT_CANCELED
        ).length,
        count_error: pagoPaF24.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
            f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_EXPIRED
        ).length,
        count_expired: pagoPaF24.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail === PaymentInfoDetail.PAYMENT_EXPIRED
        ).length,
        count_paid: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.SUCCEEDED).length,
        count_revoked: -1,
        count_unpaid: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.REQUIRED).length,
      });
    }
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
          <Link
            href={cancelledNotificationFAQ}
            onClick={handleTrackNotificationCancelledRefoundInfo}
            target="_blank"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
          >
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
                    handleTrackDownloadF24={handleTrackDownloadF24}
                    handleTrackDownloadF24Success={handleTrackDownloadF24Success}
                    handleTrackDownloadF24Timeout={handleTrackDownloadF24Timeout}
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
                handleTrackDownloadF24={handleTrackDownloadF24}
                handleTrackDownloadF24Success={handleTrackDownloadF24Success}
                handleTrackDownloadF24Timeout={handleTrackDownloadF24Timeout}
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
