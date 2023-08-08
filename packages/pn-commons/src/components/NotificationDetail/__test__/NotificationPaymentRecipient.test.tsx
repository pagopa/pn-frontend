import React from 'react';
import { render } from '../../../test-utils';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationDetailTimeline Component', () => {
  it('should render component title and subtitle', () => {
    const result = render(<NotificationPaymentRecipient loading={false} payments={[]} />);
    const title = result.getByTestId('notification-payment-recipient-title');
    const subtitle = result.getByTestId('notification-payment-recipient-subtitle');
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  it('should render component buttons', () => {
    const result = render(<NotificationPaymentRecipient loading={false} payments={[]} />);
    const downloadPagoPANotice = result.getByTestId('download-pagoPA-notice-button');
    const payButton = result.getByTestId('pay-button');
    expect(downloadPagoPANotice).toBeInTheDocument();
    expect(payButton).toBeInTheDocument();
  });
});
