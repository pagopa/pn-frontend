import React from 'react';

import { Button } from '@mui/material';

import { PaymentsData } from '../../models';

type Props = {
  payments: PaymentsData;
  iun: string;
};

const NotificationPaymentRecipientTppButton: React.FC<Props> = ({ payments, iun }) => {
  const paymentTpp = payments.tpp?.iun === iun ? payments.tpp : null;

  const onTppPayClick = () => {
    alert('ok');
  };

  if (!paymentTpp) {
    return null;
  }

  return (
    <Button fullWidth variant="contained" data-testid="tpp-pay-button" onClick={onTppPayClick}>
      paga con {paymentTpp.paymentButton} TODO i18n
    </Button>
  );
};

export default NotificationPaymentRecipientTppButton;
