import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertColor,
  Button,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { formatEurocentToCurrency, NotificationDetailPayment, PaymentAttachmentSName, PaymentInfoDetail, PaymentStatus } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNotificationPaymentInfo, getPaymentAttachment } from '../../redux/notification/actions';
import { RootState } from '../../redux/store';
import { CHECKOUT_URL, PAYMENT_DISCLAIMER_URL } from '../../utils/constants';

interface Props {
  iun: string;
  notificationPayment: NotificationDetailPayment;
  onDocumentDownload: (url: string) => void;
}

interface PrimaryAction {
  text: string;
  callback: () => void;
};

enum MessageAction {
  COPY_TO_CLIPBOARD = "COPY_TO_CLIPBOARD",
  CONTACT_SUPPORT = "CONTACT_SUPPORT"
};

interface PaymentMessage {
  type: AlertColor;
  body: string | JSX.Element;
  errorCode?: string;
  action?: MessageAction;
};

interface PaymentData {
  title: string;
  amount?: string;
  disclaimer?: JSX.Element;
  message?: PaymentMessage;
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

  useEffect(() => {
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
        setError(() => 'Codice notifica e/o Codice fiscale ente non presenti!');
      }
    };
    fetchPaymentInfo();
    // setTimeout(() => {

    //   fetchPaymentInfo();
    // }, 60000);
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
      window.open(`${CHECKOUT_URL}/${notificationPayment.creditorTaxId}${notificationPayment.noticeCode}`);
    } else if (CHECKOUT_URL) { // do we need to inform the user that NoticeCode and/or creditorTaxId are unavailable and redirect to base checkout url?
      window.open(CHECKOUT_URL);
    }
  };

  const ContactSupport = () => {
    console.log("Contact Support");
  };

  const reloadPage = () => {
    console.log("Contact Support");
  };
  
  const onDocumentClick = (name: PaymentAttachmentSName) => {
    void dispatch(getPaymentAttachment({ iun, attachmentName: name }));
  };

  const onDisclaimerClick = () => {
    window.open(PAYMENT_DISCLAIMER_URL);
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

  // const getMessage = (): { type: AlertColor; body: string | JSX.Element } | null => {
  //   if (error) {
  //     return {
  //       type: 'error',
  //       body: error,
  //     };
  //   }
  //   if (paymentInfo) {
  //     switch (paymentInfo.status) {
  //       case PaymentStatus.REQUIRED:
  //         return requiredStateMessage()
  //       case PaymentStatus.SUCCEEDED:
  //         return {
  //           type: 'success',
  //           body: t('detail.payment.message-completed', { ns: 'notifiche' }),
  //         };
  //       case PaymentStatus.INPROGRESS:
  //         return {
  //           type: 'success',
  //           body: <Trans i18nKey={`detail.payment.message-pending`} ns="notifiche" />,
  //         };
  //       case PaymentStatus.FAILED:
  //         return {
  //           type: 'error',
  //           body: t('detail.payment.message-failed', { ns: 'notifiche' }),
  //         };
  //     }
  //   }
  //   return null;
  // };

  // const title = t('detail.payment.summary', { ns: 'notifiche' });
  // const amount = paymentInfo?.amount ? formatEurocentToCurrency(paymentInfo.amount) : '';

  // const disclaimer = (
  //   <>
  //     {t('detail.payment.disclaimer', { ns: 'notifiche' })}
  //     &nbsp;
  //     <Link to="#" onClick={onDisclaimerClick}>
  //       {t('detail.payment.disclaimer-link', { ns: 'notifiche' })}
  //     </Link>
  //   </>
  // );

  // const message = getMessage();
  // const action = {
  //   text: t('detail.payment.submit', { ns: 'notifiche' }) + (amount ? ' ' + amount.toString() : ''),
  //   callback: onPayClick,
  // };

  // const attachments = getAttachments();

  const title = t('detail.payment.summary', { ns: 'notifiche' });
  const amount = paymentInfo?.amount ? formatEurocentToCurrency(paymentInfo.amount) : undefined;
  
  const disclaimer = amount ? (
    <>
      {t('detail.payment.disclaimer', { ns: 'notifiche' })}
      &nbsp;
      <Link to="#" onClick={onDisclaimerClick}>
        {t('detail.payment.disclaimer-link', { ns: 'notifiche' })}
      </Link>
    </>
  ) : undefined;

  const getPaymentData = (): PaymentData => {
    const data: PaymentData = {
      title,
      amount,
      disclaimer
    };

    if (error) {
      return {
        ...data,
        message: {
          type: 'error',
          body: error
        }
      };
    }

    if (paymentInfo) {
      switch (paymentInfo.status) {
        case PaymentStatus.REQUIRED:
          return {
            ...data,
            action: {
              text: t('detail.payment.submit', { ns: 'notifiche' }) + (amount ? ' ' + amount.toString() : ''),
              callback: onPayClick
            }
          };
        
        case PaymentStatus.SUCCEEDED:
          return {
            ...data,
            message: {
              type: 'success',
              body: t('detail.payment.message-completed', { ns: 'notifiche' }),
            }
          };

        case PaymentStatus.INPROGRESS:
          return {
            ...data,
            message: {
              type: 'info',
              body: t('detail.payment.message-in-progress', { ns: 'notifiche' }),
              action: MessageAction.CONTACT_SUPPORT
            }
          };

        case PaymentStatus.FAILED:
          if(paymentInfo.detail) {
            return getFailedData(data);
          }
      }
    }
    return data;
  };

  const getFailedData = (data: PaymentData): PaymentData => {
    switch(paymentInfo.detail) {
      case PaymentInfoDetail.DOMAIN_UNKNOWN:      // Creditor institution error
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-domain-unknown', { ns: 'notifiche' }),
            errorCode: paymentInfo.errorCode,
            action: MessageAction.COPY_TO_CLIPBOARD
          },
          action: {
            text: t('detail.payment.contact-support', { ns: 'notifiche' }),
            callback: ContactSupport
          }
        };

      case PaymentInfoDetail.PAYMENT_UNAVAILABLE: // Technical Error
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-payment-unavailable', { ns: 'notifiche' }),
            errorCode: paymentInfo.errorCode,
            action: MessageAction.COPY_TO_CLIPBOARD
          },
          action: {
            text: t('detail.payment.contact-support', { ns: 'notifiche' }),
            callback: ContactSupport
          }
        };

      case PaymentInfoDetail.PAYMENT_UNKNOWN:     // Payment data error
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-payment-unknown', { ns: 'notifiche' }),
            errorCode: paymentInfo.errorCode,
            action: MessageAction.COPY_TO_CLIPBOARD
          },
          action: {
            text: t('detail.payment.contact-support', { ns: 'notifiche' }),
            callback: ContactSupport
          }
        };

      case PaymentInfoDetail.GENERIC_ERROR:       // Generic error
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-generic', { ns: 'notifiche' }),
            errorCode: paymentInfo.errorCode,
            action: MessageAction.CONTACT_SUPPORT
          },
          action: {
            text: t('detail.payment.reload-page', { ns: 'notifiche' }),
            callback: reloadPage
          }
        };

      case PaymentInfoDetail.PAYMENT_CANCELED:    // Payment cancelled
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-canceled', { ns: 'notifiche' })
          },
        };

      case PaymentInfoDetail.PAYMENT_EXPIRED:     // Payment expired
        return {
          ...data,
          message: {
            type: 'error',
            body: t('detail.payment.error-expired', { ns: 'notifiche' })
          },
        };
      // case PaymentInfoDetail.PAYMENT_ONGOING:     // Payment on going (already managed using status: IN_PROGRESS)
      // case PaymentInfoDetail.PAYMENT_DUPLICATED:  // Payment duplicated (already managed using status: SUCCEEDED)

      default: return data;
    }
  };

  
  const data = getPaymentData();
  const attachments = getAttachments();

  return (
    <Paper sx={{ padding: '1rem', marginBottom: '1rem' }} className="paperContainer">
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8} lg={8}>
          <Typography variant="h6" display="inline" fontWeight={600} fontSize={24}>
            {data.title}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={4} sx={{ textAlign: 'right' }}>
          <Typography variant="h6" display="inline" fontWeight={600} fontSize={24}>
            {loading ? <Skeleton width={100} height={28} aria-label="loading" sx={{ float: 'right' }} /> : data.amount}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12} sx={{ my: '1rem' }}>
          <Typography variant="body2" display="inline">
            {data.amount && data.disclaimer}
          </Typography>
        </Grid>
        <Box width="100%">
          {data.message && (
            <Alert severity={data.message.type}>
              <Typography variant="body1">{data.message.body}</Typography>
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
        {data.action && (
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
