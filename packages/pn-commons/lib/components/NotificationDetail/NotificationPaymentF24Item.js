import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, InfoRounded } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { downloadDocument, useIsMobile } from '../../hooks';
import { PaymentAttachmentSName } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const NotificationPaymentF24Item = ({ f24Item, timerF24, isPagoPaAttachment = false, getPaymentAttachmentAction, handleTrackDownloadF24, handleTrackDownloadF24Success, handleTrackDownloadF24Timeout, }) => {
    const isMobile = useIsMobile();
    const [maxTimeError, setMaxTimeError] = useState(null);
    const timer = useRef();
    const interval = useRef();
    const action = useRef();
    const [downloadingMessage, setDownloadingMessage] = useState(null);
    const getDownloadF24Status = useCallback(async (f24Item, attempt) => {
        try {
            // eslint-disable-next-line functional/immutable-data
            action.current = getPaymentAttachmentAction(PaymentAttachmentSName.F24, f24Item.attachmentIdx);
            const response = await action.current.unwrap();
            if (response.url) {
                setDownloadingMessage(null);
                handleTrackDownloadF24Success?.();
                downloadDocument(response.url);
                return;
            }
            if (response.retryAfter) {
                if (attempt === 0) {
                    const timeout = Math.min(response.retryAfter, timerF24);
                    // eslint-disable-next-line functional/no-let
                    let step = 0;
                    // eslint-disable-next-line functional/immutable-data
                    interval.current = setInterval(() => {
                        if (step === 0) {
                            setDownloadingMessage('detail.payment.download-f24-waiting');
                            step = 1;
                        }
                        else if (step === 1) {
                            step = 2;
                            setDownloadingMessage('detail.payment.download-f24-ongoing');
                        }
                    }, (timeout - 1000) / 2);
                    // eslint-disable-next-line functional/immutable-data
                    timer.current = setTimeout(() => {
                        clearTimeout(timer.current);
                        clearInterval(interval.current);
                        void getDownloadF24Status(f24Item, 1);
                    }, timeout);
                }
                if (attempt !== 0) {
                    setMaxTimeError('detail.payment.f24-download-error');
                    setDownloadingMessage(null);
                }
            }
        }
        catch (error) {
            setMaxTimeError('detail.payment.f24-download-error');
            if (handleTrackDownloadF24Timeout) {
                handleTrackDownloadF24Timeout();
            }
            setDownloadingMessage(null);
        }
    }, []);
    const downloadF24 = () => {
        setMaxTimeError(null);
        setDownloadingMessage('detail.payment.download-f24-in-progress');
        if (handleTrackDownloadF24) {
            handleTrackDownloadF24();
        }
        void getDownloadF24Status(f24Item, 0);
    };
    useEffect(() => () => {
        action.current?.abort();
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (interval.current) {
            clearInterval(interval.current);
        }
    }, []);
    const getElement = () => {
        if (!downloadingMessage) {
            return (_jsxs(ButtonNaked, { color: "primary", onClick: downloadF24, "data-testid": "download-f24-button", children: [_jsx(Download, { fontSize: "small", sx: { mr: 1 } }), getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')] }));
        }
        return (_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", "data-testid": "f24-download-message", children: getLocalizedOrDefaultLabel('notifications', downloadingMessage) }), _jsx(CircularProgress, { size: "1.125rem", role: "loadingSpinner", sx: { color: 'text.secondary' } })] }));
    };
    return (_jsxs(Box, { py: isPagoPaAttachment ? 0 : 1, px: isPagoPaAttachment ? 0 : 2, display: "flex", alignItems: "center", alignSelf: "stretch", sx: {
            backgroundColor: isPagoPaAttachment ? 'transparent' : 'grey.50',
            borderRadius: '6px',
        }, children: [_jsxs(Box, { display: "flex", justifyContent: isMobile ? 'flex-start' : 'inherit', gap: 0.5, flexDirection: "column", flex: "1 0 0", children: [isPagoPaAttachment ? (_jsx(Typography, { variant: "body2", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.pay-with-f24') })) : (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "sidenav", color: "text.primary", children: f24Item.title }), f24Item.applyCost && (_jsx(Typography, { fontSize: "0.625rem", fontWeight: "600", lineHeight: "0.875rem", color: "text.secondary", "data-testid": "f24-apply-costs-caption", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.included-costs') }))] })), maxTimeError && (_jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, "data-testid": "f24-maxTime-error", children: [_jsx(InfoRounded, { sx: {
                                    color: 'error.dark',
                                    width: '16px',
                                } }), _jsx(Typography, { fontSize: "12px", lineHeight: "12px", fontWeight: "600", color: "error.dark", children: getLocalizedOrDefaultLabel('notifications', maxTimeError) })] }))] }), _jsx(Box, { children: getElement() })] }));
};
export default NotificationPaymentF24Item;
