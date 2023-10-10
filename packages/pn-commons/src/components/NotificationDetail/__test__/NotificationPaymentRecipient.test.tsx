import React from 'react';

import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../test-utils';
import {
  PagoPAPaymentFullDetails,
  PaymentAttachmentSName,
  PaymentStatus,
  PaymentsData,
} from '../../../types';
import { getF24Payments, getPagoPaF24Payments } from '../../../utility/notification.utility';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationPaymentRecipient Component', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: getPagoPaF24Payments(payments, 0),
    f24Only: getF24Payments(payments, 0),
  };

  it('should render component title and subtitle', () => {
    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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
      paymentsData.pagoPaF24.filter((payment) => payment.pagoPa).length
    );
  });

  it('should render component buttons and should be disabled', () => {
    const { getByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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
        isCancelled={false}
        handleDownloadAttachment={downloadAttachmentMk}
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
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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
        isCancelled={false}
        handleDownloadAttachment={() => void 0}
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

  it('should show alert if notification is cancelled', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={true}
        handleDownloadAttachment={() => void 0}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const alert = getByTestId('cancelledAlertPayment');
    const subtitle = queryByTestId('notification-payment-recipient-subtitle');

    expect(alert).toBeInTheDocument();
    expect(subtitle).not.toBeInTheDocument();
  });

  it('should call handleDownloadAttachment on download button click', async () => {
    const handleDownloadAttachment = jest.fn();
    const payment: PaymentsData = {
      pagoPaF24: [
        {
          ...paymentsData.pagoPaF24[0],
          pagoPa: {
            ...paymentsData.pagoPaF24[0].pagoPa,
            recIndex: 1,
            attachmentIdx: 1,
          } as PagoPAPaymentFullDetails,
        },
      ],
      f24Only: [],
    };

    const { getByTestId } = render(
      <NotificationPaymentRecipient
        payments={payment}
        isCancelled={false}
        handleDownloadAttachment={handleDownloadAttachment}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const downloadButton = getByTestId('download-pagoPA-notice-button');

    downloadButton.click();

    expect(handleDownloadAttachment).toBeCalledTimes(1);
    expect(handleDownloadAttachment).toHaveBeenCalledWith(
      PaymentAttachmentSName.PAGOPA,
      payment.pagoPaF24[0].pagoPa?.recIndex,
      payment.pagoPaF24[0].pagoPa?.attachmentIdx
    );
  });
});
