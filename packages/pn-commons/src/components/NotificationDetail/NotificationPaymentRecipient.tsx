import React, { Fragment, memo, useEffect, useRef, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, CircularProgress, Link, RadioGroup, Typography } from '@mui/material';

import { downloadDocument } from '../../hooks';
import {
  EventPaymentRecipientType,
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
import { getPaymentCache, setPaymentCache } from '../../utility/paymentCaching.utility';
import CustomPagination from '../Pagination/CustomPagination';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';
import NotificationPaymentTitle from './NotificationPaymentTitle';

const FAQ_NOTIFICATION_CANCELLED_REFUND = '/faq#notifica-pagata-rimborso';

const getPaymentsStatus = (
  paginationData: PaginationData,
  pagoPaF24: Array<PaymentDetails>
): EventPaymentStatusType => ({
  page_number: paginationData.page,
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
  count_unpaid: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.REQUIRED).length,
});

type Props = {
  payments: PaymentsData;
  isCancelled: boolean;
  timerF24: number;
  landingSiteUrl: string;
  iun: string;
  getPaymentAttachmentAction: (
    name: PaymentAttachmentSName,
    attachmentIdx?: number
  ) => {
    abort: (reason?: string) => void;
    unwrap: () => Promise<PaymentAttachment>;
  };
  onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
  handleTrackEvent?: (event: EventPaymentRecipientType, param?: object) => void;
  handleFetchPaymentsInfo: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};

const NotificationPaymentRecipient: React.FC<Props> = ({
  payments,
  isCancelled,
  timerF24,
  landingSiteUrl,
  iun,
  getPaymentAttachmentAction,
  onPayClick,
  handleTrackEvent,
  handleFetchPaymentsInfo,
}) => {
  const { pagoPaF24, f24Only } = payments;
  const pageFromCache = getPaymentCache(iun)?.currentPaymentPage;
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: pageFromCache ?? 0,
    size: 5,
    totalElements: payments.pagoPaF24.length,
  });
  const cancelledNotificationFAQ = `${landingSiteUrl}${FAQ_NOTIFICATION_CANCELLED_REFUND}`;
  const [areOtherDowloading, setAreOtherDowloading] = useState(false);

  const paginatedPayments = pagoPaF24.slice(
    paginationData.page * paginationData.size,
    (paginationData.page + 1) * paginationData.size
  );

  const [selectedPayment, setSelectedPayment] = useState<PagoPAPaymentFullDetails | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const loadingPaymentTimeout = useRef<NodeJS.Timeout>();

  const allPaymentsIsPaid = pagoPaF24.every((f) => f.pagoPa?.status === PaymentStatus.SUCCEEDED);
  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;
  const hasMoreThenOnePage = paginationData.totalElements > paginationData.size;

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = event.target.value;
    setLoadingPayment(true);
    setSelectedPayment(null);
    // eslint-disable-next-line functional/immutable-data
    loadingPaymentTimeout.current = setTimeout(() => {
      setLoadingPayment(false);
      setSelectedPayment(
        pagoPaF24.find((item) => item.pagoPa?.noticeCode === radioSelection)?.pagoPa || null
      );
    }, 1000);
  };

  const handleDeselectPayment = () => {
    setLoadingPayment(false);
    setSelectedPayment(null);
    if (loadingPaymentTimeout.current) {
      clearTimeout(loadingPaymentTimeout.current);
    }
  };

  const downloadAttachment = (attachmentName: PaymentAttachmentSName) => {
    if (selectedPayment) {
      handleTrackEventFn(EventPaymentRecipientType.SEND_DOWNLOAD_PAYMENT_NOTICE);
      void getPaymentAttachmentAction(attachmentName, selectedPayment.attachmentIdx)
        .unwrap()
        .then((response) => {
          if (response.url) {
            downloadDocument(response.url);
          }
        });
    }
  };

  const handlePaginate = (pageData: PaginationData) => {
    setPaginationData(pageData);
    const paginatedPayments = pagoPaF24.slice(
      pageData.page * pageData.size,
      (pageData.page + 1) * pageData.size
    );
    setPaymentCache({ currentPaymentPage: pageData.page }, iun);
    handleFetchPaymentsInfo(paginatedPayments ?? []);
    handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_LIST_CHANGE_PAGE);
  };

  useEffect(() => {
    const unpaidPayments = pagoPaF24.some((f) => f.pagoPa?.status === PaymentStatus.REQUIRED);
    if (isSinglePayment && unpaidPayments) {
      setSelectedPayment(pagoPaF24[0].pagoPa ?? null);
    }
    // track event only if payments are changed and there aren't in loading state
    const paymentsLoaded = paginatedPayments.every((payment) => !payment.isLoading);
    if (paymentsLoaded) {
      // the tracked event wants only the status of the current paged payments
      const pagePaymentsStatus = getPaymentsStatus(paginationData, paginatedPayments);
      handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_STATUS, pagePaymentsStatus);
    }
  }, [payments]);

  const handleTrackEventFn = (event: EventPaymentRecipientType, param?: object) => {
    if (handleTrackEvent) {
      handleTrackEvent(event, param);
    }
  };

  useEffect(
    () => () => {
      if (loadingPaymentTimeout.current) {
        clearTimeout(loadingPaymentTimeout.current);
      }
    },
    []
  );

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
            onClick={() =>
              handleTrackEventFn(EventPaymentRecipientType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO)
            }
            target="_blank"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
          >
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.disclaimer-link')}
          </Link>
        </Alert>
      ) : (
        <NotificationPaymentTitle
          landingSiteUrl={landingSiteUrl}
          handleTrackEventFn={handleTrackEventFn}
          pagoPaF24={pagoPaF24}
          f24Only={f24Only}
          allPaymentsIsPaid={allPaymentsIsPaid}
          hasMoreThenOnePage={hasMoreThenOnePage}
        />
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
                    handleTrackEventDetailPaymentError={handleTrackEventFn}
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
                disabled={!selectedPayment && !loadingPayment}
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
                {loadingPayment && <CircularProgress size={18} sx={{ ml: 1 }} color="inherit" />}
                {selectedPayment?.amount ? formatEurocentToCurrency(selectedPayment.amount) : null}
              </Button>
              {selectedPayment?.attachment && (
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
              )}
              {selectedPayment &&
              pagoPaF24.find((payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode)
                ?.f24 ? (
                <Box key="attachment" data-testid="f24-download">
                  <NotificationPaymentF24Item
                    handleTrackDownloadF24={
                      void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD)
                    }
                    handleTrackDownloadF24Success={() =>
                      void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_SUCCESS)
                    }
                    handleTrackDownloadF24Timeout={() =>
                      void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_TIMEOUT)
                    }
                    f24Item={
                      pagoPaF24.find(
                        (payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode
                      )?.f24 as F24PaymentDetails
                    }
                    getPaymentAttachmentAction={getPaymentAttachmentAction}
                    isPagoPaAttachment
                    timerF24={timerF24}
                    disableDownload={areOtherDowloading}
                    handleDownload={setAreOtherDowloading}
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
                handleTrackDownloadF24={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD)
                }
                handleTrackDownloadF24Success={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_SUCCESS)
                }
                handleTrackDownloadF24Timeout={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_TIMEOUT)
                }
                timerF24={timerF24}
                disableDownload={areOtherDowloading}
                handleDownload={setAreOtherDowloading}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
