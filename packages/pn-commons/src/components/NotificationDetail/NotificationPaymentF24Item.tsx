import { Download, InfoRounded } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { downloadDocument, useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { F24PaymentDetails, PaymentAttachmentSName } from '../../types';

interface Props {
  f24Item: F24PaymentDetails;
  timerF24: number;
  isPagoPaAttachment?: boolean;
  getPaymentAttachmentAction: (
    name: PaymentAttachmentSName,
    attachmentIdx?: number
  ) => Promise<any>;
}

const NotificationPaymentF24Item: React.FC<Props> = ({
  f24Item,
  timerF24,
  isPagoPaAttachment = false,
  getPaymentAttachmentAction,
}) => {
  const isMobile = useIsMobile();
  const [maxTimeError, setMaxTimeError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout>();
  const interval = useRef<NodeJS.Timeout>();

  const [downloadingMessage, setDownloadingMessage] = useState<string | null>(null);

  const getDownloadF24Status = async (f24Item: F24PaymentDetails, attempt: number) => {
    try {
      const response = await getPaymentAttachmentAction(
        PaymentAttachmentSName.F24,
        f24Item.attachmentIdx
      );

      if (response.url) {
        setDownloadingMessage(null);
        downloadDocument(response.url, false);
        return;
      }

      if (response.retryAfter) {
        if (attempt === 0) {
          const timeout = Math.min(response.retryAfter, timerF24);

          // eslint-disable-next-line functional/immutable-data
          interval.current = setInterval(() => {
            if (downloadingMessage === 'detail.payment.download-f24-in-progress') {
              setDownloadingMessage('detail.payment.download-f24-waiting');
            } else if (downloadingMessage === 'detail.payment.download-f24-waiting') {
              setDownloadingMessage('detail.payment.download-f24-ongoing');
            }
          }, timeout / 2 - 1);

          // eslint-disable-next-line functional/immutable-data
          timer.current = setTimeout(() => {
            clearTimeout(timer.current as NodeJS.Timeout);
            clearInterval(interval.current as NodeJS.Timeout);
            void getDownloadF24Status(f24Item, 1);
          }, timeout);
        }

        if (attempt !== 0) {
          setMaxTimeError('detail.payment.f24-download-error');
          setDownloadingMessage(null);
        }
      }
    } catch (error) {
      setMaxTimeError('detail.payment.f24-download-error');
      setDownloadingMessage(null);
    }
  };

  const downloadF24 = () => {
    if (!_.isNil(f24Item.recipientIdx)) {
      setMaxTimeError(null);
      setDownloadingMessage('detail.payment.download-f24-in-progress');
      void getDownloadF24Status(f24Item, 0);
    }
  };

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      if (interval.current) {
        clearInterval(interval.current);
      }
    },
    []
  );

  const getElement = () => {
    if (!downloadingMessage) {
      return (
        <ButtonNaked color="primary" onClick={downloadF24} data-testid="download-f24-button">
          <Download fontSize="small" sx={{ mr: 1 }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
        </ButtonNaked>
      );
    }

    return (
      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
        <Typography variant="caption" color="text.secondary">
          {getLocalizedOrDefaultLabel('notifications', downloadingMessage)}
        </Typography>
        <CircularProgress size="1.125rem" role="loadingSpinner" sx={{ color: 'text.secondary' }} />
      </Box>
    );
  };

  return (
    <Box
      py={isPagoPaAttachment ? 0 : 1}
      px={isPagoPaAttachment ? 0 : 2}
      display="flex"
      alignItems="center"
      alignSelf="stretch"
      sx={{
        backgroundColor: isPagoPaAttachment ? 'transparent' : 'grey.50',
        borderRadius: '6px',
      }}
    >
      <Box
        display="flex"
        justifyContent={isMobile ? 'flex-start' : 'inherit'}
        gap={0.5}
        flexDirection="column"
        flex="1 0 0"
      >
        {isPagoPaAttachment ? (
          <Typography variant="body2">
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.pay-with-f24')}
          </Typography>
        ) : (
          <Typography variant="sidenav" color="text.primary">
            {f24Item.title}
          </Typography>
        )}
        {maxTimeError && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <InfoRounded
              sx={{
                color: 'error.dark',
                width: '16px',
              }}
            />
            <Typography fontSize="12px" lineHeight="12px" fontWeight="600" color="error.dark">
              {getLocalizedOrDefaultLabel('notifications', maxTimeError)}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>{getElement()}</Box>
    </Box>
  );
};

export default NotificationPaymentF24Item;
