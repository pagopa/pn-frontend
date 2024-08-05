import React, { Fragment, memo, useEffect, useRef, useState } from 'react';

import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, CircularProgress, Link, RadioGroup, Typography } from '@mui/material';

import { downloadDocument } from '../../hooks';
import {
  EventPaymentRecipientType,
  NotificationDetailPayment,
  PaginationData,
  PaymentAttachment,
  PaymentAttachmentSName,
  PaymentDetails,
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

  const [selectedPayment, setSelectedPayment] = useState<
    PaymentDetails | { pagoPa: null; f24?: null }
  >({
    pagoPa: null,
  });
  const [loadingPayment, setLoadingPayment] = useState(false);
  const loadingPaymentTimeout = useRef<NodeJS.Timeout>();

  const allPaymentsIsPaid = pagoPaF24.every((f) => f.pagoPa?.status === PaymentStatus.SUCCEEDED);
  const isSinglePayment = pagoPaF24.length === 1 && !isCancelled;
  const hasMoreThenOnePage = paginationData.totalElements > paginationData.size;

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = event.target.value;
    setLoadingPayment(true);
    setSelectedPayment(
      pagoPaF24.find((item) => item.pagoPa?.noticeCode === radioSelection) ?? { pagoPa: null }
    );
    // eslint-disable-next-line functional/immutable-data
    loadingPaymentTimeout.current = setTimeout(() => {
      setLoadingPayment(false);
    }, 1000);
  };

  const handleDeselectPayment = () => {
    setLoadingPayment(false);
    setSelectedPayment({ pagoPa: null });
    if (loadingPaymentTimeout.current) {
      clearTimeout(loadingPaymentTimeout.current);
    }
  };

  const downloadAttachment = (attachmentName: PaymentAttachmentSName) => {
    if (selectedPayment?.pagoPa) {
      handleTrackEventFn(EventPaymentRecipientType.SEND_DOWNLOAD_PAYMENT_NOTICE);
      void getPaymentAttachmentAction(attachmentName, selectedPayment.pagoPa.attachmentIdx)
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
      setSelectedPayment(pagoPaF24[0] ?? { pagoPa: null });
    }
    // track event only if payments are changed and there aren't in loading state
    const paymentsLoaded = paginatedPayments.every((payment) => !payment.isLoading);
    if (paymentsLoaded) {
      // the tracked event wants only the status of the current paged payments
      handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_STATUS, {
        paginationData,
        paginatedPayments,
      });
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
        <Alert data-testid="cancelledAlertPayment" severity="info">
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
          <RadioGroup
            name="radio-buttons-group"
            value={selectedPayment?.pagoPa}
            onChange={handleClick}
          >
            {paginatedPayments.map((payment) =>
              payment.pagoPa ? (
                <Box
                  mb={2}
                  key={`payment-${payment.pagoPa.noticeCode}-${payment.pagoPa.creditorTaxId}`}
                  data-testid="pagopa-item"
                >
                  <NotificationPaymentPagoPAItem
                    pagoPAItem={payment.pagoPa}
                    loading={payment.isLoading ?? false}
                    isSelected={payment.pagoPa.noticeCode === selectedPayment?.pagoPa?.noticeCode}
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
                disabled={!selectedPayment?.pagoPa && !loadingPayment}
                onClick={() =>
                  onPayClick(
                    selectedPayment?.pagoPa?.noticeCode,
                    selectedPayment?.pagoPa?.creditorTaxId,
                    selectedPayment?.pagoPa?.amount
                  )
                }
              >
                {getLocalizedOrDefaultLabel('notifications', 'detail.payment.submit')}
                &nbsp;
                {loadingPayment && <CircularProgress size={18} sx={{ ml: 1 }} color="inherit" />}
                {!loadingPayment && selectedPayment?.pagoPa?.amount
                  ? formatEurocentToCurrency(selectedPayment.pagoPa?.amount)
                  : null}
              </Button>
              {!loadingPayment && selectedPayment?.pagoPa?.attachment && (
                <Button
                  fullWidth
                  variant="outlined"
                  data-testid="download-pagoPA-notice-button"
                  disabled={!selectedPayment.pagoPa}
                  onClick={() => downloadAttachment(PaymentAttachmentSName.PAGOPA)}
                >
                  <Download fontSize="small" sx={{ mr: 1 }} />
                  {getLocalizedOrDefaultLabel(
                    'notifications',
                    'detail.payment.download-pagoPA-notice'
                  )}
                </Button>
              )}
              {selectedPayment?.f24 ? (
                <Box key="attachment" data-testid="f24-download">
                  <NotificationPaymentF24Item
                    f24Item={selectedPayment?.f24}
                    getPaymentAttachmentAction={getPaymentAttachmentAction}
                    isPagoPaAttachment
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
