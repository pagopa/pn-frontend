import React from 'react';

import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, recipient } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../test-utils';
import { populatePaymentHistory } from '../../../utils';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationPaymentRecipient Component', () => {
  const mappedPayments = populatePaymentHistory(
    recipient.taxId,
    notificationToFe.timeline,
    notificationToFe.recipients,
    paymentInfo
  );

  it('should render component title and subtitle', () => {
    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const title = getByTestId('notification-payment-recipient-title');
    const subtitle = getByTestId('notification-payment-recipient-subtitle');
    const f24Download = queryByTestId('f24-download');
    const pagoPABox = queryAllByTestId('pagopa-item');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('detail.payment.title');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('detail.payment.subtitle');
    expect(f24Download).not.toBeInTheDocument();
    expect(pagoPABox).toHaveLength(mappedPayments.filter((payment) => payment.pagoPA).length);
  });

  it('should render component buttons and should be disabled', () => {
    const { getByTestId } = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const downloadPagoPANotice = getByTestId('download-pagoPA-notice-button');
    const payButton = getByTestId('pay-button');
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
        handleReloadPayment={() => void 0}
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

  it('should dispatch action on pay button click', async () => {
    const payClickMk = jest.fn();

    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={payClickMk}
        handleReloadPayment={() => void 0}
      />
    );

    const payButton = result.getByTestId('pay-button');
    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as HTMLInputElement;

    if (!radioButton) return;

    fireEvent.click(radioButton);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(payClickMk).toBeCalledTimes(1);
    });
  });

  it('should dispatch action on download pagoPA notice button click', async () => {
    const downloadAttachmentMk = jest.fn();

    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={downloadAttachmentMk}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );

    const downloadButton = result.getByTestId('download-pagoPA-notice-button');
    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as HTMLInputElement;

    if (!radioButton) return;

    fireEvent.click(radioButton);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(downloadAttachmentMk).toBeCalledTimes(1);
    });
  });

  it('Should disable pay button when deselect a payment', () => {
    const result = render(
      <NotificationPaymentRecipient
        loading={false}
        payments={mappedPayments}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );

    const payButton = result.getByTestId('pay-button');
    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as HTMLInputElement;

    if (!radioButton) return;

    fireEvent.click(radioButton);
    expect(payButton).not.toBeDisabled();

    fireEvent.click(radioButton);
    expect(payButton).toBeDisabled();
  });
});
