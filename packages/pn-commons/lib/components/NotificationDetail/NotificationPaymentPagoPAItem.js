import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { InfoRounded, Refresh } from '@mui/icons-material';
import { Box, Radio, Skeleton, Typography } from '@mui/material';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import { PaymentInfoDetail, PaymentStatus } from '../../models';
import { formatEurocentToCurrency } from '../../utility';
import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import StatusTooltip from '../Notifications/StatusTooltip';
const SkeletonCard = () => {
    const isMobile = useIsMobile();
    return (_jsxs(Box, { px: 2, py: isMobile ? 2 : 1, gap: 1, display: "flex", alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column-reverse' : 'row', sx: { backgroundColor: '#FAFAFA' }, "data-testid": "skeleton-card", children: [_jsxs(Box, { display: "flex", gap: 1, flexDirection: "column", flex: "1 0 0", children: [_jsx(Skeleton, { variant: "rounded", width: "196px", height: "23px", sx: { ...(isMobile ? { my: 1 } : null), borderRadius: '8px' } }), _jsxs(Box, { lineHeight: "1.4rem", display: "flex", flexDirection: isMobile ? 'column' : 'row', children: [_jsx(Skeleton, { variant: "rounded", width: "79px", height: "15px", sx: { ...(isMobile ? { my: 1 } : { mr: 2 }), borderRadius: '8px' } }), _jsx(Skeleton, { variant: "rounded", width: "160px", height: "15px", sx: { borderRadius: '8px' } })] }), _jsx(Box, { lineHeight: "1.4rem", children: _jsx(Skeleton, { variant: "rounded", width: "137px", height: "15px", sx: { borderRadius: '8px' } }) })] }), _jsxs(Box, { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: isMobile ? 'space-between' : 'flex-end', gap: 1, width: isMobile ? '100%' : 'auto', children: [_jsxs(Box, { display: "flex", flexDirection: "column", gap: 1, justifyContent: "center", alignItems: "flex-start", children: [_jsx(Skeleton, { variant: "rounded", width: "79px", height: "23px", sx: { borderRadius: '8px' } }), _jsx(Skeleton, { variant: "rounded", width: "120px", height: "15px", sx: { borderRadius: '8px' } })] }), _jsx(Box, { display: "flex", justifyContent: "center", children: _jsx(Skeleton, { variant: "circular", width: "22px" }) })] })] }));
};
const NotificationPaymentPagoPAStatusElem = ({ pagoPAItem, isSelected, handleDeselectPayment, isSinglePayment }) => {
    const isMobile = useIsMobile();
    // eslint-disable-next-line functional/no-let
    let color = 'default';
    // eslint-disable-next-line functional/no-let
    let tooltip = 'unknown';
    switch (pagoPAItem.status) {
        case PaymentStatus.SUCCEEDED:
            color = 'success';
            tooltip = 'succeded';
            break;
        case PaymentStatus.FAILED:
            if (pagoPAItem.detail === PaymentInfoDetail.PAYMENT_CANCELED) {
                color = 'warning';
                tooltip = 'canceled';
            }
            else {
                color = 'error';
                tooltip = 'failed';
            }
            break;
        case PaymentStatus.INPROGRESS:
            color = 'info';
            tooltip = 'inprogress';
    }
    return (_jsxs(Box, { display: "flex", flexDirection: "row", justifyContent: isMobile ? 'space-between' : 'flex-end', gap: 1, width: isMobile ? '100%' : 'auto', children: [pagoPAItem.amount && (_jsxs(Box, { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: isMobile ? 'flex-start' : 'flex-end', sx: { mr: pagoPAItem.status === PaymentStatus.SUCCEEDED ? 1 : 0 }, children: [_jsx(Typography, { variant: "h6", color: "primary.main", "data-testid": "payment-amount", children: formatEurocentToCurrency(pagoPAItem.amount) }), pagoPAItem.applyCost && (_jsx(Typography, { fontSize: "0.625rem", fontWeight: "600", lineHeight: "0.875rem", color: "text.secondary", "data-testid": "apply-costs-caption", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.included-costs') }))] })), pagoPAItem.status === PaymentStatus.REQUIRED ? (!isSinglePayment && (_jsx(Box, { display: "flex", justifyContent: "center", children: _jsx(Radio, { "data-testid": "radio-button", checked: isSelected, value: pagoPAItem.noticeCode, onClick: () => isSelected && handleDeselectPayment() }) }))) : (_jsx(StatusTooltip, { label: getLocalizedOrDefaultLabel('notifications', `detail.payment.status.${tooltip}`), color: color, tooltip: getLocalizedOrDefaultLabel('notifications', `detail.payment.status.${tooltip}-tooltip`), tooltipProps: { placement: 'top' }, chipProps: { borderRadius: '6px' } }))] }));
};
const NotificationPaymentPagoPAItem = ({ pagoPAItem, loading, isSelected, handleFetchPaymentsInfo, handleDeselectPayment, isSinglePayment, isCancelled, handleTrackEventDetailPaymentError, }) => {
    const isMobile = useIsMobile();
    if (loading) {
        return _jsx(SkeletonCard, {});
    }
    const isError = pagoPAItem.status === PaymentStatus.FAILED &&
        pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
        pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_EXPIRED;
    if (isError && handleTrackEventDetailPaymentError) {
        handleTrackEventDetailPaymentError();
    }
    const getErrorMessage = () => {
        switch (pagoPAItem.detail) {
            case PaymentInfoDetail.GENERIC_ERROR:
            case PaymentInfoDetail.PAYMENT_DUPLICATED:
                const isGenericError = pagoPAItem.detail === PaymentInfoDetail.GENERIC_ERROR;
                return (_jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, children: [_jsx(InfoRounded, { sx: {
                                color: isGenericError ? 'error.dark' : 'text-primary',
                                width: '16px',
                            } }), _jsx(Typography, { fontSize: "12px", lineHeight: "12px", fontWeight: "600", color: isGenericError ? 'error.dark' : 'text-primary', "data-testid": isGenericError ? 'generic-error-message' : 'payment-duplicated-message', children: isGenericError
                                ? getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.generic-error')
                                : getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.duplicated') })] }));
            case PaymentInfoDetail.PAYMENT_UNAVAILABLE:
            case PaymentInfoDetail.PAYMENT_UNKNOWN:
            case PaymentInfoDetail.DOMAIN_UNKNOWN:
                return (_jsxs(Box, { display: "flex", alignItems: "flex-start", gap: 0.25, children: [_jsx(InfoRounded, { sx: { color: 'error.dark', width: '16px', height: '16px' } }), _jsxs(Box, { display: "flex", flexDirection: "column", "data-testid": "assistence-error-message", children: [_jsx(Typography, { color: "error.dark", fontSize: "12px", lineHeight: "12px", fontWeight: "600", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.notice-error') }), _jsxs(Box, { display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5, children: [_jsxs(Typography, { color: "error.dark", fontSize: "12px", lineHeight: "12px", fontWeight: "600", children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.assistence'), "\u00A0", pagoPAItem.detail_v2] }), _jsx(CopyToClipboardButton, { value: () => pagoPAItem.detail_v2 || '', size: "small", sx: {
                                                '& .MuiSvgIcon-root': {
                                                    width: '16px',
                                                    height: '16px',
                                                },
                                                ml: 0,
                                            } })] })] })] }));
            default:
                return undefined;
        }
    };
    return (_jsxs(Box, { id: `paymentPagoPa-${pagoPAItem.noticeCode}`, px: 2, py: isMobile ? 2 : 1, gap: 1, display: "flex", alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column-reverse' : 'row', sx: {
            backgroundColor: isSelected ? 'rgba(107, 207, 251, 0.08)' : 'grey.50',
            borderRadius: '6px',
        }, children: [_jsxs(Box, { display: "flex", justifyContent: isMobile ? 'flex-start' : 'inherit', gap: 0.5, flexDirection: "column", flex: "1 0 0", children: [pagoPAItem.causaleVersamento && (_jsx(Typography, { variant: "sidenav", color: "text.primary", children: pagoPAItem.causaleVersamento })), _jsxs(Box, { lineHeight: "1.4rem", children: [_jsx(Typography, { variant: "caption", color: "text.secondary", mr: 0.5, children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.notice-code') }), _jsx(Typography, { variant: "caption-semibold", color: "text.secondary", children: pagoPAItem.noticeCode })] }), isCancelled && (_jsxs(Box, { lineHeight: "1.4rem", children: [_jsx(Typography, { variant: "caption", color: "text.secondary", mr: 0.5, children: getLocalizedOrDefaultLabel('notifications', 'detail.creditor-tax-id') }), _jsx(Typography, { variant: "caption-semibold", color: "text.secondary", "data-testid": "creditorTaxId", children: pagoPAItem.creditorTaxId })] })), pagoPAItem.dueDate && (_jsxs(Box, { lineHeight: "1.4rem", children: [_jsx(Typography, { variant: "caption", color: "text.secondary", mr: 0.5, children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.due', 'Scade il') }), _jsx(Typography, { variant: "caption-semibold", color: "text.secondary", children: formatDate(pagoPAItem.dueDate, false) })] })), isError && _jsx(Fragment, { children: getErrorMessage() })] }), isError ? (_jsxs(ButtonNaked, { color: "primary", "data-testid": "reload-button", onClick: handleFetchPaymentsInfo, children: [_jsx(Refresh, { sx: { width: '20px' } }), getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')] })) : (_jsx(NotificationPaymentPagoPAStatusElem, { pagoPAItem: pagoPAItem, isSelected: isSelected, handleDeselectPayment: handleDeselectPayment, isSinglePayment: isSinglePayment }))] }));
};
export default NotificationPaymentPagoPAItem;
