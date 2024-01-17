import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { Download } from '@mui/icons-material/';
import { Alert, Box, Button, CircularProgress, Link, RadioGroup, Typography } from '@mui/material';
import { downloadDocument } from '../../hooks';
import { EventPaymentRecipientType, PaymentAttachmentSName, PaymentInfoDetail, PaymentStatus, } from '../../models';
import { formatEurocentToCurrency } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import CustomPagination from '../Pagination/CustomPagination';
import NotificationPaymentF24Item from './NotificationPaymentF24Item';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';
import NotificationPaymentTitle from './NotificationPaymentTitle';
const FAQ_NOTIFICATION_CANCELLED_REFUND = '/faq#notifica-pagata-rimborso';
const getPaymentsStatus = (paginationData, pagoPaF24, f24only) => ({
    page_number: paginationData.page,
    count_payment: pagoPaF24.length + f24only.length,
    count_canceled: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.FAILED &&
        f.pagoPa.detail === PaymentInfoDetail.PAYMENT_CANCELED).length,
    count_error: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.FAILED &&
        f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
        f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_EXPIRED).length,
    count_expired: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.FAILED &&
        f.pagoPa.detail === PaymentInfoDetail.PAYMENT_EXPIRED).length,
    count_paid: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.SUCCEEDED).length,
    count_unpaid: pagoPaF24.filter((f) => f.pagoPa?.status === PaymentStatus.REQUIRED).length,
});
const NotificationPaymentRecipient = ({ payments, isCancelled, timerF24, landingSiteUrl, getPaymentAttachmentAction, onPayClick, handleTrackEvent, handleFetchPaymentsInfo, }) => {
    const { pagoPaF24, f24Only } = payments;
    const [paginationData, setPaginationData] = useState({
        page: 0,
        size: 5,
        totalElements: payments.pagoPaF24.length,
    });
    const cancelledNotificationFAQ = `${landingSiteUrl}${FAQ_NOTIFICATION_CANCELLED_REFUND}`;
    const paginatedPayments = pagoPaF24.slice(paginationData.page * paginationData.size, (paginationData.page + 1) * paginationData.size);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const loadingPaymentTimeout = useRef();
    // calc the overall status of the payments and define variables to show/hide content
    const paymentsStatus = getPaymentsStatus(paginationData, pagoPaF24, f24Only);
    const allPaymentsIsPaid = paymentsStatus.count_paid === pagoPaF24.length;
    const isSinglePayment = paymentsStatus.count_payment === 1 && !isCancelled;
    const handleClick = (event) => {
        const radioSelection = event.target.value;
        setLoadingPayment(true);
        setSelectedPayment(null);
        // eslint-disable-next-line functional/immutable-data
        loadingPaymentTimeout.current = setTimeout(() => {
            setLoadingPayment(false);
            setSelectedPayment(pagoPaF24.find((item) => item.pagoPa?.noticeCode === radioSelection)?.pagoPa || null);
        }, 1000);
    };
    const handleDeselectPayment = () => {
        setLoadingPayment(false);
        setSelectedPayment(null);
        if (loadingPaymentTimeout.current) {
            clearTimeout(loadingPaymentTimeout.current);
        }
    };
    const downloadAttachment = (attachmentName) => {
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
    const handlePaginate = (paginationData) => {
        setPaginationData(paginationData);
        const payments = pagoPaF24.slice(paginationData.page * paginationData.size, (paginationData.page + 1) * paginationData.size);
        handleFetchPaymentsInfo(payments ?? []);
        handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_LIST_CHANGE_PAGE);
    };
    useEffect(() => {
        if (isSinglePayment && paymentsStatus.count_unpaid > 0) {
            setSelectedPayment(pagoPaF24[0].pagoPa ?? null);
        }
        handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_STATUS, paymentsStatus);
    }, [payments]);
    const handleTrackEventFn = (event, param) => {
        if (handleTrackEvent) {
            handleTrackEvent(event, param);
        }
    };
    useEffect(() => () => {
        if (loadingPaymentTimeout.current) {
            clearTimeout(loadingPaymentTimeout.current);
        }
    }, []);
    return (_jsxs(Box, { display: "flex", flexDirection: "column", gap: 2, "data-testid": "paymentInfoBox", children: [_jsx(Typography, { variant: "h6", "data-testid": "notification-payment-recipient-title", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.title') }), isCancelled ? (_jsxs(Alert, { tabIndex: 0, "data-testid": "cancelledAlertPayment", severity: "info", children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.cancelled-message'), "\u00A0", _jsx(Link, { href: cancelledNotificationFAQ, onClick: () => handleTrackEventFn(EventPaymentRecipientType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO), target: "_blank", fontWeight: "bold", sx: { cursor: 'pointer' }, children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.disclaimer-link') })] })) : (_jsx(NotificationPaymentTitle, { landingSiteUrl: landingSiteUrl, handleTrackEventFn: handleTrackEventFn, pagoPaF24: pagoPaF24, f24Only: f24Only, allPaymentsIsPaid: allPaymentsIsPaid })), f24Only.length > 0 && pagoPaF24.length > 0 && (_jsx(Typography, { variant: "overline", mt: 3, children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.pagoPANotices') })), pagoPaF24.length > 0 && (_jsxs(_Fragment, { children: [_jsx(RadioGroup, { name: "radio-buttons-group", value: selectedPayment, onChange: handleClick, children: paginatedPayments.map((payment, index) => payment.pagoPa ? (_jsx(Box, { mb: 2, "data-testid": "pagopa-item", children: _jsx(NotificationPaymentPagoPAItem, { pagoPAItem: payment.pagoPa, loading: payment.isLoading ?? false, isSelected: payment.pagoPa.noticeCode === selectedPayment?.noticeCode, handleFetchPaymentsInfo: () => handleFetchPaymentsInfo([payment]), handleDeselectPayment: handleDeselectPayment, isSinglePayment: isSinglePayment, isCancelled: isCancelled, handleTrackEventDetailPaymentError: () => handleTrackEventFn(EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR) }) }, `payment-${index}`)) : null) }), paginationData.totalElements > paginationData.size && (_jsx(Box, { width: "full", display: "flex", justifyContent: "right", "data-testid": "pagination-box", children: _jsx(CustomPagination, { hideSizeSelector: true, paginationData: paginationData, onPageRequest: handlePaginate, sx: { width: '100%' } }) })), !allPaymentsIsPaid && (_jsxs(Fragment, { children: [_jsxs(Button, { fullWidth: true, variant: "contained", "data-testid": "pay-button", disabled: !selectedPayment && !loadingPayment, onClick: () => onPayClick(selectedPayment?.noticeCode, selectedPayment?.creditorTaxId, selectedPayment?.amount), children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.submit'), "\u00A0", loadingPayment && _jsx(CircularProgress, { size: 18, sx: { ml: 1 }, color: "inherit" }), selectedPayment?.amount ? formatEurocentToCurrency(selectedPayment.amount) : null] }), selectedPayment && selectedPayment?.attachment && (_jsxs(Button, { fullWidth: true, variant: "outlined", "data-testid": "download-pagoPA-notice-button", disabled: !selectedPayment, onClick: () => downloadAttachment(PaymentAttachmentSName.PAGOPA), children: [_jsx(Download, { fontSize: "small", sx: { mr: 1 } }), getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-pagoPA-notice')] })), selectedPayment &&
                                pagoPaF24.find((payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode)
                                    ?.f24 ? (_jsx(Box, { "data-testid": "f24-download", children: _jsx(NotificationPaymentF24Item, { handleTrackDownloadF24: void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD), handleTrackDownloadF24Success: void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_SUCCESS), handleTrackDownloadF24Timeout: void handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_TIMEOUT), f24Item: pagoPaF24.find((payment) => payment.pagoPa?.noticeCode === selectedPayment.noticeCode)?.f24, getPaymentAttachmentAction: getPaymentAttachmentAction, isPagoPaAttachment: true, timerF24: timerF24 }) }, "attachment")) : null] }))] })), !isCancelled && f24Only.length > 0 && (_jsxs(Box, { "data-testid": "f24only-box", children: [f24Only.length > 0 && pagoPaF24.length > 0 && (_jsx(Typography, { variant: "overline", mt: 3, children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.f24Models') })), f24Only.map((f24Item, index) => (_jsx(Box, { mb: 2, children: _jsx(NotificationPaymentF24Item, { f24Item: f24Item, getPaymentAttachmentAction: getPaymentAttachmentAction, handleTrackDownloadF24: () => handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD), handleTrackDownloadF24Success: () => handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_SUCCESS), handleTrackDownloadF24Timeout: () => handleTrackEventFn(EventPaymentRecipientType.SEND_F24_DOWNLOAD_TIMEOUT), timerF24: timerF24 }) }, index)))] }))] }));
};
export default memo(NotificationPaymentRecipient);
