import React, { Fragment, memo, useEffect, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, Link, RadioGroup, Typography } from '@mui/material';

import { downloadDocument } from '../../hooks';
import {
  EventPaymentStatusType,
  F24PaymentDetails,
  NotificationDetailPayment,
  PaginationData,
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
import CustomPagination from '../Pagination/CustomPagination';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

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
  handleTrackPaymentStatus?: (paymentStatus: EventPaymentStatusType) => void;
  handleTrackDownloadF24Timeout?: () => void;
  handleFetchPaymentsInfo: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  isCancelled,
  timerF24,
  landingSiteUrl,
  getPaymentAttachmentAction,
  onPayClick,
  handleTrackNotificationCancelledRefoundInfo,
  handleTrackMultipaymentMoreInfo,
  handleTrackDownloadPaymentNotice,
  handleTrackDownloadF24,
  handleTrackDownloadF24Success,
  handleTrackPaymentStatus,
  handleTrackDownloadF24Timeout,
  handleFetchPaymentsInfo,
}) => {
  const { pagoPaF24, f24Only } = payments;
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 0,
    size: 5,
    totalElements: payments.pagoPaF24.length,
  });

  const paginatedPayments = pagoPaF24.slice(
    paginationData.page * paginationData.size,
    (paginationData.page + 1) * paginationData.size
  );

  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;
  const hasRequiredPayment = pagoPaF24.some(
    (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
  );

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

    if (pagoPaF24.length === 1) {
      return (
        <>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.single-payment-subtitle')}
          &nbsp;
          {FaqLink}
        </>
      );
    }

    if (pagoPaF24.length > 1) {
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

  // some of following properties in function getPaymentStatus are set to -1
  // because of still missing features (or not implemented anymore)
  const getPaymentsStatus = (): EventPaymentStatusType => ({
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

  const handlePaginate = (paginationData: PaginationData) => {
    setPaginationData(paginationData);
    const payments = pagoPaF24.slice(
      paginationData.page * paginationData.size,
      (paginationData.page + 1) * paginationData.size
    );
    handleFetchPaymentsInfo(payments ?? []);
  };

  useEffect(() => {
    setSelectedPayment(isSinglePayment && hasRequiredPayment ? pagoPaF24[0].pagoPa ?? null : null);
    if (handleTrackPaymentStatus) {
      handleTrackPaymentStatus(getPaymentsStatus());
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
            {paginatedPayments.map((payment, index) =>
              payment.pagoPa ? (
                <Box mb={2} key={`payment-${index}`} data-testid="pagopa-item">
                  <NotificationPaymentPagoPAItem
                    pagoPAItem={payment.pagoPa}
                    loading={payment.isLoading ?? false}
                    isSelected={payment.pagoPa.noticeCode === selectedPayment?.noticeCode}
                    handleFetchPaymentsInfo={() => handleFetchPaymentsInfo([payment])}
                    handleDeselectPayment={handleDeselectPayment}
                    isSinglePayment={isSinglePayment}
                    isCancelled={isCancelled}
                  />
                </Box>
              ) : null
            )}
          </RadioGroup>

          {paginationData.totalElements > paginationData.size && (
            <Box width="full" display="flex" justifyContent="right" data-testid="pagination-box">
              <CustomPagination
                hideSizeSelector
                paginationData={paginationData}
                onPageRequest={handlePaginate}
                sx={{ width: '100%' }}
              />
            </Box>
          )}

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
            <Box mb={2} key={index}>
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
