import { useCallback, useEffect, useRef, useState } from 'react';

import { Download, InfoRounded } from '@mui/icons-material';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { downloadDocument } from '../../hooks/useDownloadDocument';
import {
  F24PaymentDetails,
  PaymentAttachment,
  PaymentAttachmentSName,
} from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type Props = {
  f24Item: F24PaymentDetails;
  timerF24: number;
  isPagoPaAttachment?: boolean;
  getPaymentAttachmentAction: (
    name: PaymentAttachmentSName,
    attachmentIdx?: number
  ) => {
    abort: (reason?: string) => void;
    unwrap: () => Promise<PaymentAttachment>;
  };
  handleTrackDownloadF24?: () => void;
  handleTrackDownloadF24Success?: () => void;
  handleTrackDownloadF24Timeout?: () => void;
  disableDownload: boolean;
  handleDownload: (param: boolean) => any;
};

const NotificationPaymentF24Item: React.FC<Props> = ({
  f24Item,
  timerF24,
  isPagoPaAttachment = false,
  getPaymentAttachmentAction,
  handleTrackDownloadF24,
  handleTrackDownloadF24Success,
  handleTrackDownloadF24Timeout,
  disableDownload,
  handleDownload,
}) => {
  const [maxTimeError, setMaxTimeError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout>();
  const interval = useRef<NodeJS.Timeout>();
  const action = useRef<{
    abort: (reason?: string) => void;
    unwrap: () => Promise<PaymentAttachment>;
  }>();

  const [downloadingMessage, setDownloadingMessage] = useState<string | null>(null);

  const getDownloadF24Status = useCallback(async (f24Item: F24PaymentDetails, attempt: number) => {
    try {
      // eslint-disable-next-line functional/immutable-data
      action.current = getPaymentAttachmentAction(
        PaymentAttachmentSName.F24,
        f24Item.attachmentIdx
      );
      const response = await action.current.unwrap();

      if (response.url) {
        setDownloadingMessage(null);
        handleDownload(false);
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
            } else if (step === 1) {
              step = 2;
              setDownloadingMessage('detail.payment.download-f24-ongoing');
            }
          }, (timeout - 1000) / 2);

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
          handleDownload(false);
        }
      }
    } catch (error) {
      setMaxTimeError('detail.payment.f24-download-error');

      if (handleTrackDownloadF24Timeout) {
        handleTrackDownloadF24Timeout();
      }
      setDownloadingMessage(null);
      handleDownload(false);
    }
  }, []);

  const downloadF24 = () => {
    if (disableDownload) {
      return;
    }
    handleDownload(true);
    setMaxTimeError(null);
    setDownloadingMessage('detail.payment.download-f24-in-progress');
    if (handleTrackDownloadF24) {
      handleTrackDownloadF24();
    }
    void getDownloadF24Status(f24Item, 0);
  };

  useEffect(
    () => () => {
      action.current?.abort();
      if (timer.current) {
        // eslint-disable-next-line functional/immutable-data
        timer.current = undefined;
        clearTimeout(timer.current);
      }
      if (interval.current) {
        // eslint-disable-next-line functional/immutable-data
        interval.current = undefined;
        clearInterval(interval.current);
      }
    },
    []
  );

  const getElement = () => {
    if (!downloadingMessage) {
      return (
        <ButtonNaked
          color="primary"
          onClick={downloadF24}
          disabled={disableDownload}
          data-testid="download-f24-button"
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          <Download fontSize="small" sx={{ mr: 0.5 }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
        </ButtonNaked>
      );
    }

    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={0.5}
        direction="row"
        sx={{ mt: { xs: 1, sm: 0 } }}
      >
        <Typography variant="caption" color="text.secondary" data-testid="f24-download-message">
          {getLocalizedOrDefaultLabel('notifications', downloadingMessage)}
        </Typography>
        <CircularProgress size="1.125rem" role="loadingSpinner" sx={{ color: 'text.secondary' }} />
      </Stack>
    );
  };

  return (
    <Stack
      py={isPagoPaAttachment ? 0 : 1}
      px={isPagoPaAttachment ? 0 : 2}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        backgroundColor: isPagoPaAttachment ? 'transparent' : 'grey.50',
        borderRadius: '6px',
      }}
      spacing={1}
    >
      <Stack
        justifyContent={{ xs: 'flex-start', sm: 'inherit' }}
        gap={0.5}
        direction="column"
        flexGrow="1"
      >
        {isPagoPaAttachment ? (
          <Typography variant="body2">
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.pay-with-f24')}
          </Typography>
        ) : (
          <>
            <Typography variant="sidenav" color="text.primary" sx={{ overflowWrap: 'anywhere' }}>
              {f24Item.title}
            </Typography>
            {f24Item.applyCost && (
              <Typography
                fontSize="0.625rem"
                fontWeight="600"
                lineHeight="0.875rem"
                color="text.secondary"
                data-testid="f24-apply-costs-caption"
              >
                {getLocalizedOrDefaultLabel('notifications', 'detail.payment.included-costs')}
              </Typography>
            )}
          </>
        )}
        {maxTimeError && (
          <Stack
            direction="row"
            alignItems={{ xs: 'center' }}
            gap={0.5}
            data-testid="f24-maxTime-error"
          >
            <InfoRounded
              sx={{
                color: 'error.dark',
                width: '16px',
              }}
            />
            <Typography fontSize="12px" lineHeight="12px" fontWeight="600" color="error.dark">
              {getLocalizedOrDefaultLabel('notifications', maxTimeError)}
            </Typography>
          </Stack>
        )}
      </Stack>
      {getElement()}
    </Stack>
  );
};

export default NotificationPaymentF24Item;
