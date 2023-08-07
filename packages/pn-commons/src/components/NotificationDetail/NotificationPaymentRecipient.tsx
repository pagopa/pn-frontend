import { Download } from '@mui/icons-material/';
import { Button, Link, Typography } from '@mui/material';
import React, { Fragment, memo } from 'react';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { PaymentHistory } from '../../types';

type Props = {
  loading: boolean;
  payments: Array<PaymentHistory>;
};

const NotificationPaymentRecipient: React.FC<Props> = ({ loading }) => {
  console.log(loading);
  return (
    <Fragment>
      <Typography variant="h6">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.title', 'Pagamento')}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {getLocalizedOrDefaultLabel(
          'notifications',
          'detail.payment.subtitle',
          'In questa notifica ci sono più avvisi di pagamento: seleziona quello che vuoi pagare. Alcuni avvisi includono i costi di notifica.'
        )}{' '}
        <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how', 'Come mai?')}
        </Link>
      </Typography>

      <Button fullWidth variant="contained" sx={{ mt: 2 }}>
        Paga
      </Button>

      <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
        <Download fontSize={'small'} sx={{ marginRight: 1 }} />
        {getLocalizedOrDefaultLabel(
          'notifications',
          'detail.payment.download-pagoPA-notice',
          'Scarica avviso PagoPA'
        )}
      </Button>
    </Fragment>
  );
};

export default memo(NotificationPaymentRecipient);
