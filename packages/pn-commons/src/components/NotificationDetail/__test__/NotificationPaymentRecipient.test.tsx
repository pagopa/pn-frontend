import React from 'react';
import { fireEvent, render } from '../../../test-utils';
import { populatePaymentHistory } from '../../../utils';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, recipient } from '../../../__mocks__/NotificationDetail.mock';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationPaymentRecipient Component', () => {
  const mappedPayments = populatePaymentHistory(
    recipient.taxId,
    notificationToFe.timeline,
    notificationToFe.recipients,
    paymentInfo
  );

  it('should render component title and subtitle', () => {
    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
      />
    );
    const title = result.getByTestId('notification-payment-recipient-title');
    const subtitle = result.getByTestId('notification-payment-recipient-subtitle');
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  it('should render component buttons and should be disabled', () => {
    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
      />
    );
    const downloadPagoPANotice = result.getByTestId('download-pagoPA-notice-button');
    const payButton = result.getByTestId('pay-button');
    expect(downloadPagoPANotice).toBeInTheDocument();
    expect(payButton).toBeInTheDocument();
    expect(downloadPagoPANotice).toBeDisabled();
    expect(payButton).toBeDisabled();
  });

  it('should remove disable from buttons if there is a checked required payment', () => {
    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
      />
    );
    const downloadPagoPANotice = result.getByTestId('download-pagoPA-notice-button');
    const payButton = result.getByTestId('pay-button');
    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    if (!radioButton) {
      expect(downloadPagoPANotice).toBeDisabled();
      expect(payButton).toBeDisabled();
      return;
    }

    fireEvent.click(radioButton);
    expect(downloadPagoPANotice).not.toBeDisabled();
    expect(payButton).not.toBeDisabled();
  });
});
