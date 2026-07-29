import { isNil } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { Box, Grid, Typography } from '@mui/material';
import {
  PagoPAPaymentFullDetails,
  PaymentAttachmentSName,
  PaymentStatus,
  downloadDocument,
} from '@pagopa-pn/pn-commons';
import { MIBoxedModule, MIButton, MIChip } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../redux/hooks';
import { getSentNotificationPayment } from '../../redux/notification/actions';

type Props = {
  iun: string;
  payment: PagoPAPaymentFullDetails;
};

type StatusVisualInfo = {
  color: 'default' | 'success';
  key: string;
  testId: string;
};

const getStatusVisualInfo = (status?: PaymentStatus): StatusVisualInfo => {
  switch (status) {
    case PaymentStatus.SUCCEEDED:
      return { color: 'success', key: 'succeeded', testId: 'payment-succeeded' };

    case PaymentStatus.REQUIRED:
    default:
      return { color: 'default', key: 'to-pay', testId: 'payment-required' };
  }
};

const NotificationPaymentPagoPa: React.FC<Props> = ({ iun, payment }) => {
  const { t } = useTranslation(['notifiche']);
  const dispatch = useAppDispatch();

  const statusVisualInfo = getStatusVisualInfo(payment.status);

  const downloadHandler = () => {
    if (!isNil(payment.recIndex) && payment.attachment) {
      dispatch(
        getSentNotificationPayment({
          iun,
          attachmentName: PaymentAttachmentSName.PAGOPA,
          recIndex: payment.recIndex,
          attachmentIdx: payment.attachmentIdx,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.url) {
            downloadDocument(res.url);
          }
        })
        .catch(() => {});
    }
  };

  return (
    <MIBoxedModule data-testid="payment-item">
      {payment.attachment ? (
        <Box
          component={MIButton}
          variant="text"
          endIcon={<OpenInBrowserIcon />}
          onClick={downloadHandler}
          size="medium"
          fullWidth
          justifyContent="space-between"
          textAlign="left"
          data-testid="download-pagoPA-notice-button"
          sx={{
            overflowWrap: 'anywhere',
            '& .MuiButton-endIcon svg': {
              fontSize: '24px',
            },
          }}
        >
          <Grid container alignItems="center" columnSpacing={2}>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                {t('detail.notice-code')}
              </Typography>
              &nbsp;
              <Typography variant="caption" fontWeight={600} color="text.primary">
                {payment.noticeCode}
              </Typography>
            </Grid>
            <Grid item>
              <MIChip
                data-testid={statusVisualInfo.testId}
                label={t(`payment.status.${statusVisualInfo.key}`)}
                color={statusVisualInfo.color}
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Grid container alignItems="center" width="100%" columnSpacing={2}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              {t('detail.notice-code')}
            </Typography>
            &nbsp;
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {payment.noticeCode}
            </Typography>
          </Grid>
          <Grid item>
            <MIChip
              data-testid={statusVisualInfo.testId}
              label={t(`payment.status.${statusVisualInfo.key}`)}
              color={statusVisualInfo.color}
            />
          </Grid>
        </Grid>
      )}
    </MIBoxedModule>
  );
};

export default NotificationPaymentPagoPa;
