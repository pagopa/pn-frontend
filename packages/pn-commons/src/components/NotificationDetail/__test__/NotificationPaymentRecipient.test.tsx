import React from 'react';
import { vi } from 'vitest';

import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, payments } from '../../../__mocks__/NotificationDetail.mock';
import { PaymentAttachmentSName, PaymentStatus, PaymentsData } from '../../../models';
import { act, fireEvent, render, waitFor, within } from '../../../test-utils';
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
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    const title = getByTestId('notification-payment-recipient-title');
    const subtitle = getByTestId('notification-payment-recipient-subtitle');
    const f24Download = queryByTestId('f24-download');
    const pagoPABox = queryAllByTestId('pagopa-item');
    const downloadPagoPANotice = queryByTestId('download-pagoPA-notice-button');
    const payButton = getByTestId('pay-button');
    const f24OnlyBox = getByTestId('f24only-box');
    const paginationBox = getByTestId('pagination-box');

    const pageLength = paymentsData.pagoPaF24.filter((payment) => payment.pagoPa).length;

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('detail.payment.title');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('detail.payment.subtitle');
    expect(f24Download).not.toBeInTheDocument();
    expect(pagoPABox).toHaveLength(pageLength > 5 ? 5 : pageLength);
    expect(downloadPagoPANotice).not.toBeInTheDocument();
    expect(payButton).toBeInTheDocument();
    expect(payButton).toBeDisabled();
    expect(f24OnlyBox).toBeInTheDocument();
    expect(paginationBox).toBeInTheDocument();
  });

  it('select and unselect payment', async () => {
    vi.useFakeTimers();
    const { getByTestId, queryAllByTestId, queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    let downloadPagoPANotice = queryByTestId('download-pagoPA-notice-button');
    const payButton = getByTestId('pay-button');
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED && payment.pagoPa.attachment
    );
    const item = queryAllByTestId('pagopa-item')[paymentIndex];
    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    expect(downloadPagoPANotice).not.toBeInTheDocument();
    expect(payButton).toBeDisabled();
    // select payment
    fireEvent.click(radioButton!);
    // after radio button click, there is a timer of 1 second after that the paymeny is enabled
    // wait...
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    downloadPagoPANotice = getByTestId('download-pagoPA-notice-button');
    expect(downloadPagoPANotice).toBeInTheDocument();
    expect(payButton).not.toBeDisabled();
    // check f24
    const f24Download = getByTestId('f24-download');
    expect(f24Download).toBeInTheDocument();
    // unselect payment
    fireEvent.click(radioButton!);
    expect(payButton).toBeDisabled();
    expect(downloadPagoPANotice).not.toBeInTheDocument();
    expect(f24Download).not.toBeInTheDocument();
  });

  it('should dispatch action on pay button click', async () => {
    vi.useFakeTimers();
    const payClickMk = vi.fn();
    const { getByTestId, queryAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={payClickMk}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    const payButton = getByTestId('pay-button');
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
    );

    const item = queryAllByTestId('pagopa-item')[paymentIndex];

    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // after radio button click, there is a timer of 1 second after that the paymeny is enabled
    // wait...
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.click(payButton);
    expect(payClickMk).toBeCalledTimes(1);
    expect(payClickMk).toBeCalledWith(
      paymentsData.pagoPaF24[paymentIndex].pagoPa!.noticeCode,
      paymentsData.pagoPaF24[paymentIndex].pagoPa!.creditorTaxId,
      paymentsData.pagoPaF24[paymentIndex].pagoPa!.amount
    );
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
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
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
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    const alert = getByTestId('cancelledAlertPayment');
    const subtitle = queryByTestId('notification-payment-recipient-subtitle');
    expect(alert).toBeInTheDocument();
    expect(subtitle).not.toBeInTheDocument();
  });

  it('should call handleDownloadAttachment on download button click', async () => {
    vi.useFakeTimers();
    const getPaymentAttachmentActionMk = vi
      .fn()
      .mockImplementation(() => ({ unwrap: () => new Promise(() => void 0), abort: () => void 0 }));

    const { getByTestId, getAllByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={getPaymentAttachmentActionMk}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED && payment.f24
    );
    const item = getAllByTestId('pagopa-item')[paymentIndex];
    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // after radio button click, there is a timer of 1 second after that the paymeny is enabled
    // wait...
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // download pagoPA attachments
    const downloadButton = getByTestId('download-pagoPA-notice-button');
    downloadButton.click();
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(1);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.PAGOPA,
      paymentsData.pagoPaF24[paymentIndex].pagoPa?.attachmentIdx
    );
    // dowload attached f24
    const attachedF24 = getByTestId('f24-download');
    const attachedF24DownloadButton = within(attachedF24).getByTestId('download-f24-button');
    fireEvent.click(attachedF24DownloadButton);
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(2);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      paymentsData.pagoPaF24[paymentIndex].f24!.attachmentIdx
    );
    // download isolated f24
    const isolatedF24Item = getByTestId('f24only-box');
    const isolatedF24RadioButton = within(isolatedF24Item).getAllByTestId('download-f24-button');
    fireEvent.click(isolatedF24RadioButton[0]);
    expect(getPaymentAttachmentActionMk).toBeCalledTimes(3);
    expect(getPaymentAttachmentActionMk).toHaveBeenCalledWith(
      PaymentAttachmentSName.F24,
      paymentsData.f24Only[0].attachmentIdx
    );
  });

  it('should not show pagination box if there are no more than 5 pagopa payments ', () => {
    const payments = {
      pagoPaF24: [...paymentsData.pagoPaF24.slice(0, 2)],
      f24Only: [...paymentsData.f24Only],
    };
    const { queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={payments}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        landingSiteUrl=""
      />
    );
    const paginationBox = queryByTestId('pagination-box');
    expect(paginationBox).not.toBeInTheDocument();
  });

  it('should call handleFetchPaymentsInfo on pagination click', async () => {
    const fetchPaymentsInfoMk = vi.fn();
    const result = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={fetchPaymentsInfoMk}
        landingSiteUrl=""
      />
    );

    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons[2]);

    expect(fetchPaymentsInfoMk).toBeCalledTimes(1);
  });

  it('download pagoPa notice hidden if no attachment is present', () => {
    const { getAllByTestId, queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => {}}
        landingSiteUrl=""
      />
    );
    const paymentIndex = paymentsData.pagoPaF24.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED && !payment.pagoPa.attachment
    );
    const item = getAllByTestId('pagopa-item')[paymentIndex];
    const radioButton = item.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // download pagoPA attachments
    const downloadButton = queryByTestId('download-pagoPA-notice-button');
    expect(downloadButton).not.toBeInTheDocument();
  });

  it('should not show subtitle when all payments are paid', () => {
    const paidPayments = {
      pagoPaF24: [
        ...paymentsData.pagoPaF24.map((payment) => ({
          ...payment,
          pagoPa: {
            ...payment.pagoPa!,
            status: PaymentStatus.SUCCEEDED,
          },
        })),
      ],
      f24Only: [...paymentsData.f24Only],
    };

    const { queryByTestId } = render(
      <NotificationPaymentRecipient
        payments={paidPayments}
        isCancelled={false}
        timerF24={F24TIMER}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => {}}
        landingSiteUrl=""
      />
    );

    const subtitle = queryByTestId('notification-payment-recipient-subtitle');
    expect(subtitle).not.toBeInTheDocument();
  });
});
