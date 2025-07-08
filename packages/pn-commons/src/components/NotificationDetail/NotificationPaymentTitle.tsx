import { Link, Typography } from '@mui/material';

import { EventPaymentRecipientType, F24PaymentDetails, PaymentDetails } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type Props = {
  landingSiteUrl: string;
  handleTrackEventFn: (event: EventPaymentRecipientType, param?: object) => void;
  pagoPaF24: Array<PaymentDetails>;
  f24Only: Array<F24PaymentDetails>;
  allPaymentsIsPaid: boolean;
  hasMoreThanOnePage: boolean;
};

const NotificationPaymentTitle: React.FC<Props> = ({
  landingSiteUrl,
  handleTrackEventFn,
  pagoPaF24,
  f24Only,
  allPaymentsIsPaid,
  hasMoreThanOnePage,
}) => {
  const FAQ_NOTIFICATION_COSTS = '/faq#costi-di-notifica';
  const notificationCostsFaqLink = `${landingSiteUrl}${FAQ_NOTIFICATION_COSTS}`;

  const FaqLink = (
    <Link
      href={notificationCostsFaqLink}
      onClick={() => handleTrackEventFn(EventPaymentRecipientType.SEND_MULTIPAYMENT_MORE_INFO)}
      target="_blank"
      fontWeight="bold"
      sx={{ cursor: 'pointer' }}
      data-testid="faqNotificationCosts"
    >
      {getLocalizedOrDefaultLabel('notifications', 'detail.payment.how')}
    </Link>
  );

  const noF24AtAll = f24Only.length === 0 && !pagoPaF24.some((item) => item.f24);

  if (noF24AtAll && allPaymentsIsPaid && !hasMoreThanOnePage) {
    return <></>;
  }

  // mixed
  if (pagoPaF24.length > 0 && f24Only.length > 0) {
    return (
      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-mixed')}
        &nbsp;
        {FaqLink}
      </Typography>
    );
  }

  // single payment
  if (pagoPaF24.length === 1 || f24Only.length === 1) {
    return (
      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.single-payment-subtitle')}
        &nbsp;
        {FaqLink}
      </Typography>
    );
  }

  // mixed multipayment
  if (pagoPaF24.length > 1) {
    return (
      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle')}
        &nbsp;
        {FaqLink}
      </Typography>
    );
  }

  // f24 only multipayment
  if (f24Only.length > 1) {
    return (
      <Typography variant="body2" data-testid="notification-payment-recipient-subtitle">
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-f24')}
        &nbsp;
        {FaqLink}
      </Typography>
    );
  }

  return <></>;
};

export default NotificationPaymentTitle;
