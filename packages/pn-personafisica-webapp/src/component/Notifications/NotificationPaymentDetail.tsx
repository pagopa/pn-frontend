import { Alert, Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { formatEurocentToCurrency } from "@pagopa-pn/pn-commons";
import { LoadingButton } from "@mui/lab";
import { Trans, useTranslation } from "react-i18next";

export enum PaymentStatus {
  NEW = "NEW",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface PaymentDetail {
  amount: number;
  status: PaymentStatus;
  message?: string;
}

interface Props {
  paymentDetail?: PaymentDetail | null;
}

const NotificationPaymentDetail: React.FC<Props> = ({paymentDetail}) => {
  const { t } = useTranslation([ 'notifiche' ]);

  const handleSubmit = () => {
    console.log("Payment submitted");
  };

  const handleDownloadNotificationDoc = () => {
    console.log("Download notification clicked");
  };

  const handleDownloadF24 = () => {
    console.log("Download notification clicked");
  };

  const getAlertMessage = () => {
    if(paymentDetail) {
      switch(paymentDetail?.status){
        case PaymentStatus.COMPLETED :
          return t('detail.payment.message-completed', { ns: 'notifiche' });
        case PaymentStatus.PENDING :
          return <Trans i18nKey={`detail.payment.message-pending`} ns="notifiche" />;
          // t('detail.payment.message-pending', { ns: 'notifiche' });
          // <Trans i18nKey={`detail.payment.message-pending`} ns="notifiche" />
        case PaymentStatus.FAILED :
          return t('detail.payment.message-failed', { ns: 'notifiche' });
      }
    }
    return "";
  };
  
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="left">
      <Grid item xs={8} lg={8}>
        <Typography variant="body1" display="inline" fontWeight={600} fontSize={24}>
          {t('detail.payment.summary', { ns: 'notifiche' })}
        </Typography>
      </Grid>
      <Grid item xs={4} lg={4} sx={{ textAlign: 'right'}}>
        <Typography variant="body1" display="inline" fontWeight={600} fontSize={24}>
          {paymentDetail ? formatEurocentToCurrency(paymentDetail.amount) : <CircularProgress size="2rem" />}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
        <Typography variant="body2" display="inline">
          {t('detail.payment.disclaimer', { ns: 'notifiche' })}&nbsp;<a href="#">{t('detail.payment.disclaimer-link', { ns: 'notifiche' })}</a>
        </Typography>
      </Grid>
      <Box width="100%">
        {paymentDetail && paymentDetail.status !== PaymentStatus.NEW &&
          <Alert severity={paymentDetail.status === PaymentStatus.FAILED ? "error" : "success"}>
            <Typography variant="body1">{getAlertMessage()}</Typography>
          </Alert>}
      </Box>
      {!paymentDetail &&
      <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
        <LoadingButton
          loading={!paymentDetail}
          variant="contained"
          loadingPosition="end"
          endIcon={<SendIcon />}
          fullWidth
        >
          {t('detail.payment.submit', { ns: 'notifiche' })}
        </LoadingButton>
      </Grid>
      }
      {paymentDetail && (paymentDetail.status === PaymentStatus.NEW || paymentDetail.status === PaymentStatus.FAILED) &&
        <>
        <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
          >
            {t('detail.payment.submit', { ns: 'notifiche' })}{paymentDetail && " ".concat(formatEurocentToCurrency(paymentDetail.amount).toString())}
          </Button>
        </Grid>
        <Grid item xs={12} lg={12} sx={{ my: '1rem'}}>
          <Divider>{t('detail.payment.divider-text', { ns: 'notifiche' })}</Divider>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ textAlign: 'center', my: '1rem'}}>
          <Button name="downloadNotification" startIcon={<DownloadIcon />} onClick={handleDownloadNotificationDoc}>
            {t('detail.payment.download-pagopa-notification', { ns: 'notifiche' })}
          </Button>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ textAlign: 'center', my: '1rem'}}>
          <Button name="downloadNotification" startIcon={<DownloadIcon />} onClick={handleDownloadF24}>
            {t('detail.payment.download-f24', { ns: 'notifiche' })}
          </Button>
        </Grid>
        </>
      }
    </Grid>
  );
};

export default NotificationPaymentDetail;
