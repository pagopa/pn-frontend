import { useTranslation } from 'react-i18next';

import { Paper, Typography } from '@mui/material';
import { NotificationDetailRecipient } from '@pagopa-pn/pn-commons';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
};

const NotificationPaymentSender: React.FC<Props> = ({ recipients }) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="paymentInfoBox">
      <Typography variant="h6">{t('payment.title', { ns: 'notifiche' })}</Typography>
      {recipients.length === 1 && (
        <Typography variant="body2" my={2}>
          {t('payment.subtitle-single', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <Typography variant="body2" my={2}>
          {t('payment.subtitle-multiple', { ns: 'notifiche' })}
        </Typography>
      )}
    </Paper>
  );
};

export default NotificationPaymentSender;
