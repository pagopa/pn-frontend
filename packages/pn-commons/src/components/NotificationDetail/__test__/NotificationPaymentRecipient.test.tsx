import React from 'react';

import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, payments } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../test-utils';
import { PaymentAttachmentSName, PaymentStatus, PaymentsData } from '../../../types';
import {
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '../../../utility/notification.utility';
import NotificationPaymentRecipient from '../NotificationPaymentRecipient';

describe('NotificationPaymentRecipient Component', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      getPagoPaF24Payments(payments, 0),
      paymentInfo
    ),
    f24Only: getF24Payments(payments, 0),
  };

  const F24TIMER = 15000;

  it('should render component', () => {
    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={jest.fn()}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const title = getByTestId('notification-payment-recipient-title');
    const subtitle = getByTestId('notification-payment-recipient-subtitle');
    const f24Download = queryByTestId('f24-download');
    const pagoPABox = queryAllByTestId('pagopa-item');
    const downloadPagoPANotice = getByTestId('download-pagoPA-notice-button');
    const payButton = getByTestId('pay-button');
    const f24OnlyBox = getByTestId('f24only-box');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('detail.payment.title');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('detail.payment.subtitle');
    expect(f24Download).not.toBeInTheDocument();
    expect(pagoPABox).toHaveLength(
      paymentsData.pagoPaF24.filter((payment) => payment.pagoPa).length
    );
    expect(downloadPagoPANotice).toBeInTheDocument();
    expect(payButton).toBeInTheDocument();
    expect(downloadPagoPANotice).toBeDisabled();
    expect(payButton).toBeDisabled();
    expect(f24OnlyBox).toBeInTheDocument();
  });

  it('select and unselect payment', async () => {
    const { getByTestId, queryAllByTestId, container } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={jest.fn()}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const downloadPagoPANotice = getByTestId('download-pagoPA-notice-button');
    const payButton = getByTestId('pay-button');

    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
    );

    const item = queryAllByTestId('pagopa-item')[paymentIndex];

    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    expect(downloadPagoPANotice).toBeDisabled();
    expect(payButton).toBeDisabled();
    // select payment
    fireEvent.click(radioButton!);
    expect(downloadPagoPANotice).not.toBeDisabled();
    expect(payButton).not.toBeDisabled();
    // check f24
    const f24Download = getByTestId('f24-download');
    expect(f24Download).toBeInTheDocument();
    // unselect payment
    fireEvent.click(radioButton!);
    expect(payButton).toBeDisabled();
    expect(downloadPagoPANotice).toBeDisabled();
    expect(f24Download).not.toBeInTheDocument();
  });

  it('should dispatch action on pay button click', async () => {
    const payClickMk = jest.fn();
    const { getByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={jest.fn()}
        onPayClick={payClickMk}
        handleReloadPayment={() => void 0}
      />
    );
    const payButton = getByTestId('pay-button');
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
    );

    const item = queryAllByTestId('pagopa-item')[paymentIndex];

    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    fireEvent.click(payButton);
    await waitFor(() => {
      expect(payClickMk).toBeCalledTimes(1);
      expect(payClickMk).toBeCalledWith(
        paymentsData.pagoPaF24[paymentIndex].pagoPa!.noticeCode,
        paymentsData.pagoPaF24[paymentIndex].pagoPa!.creditorTaxId,
        paymentsData.pagoPaF24[paymentIndex].pagoPa!.amount
      );
    });
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
    const { queryByTestId, container } = render(
      <NotificationPaymentRecipient
        payments={payment}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={jest.fn()}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const payButton = queryByTestId('pay-button');
    const radioButton = container.querySelector('[data-testid="radio-button"] input');
    expect(radioButton).not.toBeInTheDocument();
    expect(payButton).not.toBeInTheDocument();
  });

  it('should show alert if notification is cancelled', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={true}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={jest.fn()}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const alert = getByTestId('cancelledAlertPayment');
    const subtitle = queryByTestId('notification-payment-recipient-subtitle');
    expect(alert).toBeInTheDocument();
    expect(subtitle).not.toBeInTheDocument();
  });

  it.skip('should call handleDownloadAttachment on download button click', async () => {
    const getPaymentAttachmentActionMk = jest
      .fn()
      .mockImplementation(() => ({ unwrap: () => new Promise(() => void 0) }));

    const { getByTestId, queryAllByTestId, container } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
        onPayClick={() => void 0}
        handleReloadPayment={() => void 0}
      />
    );
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED && payment.f24
    );

    const item = queryAllByTestId('pagopa-item')[paymentIndex];

    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // download pagoPA attachments
    const downloadButton = getByTestId('download-pagoPA-notice-button');
    downloadButton.click();
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(1);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.PAGOPA,
      paymentsData.pagoPaF24[paymentIndex].pagoPa?.attachmentIdx
    );

    // TODO: in questo modo si seleziona il primo pagamento. Questo implica che il test sia strettamente legato al mock.
    // rendere il tutto più dinamico facendo un querySelectorAll
    // fare una findIndex in paymentsData.pagoPaF24 per trovare il pagamento che ha status REQUIRED (condizione necessaria perchè ci sia il radio button)
    // cliccare il radio button con indice quello ricavato sopra

    await waitFor(() => {
      fireEvent.click(radioButton!);
    });

    console.log(container.innerHTML);
    const attachedF24 = getByTestId('f24-download');
    const attachedF24DownloadButton = attachedF24.querySelector(
      '[data-testid="download-f24-button"]'
    );
    fireEvent.click(attachedF24DownloadButton!);
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(2);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      paymentsData.pagoPaF24[paymentIndex].f24!.attachmentIdx
    );

    // download isolated f24
    const isolatedF24Item = queryAllByTestId('f24only-box')[0];
    const isolatedF24RadioButton = isolatedF24Item.querySelector(
      '[data-testid="download-f24-button"]'
    );

    fireEvent.click(isolatedF24RadioButton!);
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(3);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      paymentsData.f24Only[0].attachmentIdx
    );
  });
});
