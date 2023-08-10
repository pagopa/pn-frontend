import { Download } from '@mui/icons-material/';
import { Box, Button, Link, RadioGroup, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import React, { memo, useState } from 'react';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { PaymentHistory } from '../../types';
import { formatCurrency } from '../../utils';
import NotificationPaymentPagoPAItem from './NotificationPaymentPagoPAItem';

type Props = {
  loading: boolean;
  payments: Array<PaymentHistory>;
};

const NotificationPaymentRecipient: React.FC<Props> = ({ loading, payments }) => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = (event.target as HTMLInputElement).value;
    setSelectedPayment(JSON.parse(radioSelection));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" data-testid="notification-payment-recipient-title">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.title', 'Pagamento')}
      </Typography>
      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getLocalizedOrDefaultLabel(
          'notifications',
          'detail.payment.subtitle',
          'In questa notifica ci sono più avvisi di pagamento: seleziona quello che vuoi pagare. Alcuni avvisi includono i costi di notifica.'
        )}
        &nbsp;
        <Link href={void 0} target="_blank" fontWeight="bold" sx={{ cursor: 'pointer' }}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how', 'Come mai?')}
        </Link>
      </Typography>

      <Box>
        <RadioGroup name="radio-buttons-group" onChange={handleChange}>
          {payments.map((payment, index) =>
            payment.pagoPA ? (
              <Box mb={2} key={index}>
                <NotificationPaymentPagoPAItem
                  pagoPAItem={payment.pagoPA}
                  loading={loading}
                  isSelected={payment.pagoPA.noticeCode === selectedPayment?.noticeCode}
                />
              </Box>
            ) : null
          )}
        </RadioGroup>
      </Box>

      <Button fullWidth variant="contained" data-testid="pay-button" disabled={!selectedPayment}>
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.submit', 'Paga')}
        &nbsp;
        {selectedPayment && selectedPayment.amount ? formatCurrency(selectedPayment.amount) : null}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        data-testid="download-pagoPA-notice-button"
        disabled={!selectedPayment}
      >
        <Download fontSize="small" sx={{ mr: 1 }} />
        {getLocalizedOrDefaultLabel(
          'notifications',
          'detail.payment.download-pagoPA-notice',
          'Scarica avviso PagoPA'
        )}
      </Button>

      {selectedPayment &&
      payments.find((payment) => payment.pagoPA?.noticeCode === selectedPayment.noticeCode)
        ?.f24Data ? (
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">
            {getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.pay-with-f24',
              'Se preferisci, puoi pagare tramite F24.'
            )}
          </Typography>
          <ButtonNaked color="primary">
            <Download fontSize="small" sx={{ mr: 1 }} />
            {getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.download-f24',
              'Scarica F24'
            )}
          </ButtonNaked>
        </Box>
      ) : null}
    </Box>
  );
};

export default memo(NotificationPaymentRecipient);
