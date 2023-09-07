import React from 'react';

import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../test-utils';
import { PaymentStatus, PaymentsData } from '../../../types';
import { getF24Payments, getPagoPaF24Payments } from '../../../utils/notification.utility';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationPaymentRecipient Component', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: getPagoPaF24Payments(payments),
    f24Only: getF24Payments(payments),
  };

  it('should render component title and subtitle', () => {
    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
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
    expect(pagoPABox).toHaveLength(
      paymentsData.pagoPaF24.filter((payment) => payment.pagoPA).length
    );
  });

  it('should render component buttons and should be disabled', () => {
    const { getByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
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
        payments={paymentsData}
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
        payments={paymentsData}
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
        payments={paymentsData}
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
        payments={paymentsData}
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

  it('Should show enabled pay button and hide radio button if having only one payment', async () => {
    const payment = {
      ...paymentsData,
      pagoPaF24: [
        {
          ...paymentsData.pagoPaF24[0],
          status: PaymentStatus.SUCCEEDED,
        },
      ],
    };

    const result = render(
      <NotificationPaymentRecipient
        payments={payment}
        handleDownloadAttachamentPagoPA={() => void 0}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );

    const payButton = result.getByTestId('pay-button');
    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as HTMLInputElement;

    expect(radioButton).not.toBeInTheDocument();
    expect(payButton).not.toBeDisabled();
  });
});
