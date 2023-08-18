import { useTranslation } from 'react-i18next';

import { Chip, Grid, Typography } from '@mui/material';
import {
  PagoPAPaymentHistory,
  PaymentAttachmentSName,
  PaymentStatus,
  downloadDocument,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../../redux/hooks';
import { getPaymentAttachment } from '../../../redux/notification/actions';
import { TrackEventType } from '../../../utils/events';
import { trackEventByType } from '../../../utils/mixpanel';

type Props = {
  iun: string;
  payment: PagoPAPaymentHistory;
};

const NotificationPaymentPagoPa: React.FC<Props> = ({ iun, payment }) => {
  const { t } = useTranslation(['notifiche']);
  const dispatch = useAppDispatch();

  // TODO: l'api di apgamento non è corretta perchè prevede solo il caso in cui si abbia un solo pagamento
  const dowloadHandler = () => {
    trackEventByType(TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE);
    dispatch(getPaymentAttachment({ iun, attachmentName: PaymentAttachmentSName.PAGOPA }))
      .unwrap()
      .then((res) => {
        if (res.url) {
          downloadDocument(res.url);
        }
      })
      .catch(() => {});
  };

  return (
    <Grid
      py={1}
      px={2}
      mt={1}
      sx={{ borderRadius: '6px', backgroundColor: '#FAFAFA' }}
      container
      alignItems="center"
      data-testid="payment-item"
    >
      <Grid item xs>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            {t('detail.notice-code')}
          </Typography>
          &nbsp;
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            {payment.noticeCode}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ButtonNaked color="primary" onClick={dowloadHandler}>
            {t('payment.pagopa-notice')}
          </ButtonNaked>
        </Grid>
      </Grid>
      {payment.status === PaymentStatus.SUCCEEDED && (
        <Grid item xs="auto">
          <Chip
            data-testid="payment-succeded"
            label={t('payment.paid')}
            color="success"
            sx={{ borderRadius: '4px' }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default NotificationPaymentPagoPa;
