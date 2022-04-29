import { LoadingButton } from "@mui/lab";
import { Alert, AlertColor, Button, CircularProgress, Divider, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { formatEurocentToCurrency, NotificationDetail } from "@pagopa-pn/pn-commons";
import { PaymentStatus } from "@pagopa-pn/pn-commons/src/types/NotificationDetail";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getNotificationPaymentInfo } from "../../redux/notification/actions";
import { RootState } from "../../redux/store";
import { CHECKOUT_URL, PAYMENT_DISCLAIMER_URL } from "../../utils/constants";

interface Props {
  notification: NotificationDetail;
  onDocumentDownload: (url: string) => void;
}

const NotificationPayment: React.FC<Props> = ({ notification, onDocumentDownload }) => {
  const { t } = useTranslation([ 'notifiche' ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const paymentDetail = useAppSelector(
    (state: RootState) => state.notificationState.paymentDetail
  );

  useEffect(() => {
    const fetchPaymentInfo = () => {
      if(notification.payment?.iuv) {

        // dispatch(getNotificationPaymentDetails({ iun: notification.iun, recipientId: notification.recipients[0].taxId })).unwrap()
        dispatch(getNotificationPaymentInfo(notification.payment.iuv)).unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError(t('detail.payment.message-network-error', { ns: 'notifiche' }));
        });
      }
    };
    
    // simulating network delay while the service is mocked-up
    setTimeout(async () => {
      fetchPaymentInfo();
    }, 5000);
  }, [notification]);
  
  const onPayClick = () => {
    if(CHECKOUT_URL && notification.payment?.iuv) {
      window.open(CHECKOUT_URL + "/" + notification.payment.iuv);
    }
    else if(CHECKOUT_URL) {
      console.log("UIV not found!");
      setTimeout(() => {
        window.open(CHECKOUT_URL);
      }, 1000);
    }
  };

  const onDisclaimerClick = () => {
    window.open(PAYMENT_DISCLAIMER_URL);
  };

  const getMessage = (): {type: AlertColor; body: string | JSX.Element } | null => {
    if(error) {
      return {
        type: "error",
        body: error
      };
    }
    if(paymentDetail) {
      switch(paymentDetail?.status){
        case PaymentStatus.SUCCEEDED :
          return {
            type: "success",
            body: t('detail.payment.message-completed', { ns: 'notifiche' })
          };
        case PaymentStatus.INPROGRESS :
          return {
            type: "success",
            body: <Trans i18nKey={`detail.payment.message-pending`} ns="notifiche" />
          };
        case PaymentStatus.FAILED :
          return {
            type: "error",
            body: t('detail.payment.message-failed', { ns: 'notifiche' })
          };
      }
    }
    return null;
  };
  // to be fixed once the notification payment model is stable
  const getAttachments = () => {
    const attachments = new Set<{name: string; title: string; url: string}>();

    if(notification.payment && notification.payment.f24){
      const pagopaAttachment = notification.payment.f24.flatRate;
      const f24Attachment = notification.payment.f24.digital;
    
      if(pagopaAttachment) {
        attachments.add({
          name: 'pagopa',
          title: t('detail.payment.download-pagopa-notification', { ns: 'notifiche' }),
          url: pagopaAttachment.digests.sha256
        });
      }
      if(f24Attachment) {
        attachments.add({
          name: 'f24',
          title: t('detail.payment.download-f24', { ns: 'notifiche' }),
          url: f24Attachment.digests.sha256
        });
      }
    }

    return attachments;
  };

  const title = t('detail.payment.summary', { ns: 'notifiche' });
  const amount = paymentDetail.amount ? formatEurocentToCurrency(paymentDetail.amount) : "";
  
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
    text: t('detail.payment.submit', { ns: 'notifiche' }) + (amount ? " " + amount.toString() : ""),
    callback: onPayClick
  };

  const attachments = getAttachments();

  return (
    <Paper sx={{ padding: '1rem', marginBottom: '1rem' }} className="paperContainer">
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={8} lg={8}>
          <Typography variant="body1" display="inline" fontWeight={600} fontSize={24}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={4} sx={{ textAlign: 'right'}}>
          <Typography variant="body1" display="inline" fontWeight={600} fontSize={24}>
            {loading ? <CircularProgress size="2rem" /> : amount }
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
          <Typography variant="body2" display="inline">
            {disclaimer}
          </Typography>
        </Grid>
        <Box width="100%">
          { message &&
            <Alert severity={message?.type}>
              <Typography variant="body1">{message?.body}</Typography>
            </Alert>
          }
        </Box>
        {loading &&
        <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
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
        }
        {(paymentDetail.status === PaymentStatus.REQUIRED || paymentDetail.status === PaymentStatus.FAILED) &&
          <>
          <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
            <Button
              onClick={action.callback}
              variant="contained"
              fullWidth
            >
              {action.text}
            </Button>
          </Grid>
          {attachments.size > 0 &&
          <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
            <Divider>{t('detail.payment.divider-text', { ns: 'notifiche' })}</Divider>
          </Grid>
          }
          {attachments.forEach(attachment => (
            <Grid key={attachment.name} item xs={12} lg={12/attachments.size || 1} sx={{ textAlign: 'center', my: '1rem'}}>
              <Button name="downloadNotification" startIcon={<DownloadIcon />} onClick={() => onDocumentDownload(attachment.url)}>
                {attachment.title}
              </Button>
            </Grid>
          ))}
          </>
        }
      </Grid>
    </Paper>
  );
};

export default NotificationPayment;