import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { formatEurocentToCurrency, NotificationDetailPayment, PaymentAttachmentSName, PaymentStatus } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNotificationPaymentInfo, getPaymentAttachment } from '../../redux/notification/actions';
import { RootState } from '../../redux/store';
import { CHECKOUT_URL, PAYMENT_DISCLAIMER_URL } from '../../utils/constants';

interface Props {
  iun: string;
  notificationPayment: NotificationDetailPayment;
  onDocumentDownload: (url: string) => void;
}

const NotificationPayment: React.FC<Props> = ({ iun, notificationPayment, onDocumentDownload }) => {
  const { t } = useTranslation(['notifiche']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const paymentInfo = useAppSelector((state: RootState) => state.notificationState.paymentInfo);
  const pagopaAttachmentUrl = useAppSelector((state: RootState) => state.notificationState.pagopaAttachmentUrl);
  const f24AttachmentUrl = useAppSelector((state: RootState) => state.notificationState.f24AttachmentUrl);

  useEffect(() => {
    const fetchPaymentInfo = () => {
      if (notificationPayment.noticeCode && notificationPayment.creditorTaxId) {
        dispatch(getNotificationPaymentInfo({ noticeCode: notificationPayment.noticeCode, taxId: notificationPayment.creditorTaxId }))
          .unwrap()
          .then(() => {
            setLoading(() => false);
            setError(() => '');
          })
          .catch(() => {
            setLoading(() => false);
            setError(() => t('detail.payment.message-network-error', { ns: 'notifiche' }));
          });
      } else {
        setLoading(() => false);
        setError(() => 'Codice notifica e/o Codice fiscale ente non presenti!');
      }
    };

    fetchPaymentInfo();
  }, []);

  useEffect(() => {
    if (pagopaAttachmentUrl) {
      onDocumentDownload(pagopaAttachmentUrl);
    }
  }, [pagopaAttachmentUrl]);

  useEffect(() => {
    if (f24AttachmentUrl) {
      onDocumentDownload(f24AttachmentUrl);
    }
  }, [f24AttachmentUrl]);

  const onPayClick = () => {
    if (CHECKOUT_URL && notificationPayment.noticeCode && notificationPayment.creditorTaxId) {
      window.open(`${CHECKOUT_URL}/${notificationPayment.noticeCode}${notificationPayment.creditorTaxId}`);
    } else if (CHECKOUT_URL) { // do we need to inform the user that NoticeCode and/or creditorTaxId are unavailable and redirect to base checkout url?
      window.open(CHECKOUT_URL);
    }
  };
  
  const onDocumentClick = (name: PaymentAttachmentSName) => {
    void dispatch(getPaymentAttachment({ iun, attachmentName: name }));
  };

  const onDisclaimerClick = () => {
    window.open(PAYMENT_DISCLAIMER_URL);
  };

  const getMessage = (): { type: AlertColor; body: string | JSX.Element } | null => {
    if (error) {
      return {
        type: 'error',
        body: error,
      };
    }
    if (paymentInfo) {
      switch (paymentInfo?.status) {
        case PaymentStatus.SUCCEEDED:
          return {
            type: 'success',
            body: t('detail.payment.message-completed', { ns: 'notifiche' }),
          };
        case PaymentStatus.INPROGRESS:
          return {
            type: 'success',
            body: <Trans i18nKey={`detail.payment.message-pending`} ns="notifiche" />,
          };
        case PaymentStatus.FAILED:
          return {
            type: 'error',
            body: t('detail.payment.message-failed', { ns: 'notifiche' }),
          };
      }
    }
    return null;
  };

  const getAttachments = () => {
    // eslint-disable-next-line functional/no-let
    const attachments = new Array<{ name: PaymentAttachmentSName; title: string }>();

    const pagopaDoc = notificationPayment.pagoPaForm;
    const f24Doc = notificationPayment.f24flatRate || notificationPayment.f24standard;

    if(pagopaDoc) {
      // eslint-disable-next-line functional/immutable-data
      attachments.push({
        name: PaymentAttachmentSName.PAGOPA,
        title: t('detail.payment.download-pagopa-notification', { ns: 'notifiche' })
      });
    }

    if(f24Doc) {
      // eslint-disable-next-line functional/immutable-data
      attachments.push({
        name: PaymentAttachmentSName.F24,
        title: t('detail.payment.download-f24', { ns: 'notifiche' })
      });
    }

    return attachments;
  };

  const title = t('detail.payment.summary', { ns: 'notifiche' });
  const amount = paymentInfo?.amount ? formatEurocentToCurrency(paymentInfo.amount) : '';

  const disclaimer = (
    <>
      {t('detail.payment.disclaimer', { ns: 'notifiche' })}
      &nbsp;
      <Link to="#" onClick={onDisclaimerClick}>
        {t('detail.payment.disclaimer-link', { ns: 'notifiche' })}
      </Link>
    </>
  );

  const message = getMessage();
  const action = {
    text: t('detail.payment.submit', { ns: 'notifiche' }) + (amount ? ' ' + amount.toString() : ''),
    callback: onPayClick,
  };

  const attachments = getAttachments();

  return (
    <Paper sx={{ padding: '1rem', marginBottom: '1rem' }} className="paperContainer">
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8} lg={8}>
          <Typography variant="h6" display="inline" fontWeight={600} fontSize={24}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={4} sx={{ textAlign: 'right' }}>
          <Typography variant="h6" display="inline" fontWeight={600} fontSize={24}>
            {loading ? <CircularProgress size="2rem" aria-label="loading" /> : amount}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
          <Typography variant="body2" display="inline">
            {disclaimer}
          </Typography>
        </Grid>
        <Box width="100%">
          {message && (
            <Alert severity={message?.type}>
              <Typography variant="body1">{message?.body}</Typography>
            </Alert>
          )}
        </Box>
        {loading && (
          <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
            <LoadingButton
              loading={loading}
              variant="contained"
              loadingPosition="end"
              endIcon={<SendIcon />}
              fullWidth
            >
              {t('detail.payment.submit', { ns: 'notifiche' })}
            </LoadingButton>
          </Grid>
        )}
        {(paymentInfo?.status === PaymentStatus.REQUIRED ||
          paymentInfo?.status === PaymentStatus.FAILED) && (
          <>
            <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
              <Button onClick={action.callback} variant="contained" fullWidth>
                {action.text}
              </Button>
            </Grid>
            {attachments.length > 0 && (
              <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
                <Divider>{t('detail.payment.divider-text', { ns: 'notifiche' })}</Divider>
              </Grid>
            )}
            {attachments.map((attachment) => (
              <Grid
                key={attachment.name}
                item
                xs={12}
                lg={12 / attachments.length || 1}
                sx={{ textAlign: 'center', my: '1rem' }}
              >
                <Button
                  name={`download-${attachment.name.toLowerCase()}-notification`}
                  startIcon={<DownloadIcon />}
                  onClick={() => onDocumentClick(attachment.name)}
                >
                  {attachment.title}
                </Button>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default NotificationPayment;
