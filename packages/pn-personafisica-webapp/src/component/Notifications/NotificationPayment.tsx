import { LoadingButton } from '@mui/lab';
import { Alert, AlertColor, Button, Divider, Grid, Link, Paper, Skeleton, SxProps, Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { CopyToClipboard, formatEurocentToCurrency, NotificationDetailPayment, PaymentAttachmentSName, PaymentInfoDetail, PaymentStatus, useIsMobile } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNotificationPaymentInfo, getPaymentAttachment } from '../../redux/notification/actions';
import { RootState } from '../../redux/store';
import { CHECKOUT_URL, PAGOPA_HELP_EMAIL, PAYMENT_DISCLAIMER_URL } from '../../utils/constants';

interface Props {
  iun: string;
  notificationPayment: NotificationDetailPayment;
  onDocumentDownload: (url: string) => void;
}

interface PrimaryAction {
  text: string;
  callback: () => void;
};

enum MessageActionType {
  COPY_TO_CLIPBOARD = "COPY_TO_CLIPBOARD",
  CONTACT_SUPPORT = "CONTACT_SUPPORT"
};

interface PaymentMessageData {
  type: AlertColor;
  body: string | JSX.Element;
  errorCode?: string;
  action?: MessageActionType;
};

interface PaymentData {
  title: string;
  amount?: string;
  disclaimer?: JSX.Element;
  message?: PaymentMessageData;
  action?: PrimaryAction;
}

const NotificationPayment: React.FC<Props> = ({ iun, notificationPayment, onDocumentDownload }) => {
  const { t } = useTranslation(['notifiche']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const paymentInfo = useAppSelector((state: RootState) => state.notificationState.paymentInfo);
  const pagopaAttachmentUrl = useAppSelector((state: RootState) => state.notificationState.pagopaAttachmentUrl);
  const f24AttachmentUrl = useAppSelector((state: RootState) => state.notificationState.f24AttachmentUrl);

  const alertButtonStyle: SxProps<Theme> = useIsMobile()
    ? { textAlign: 'center' }
    : { textAlign: 'center', minWidth: 'max-content' };

  useEffect(() => {
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

  const fetchPaymentInfo = () => {
    if (notificationPayment.noticeCode && notificationPayment.creditorTaxId) {
      dispatch(getNotificationPaymentInfo({ noticeCode: notificationPayment.noticeCode, taxId: notificationPayment.creditorTaxId }))
        .unwrap()
        .then(() => {
          setLoading(() => false);
          setError(() => "");
        })
        .catch(() => {
          setLoading(() => false);
          setError(() => paymentInfo?.detail || t('detail.payment.message-network-error', { ns: 'notifiche' }));
        });
    } else {
      setLoading(() => false);
      setError(() => t('detail.payment.message-missing-parameter', { ns: 'notifiche' }));
    }
  };

  const onPayClick = () => {
    if (CHECKOUT_URL && notificationPayment.noticeCode && notificationPayment.creditorTaxId) {
      window.open(`${CHECKOUT_URL}/${notificationPayment.creditorTaxId}${notificationPayment.noticeCode}`);
    } else if (CHECKOUT_URL) { // do we need to inform the user that NoticeCode and/or creditorTaxId are unavailable and redirect to base checkout url?
      window.open(CHECKOUT_URL);
    }
  };

  const contactSupportClick = () => {
    if (PAGOPA_HELP_EMAIL) {
      window.open(`mailto:${PAGOPA_HELP_EMAIL}`);
    }
  };

  const reloadPage = () => {
    // reset state
    setLoading(() => true);
    setError(() => '');

    // refresh paymentInfo
    fetchPaymentInfo();
  };
  
  const onDocumentClick = (name: PaymentAttachmentSName) => {
    void dispatch(getPaymentAttachment({ iun, attachmentName: name }));
  };

  const onDisclaimerClick = () => {
    window.open(PAYMENT_DISCLAIMER_URL);
  };

  const getAttachmentsData = () => {
    // eslint-disable-next-line functional/no-let
    const attachments = new Array<{ name: PaymentAttachmentSName; title: string }>();
    
    if(paymentInfo?.status === PaymentStatus.REQUIRED) {
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
    }
    return attachments;
  };

  /** composes Payment Data to be rendered */
  const composePaymentData = (): PaymentData => {
    const title = t('detail.payment.summary', { ns: 'notifiche' });

    const amount = paymentInfo?.amount ? formatEurocentToCurrency(paymentInfo.amount) : "";

    const disclaimer = amount ? getDisclaimer() : undefined;

    const message = getMessageData();

    const action = getActionData(amount);

    return {
      title,
      amount,
      disclaimer,
      message,
      action
    };
  };

  /** returns disclaimer JSX */
  const getDisclaimer = (): JSX.Element => (
    <>
      {t('detail.payment.disclaimer', { ns: 'notifiche' })}
      &nbsp;
      <Link href="#" onClick={onDisclaimerClick}>
        {t('detail.payment.disclaimer-link', { ns: 'notifiche' })}
      </Link>
    </>
  );

  /** returns message data to be passed into the alert */
  const getMessageData = (): PaymentMessageData | undefined => {

    if (error) {
      return {
        type: 'error',
        body: error
      };
    }

    if (paymentInfo) {
      switch (paymentInfo.status) {
        case PaymentStatus.SUCCEEDED:
          return {
            type: 'success',
            body: t('detail.payment.message-completed', { ns: 'notifiche' })
          };
        case PaymentStatus.INPROGRESS:
          return {
            type: 'info',
            body: t('detail.payment.message-in-progress', { ns: 'notifiche' }),
            action: MessageActionType.CONTACT_SUPPORT
          };
        case PaymentStatus.FAILED:
          return getFailedMessageData();
      }
    }
    return undefined;
  };

  /** returns message data for failed status */
  const getFailedMessageData = (): PaymentMessageData | undefined => {
    // eslint-disable-next-line functional/no-let
    let body = "";
    // eslint-disable-next-line functional/no-let
    let action: MessageActionType | undefined;

    const errorCode = paymentInfo.detail_v2;

    switch(paymentInfo.detail) {
      case PaymentInfoDetail.DOMAIN_UNKNOWN:      // Creditor institution error
        body = t('detail.payment.error-domain-unknown', { ns: 'notifiche' });
        action = MessageActionType.COPY_TO_CLIPBOARD;
        break;

      case PaymentInfoDetail.PAYMENT_UNAVAILABLE: // Technical Error
        body = t('detail.payment.error-payment-unavailable', { ns: 'notifiche' });
        action = MessageActionType.COPY_TO_CLIPBOARD;
        break;

      case PaymentInfoDetail.PAYMENT_UNKNOWN:     // Payment data error
        body = t('detail.payment.error-payment-unknown', { ns: 'notifiche' });
        action = MessageActionType.COPY_TO_CLIPBOARD;
        break;

      case PaymentInfoDetail.GENERIC_ERROR:       // Generic error
        body = t('detail.payment.error-generic', { ns: 'notifiche' });
        action = MessageActionType.CONTACT_SUPPORT;
        break;

      case PaymentInfoDetail.PAYMENT_CANCELED:    // Payment cancelled
        body = t('detail.payment.error-canceled', { ns: 'notifiche' });
        action = undefined;
        break;

      case PaymentInfoDetail.PAYMENT_EXPIRED:     // Payment expired
        body = t('detail.payment.error-expired', { ns: 'notifiche' });
        action = undefined;
        break;

    }

    return {
      type: 'error' as AlertColor,
      body,
      action,
      errorCode
    };
  };

  /** returns action data used to render the main button */
  const getActionData = (amount: string): PrimaryAction | undefined => {
    switch (paymentInfo?.status) {
      case PaymentStatus.REQUIRED:
        return {
          text: t('detail.payment.submit', { ns: 'notifiche' }) + (amount ? ' ' + amount : ''),
          callback: onPayClick
        };
      case PaymentStatus.FAILED:
        return getFailedActionData();
    }
    return undefined;
  };

  /** returns action data for failed status */
  const getFailedActionData = (): PrimaryAction | undefined => {
    switch(paymentInfo.detail) {
      case PaymentInfoDetail.DOMAIN_UNKNOWN:      // Creditor institution error
      case PaymentInfoDetail.PAYMENT_UNAVAILABLE: // Technical Error
      case PaymentInfoDetail.PAYMENT_UNKNOWN:     // Payment data error
        return {
            text: t('detail.payment.contact-support', { ns: 'notifiche' }),
            callback: contactSupportClick
        };

      case PaymentInfoDetail.GENERIC_ERROR:       // Generic error
        return {
            text: t('detail.payment.reload-page', { ns: 'notifiche' }),
            callback: reloadPage
        };

      default: return undefined;
    }
  };

  /** returns main button JSX  */
  const getMessageAction = (message: PaymentMessageData | undefined) => {
    switch (message?.action) {
      case MessageActionType.CONTACT_SUPPORT:
        return (
          <Button
            component={Link}
            color="primary"
            sx={alertButtonStyle}
            onClick={contactSupportClick}
          >
            {t('detail.payment.contact-support', { ns: 'notifiche' })}
          </Button>
        );
      case MessageActionType.COPY_TO_CLIPBOARD:
        return <CopyToClipboard getValue={() => message.errorCode || ""} text={t('detail.payment.copy-to-clipboard', { ns: 'notifiche' })} />;
      default: return;
    }
  };

  
  const data = composePaymentData();
  const attachments = getAttachmentsData();

  return (
    <Paper sx={{ padding: '24px', marginBottom: '1rem' }} className="paperContainer">
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8} lg={8}>
          <Typography variant="h6" display="inline" fontWeight={600} fontSize={24}>
            {data.title}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={4} sx={{ textAlign: 'right' }}>
          <Typography variant="h6" aria-label={t('detail.payment.amount', { ns: 'notifiche' })} display="inline" fontWeight={600} fontSize={24}>
            {loading ? <Skeleton data-testid="loading-skeleton" width={100} height={28} aria-label="loading" sx={{ float: 'right' }} /> : data.amount}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
          <Typography variant="body2" display="inline">
            {data.amount && data.disclaimer}
          </Typography>
        </Grid>
        <Box width="100%">
          {data.message && (
            <Alert
              severity={data.message.type}
              action={getMessageAction(data.message)}
            >
              <Typography variant="body1">{data.message.body}</Typography>
              <Typography variant="body1" fontWeight="bold">{data.message.errorCode}</Typography>
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
        {!loading && data.action && (
          <>
            <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
              <Button onClick={data.action.callback} variant="contained" fullWidth>
                {data.action.text}
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
