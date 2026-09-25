import { isNil } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
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
  onDownload?: (payment: PagoPAPaymentFullDetails) => void;
};

type StatusVisualInfo = {
  color: 'default' | 'success';
  key: string;
  testId: string;
};

const getStatusVisualInfo = (status?: PaymentStatus): StatusVisualInfo | undefined => {
  switch (status) {
    case PaymentStatus.SUCCEEDED:
      return { color: 'success', key: 'succeeded', testId: 'payment-succeeded' };

    case PaymentStatus.REQUIRED:
      return { color: 'default', key: 'to-pay', testId: 'payment-required' };
    default:
      return undefined;
  }
};

const NotificationPaymentPagoPa: React.FC<Props> = ({ iun, payment, onDownload }) => {
  const { t } = useTranslation(['notifiche']);
  const dispatch = useAppDispatch();

  const statusVisualInfo = getStatusVisualInfo(payment.status);

  const downloadHandler = () => {
    if (onDownload) {
      onDownload(payment);
      return;
    }

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
          endIcon={<OpenInBrowserRoundedIcon />}
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
          <Grid container alignItems="center" columnSpacing={2} rowSpacing={1}>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                {t('detail.notice-code')}
              </Typography>
              &nbsp;
              <Typography variant="caption" fontWeight={600} color="text.primary">
                {payment.noticeCode}
              </Typography>
            </Grid>
            {statusVisualInfo && (
              <Grid item>
                <MIChip
                  data-testid={statusVisualInfo.testId}
                  label={t(`payment.status.${statusVisualInfo.key}`)}
                  color={statusVisualInfo.color}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      ) : (
        <Grid container alignItems="center" width="100%" columnSpacing={2} rowSpacing={1}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              {t('detail.notice-code')}
            </Typography>
            &nbsp;
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {payment.noticeCode}
            </Typography>
          </Grid>
          {statusVisualInfo && (
            <Grid item>
              <MIChip
                data-testid={statusVisualInfo.testId}
                label={t(`payment.status.${statusVisualInfo.key}`)}
                color={statusVisualInfo.color}
              />
            </Grid>
          )}
        </Grid>
      )}
    </MIBoxedModule>
  );
};

export default NotificationPaymentPagoPa;
