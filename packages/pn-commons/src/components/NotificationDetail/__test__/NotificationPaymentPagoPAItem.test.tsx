import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, recipient } from '../../../__mocks__/NotificationDetail.mock';
import {
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../types';
import { formatEurocentToCurrency, populatePaymentsPagoPaF24 } from '../../../utils';
import NotificationPaymentPagoPAItem from '../NotificationPaymentPagoPAItem';

describe('NotificationPaymentPagoPAItem Component', () => {
  const pagoPAItems: PaymentDetails[] = populatePaymentsPagoPaF24(
    notificationToFe.timeline,
    notificationToFe.recipients[0].payments as PaymentDetails[],
    paymentInfo
  );

  const pagoPAItem = pagoPAItems.find((item) => item.pagoPA)?.pagoPA as PagoPAPaymentFullDetails;

  it('renders NotificationPaymentPagoPAItem - should show radio button when status is REQUIRED', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const radioButton = result.getByTestId('radio-button');
    expect(radioButton).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show caption if applyCost is true', () => {
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={{ ...pagoPAItem, amount: 999, applyCost: true }}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const caption = result.getByTestId('apply-costs-caption');
    expect(caption).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is SUCCEEDED and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.SUCCEEDED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.succeded');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is FAILED (expired) and not show radio', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.failed');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is INPROGRESS and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.INPROGRESS };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.inprogress');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show amount if present', () => {
    const amount = 1000;
    const item = { ...pagoPAItem, amount };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const amountContainer = result.getByTestId('payment-amount');
    expect(amountContainer).toHaveTextContent(
      formatEurocentToCurrency(amount).replace(/\u00a0/g, ' ')
    );
  });

  it('renders NotificationPaymentPagoPAItem - radio button should be checked if isSelected', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={true}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    expect(radioButton).toBeChecked();
  });

  it('Should call handleDeselectPayment when radio button is selected and is clicked', async () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const handleDeselectPaymentMk = jest.fn();
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={true}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={handleDeselectPaymentMk}
        isCancelled={false}
      />
    );

    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    fireEvent.click(radioButton);
    expect(handleDeselectPaymentMk).toBeCalledTimes(1);
  });

  it('Should call handleReloadPayment when reload button is clicked', async () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    };
    const handleReloadPaymentMk = jest.fn();
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={handleReloadPaymentMk}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const reloadButton = result.getByTestId('reload-button');
    fireEvent.click(reloadButton);

    await waitFor(() => {
      expect(handleReloadPaymentMk).toBeCalledTimes(1);
    });
  });

  it('Error - Show canceled chip when payment is Canceled. Radio and reload buttons should not exists', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_CANCELED,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.canceled');
    const radio = result.queryByTestId('radio-button');
    const reloadButton = result.queryByTestId('reload-button');

    expect(chip).toBeInTheDocument();
    expect(radio).not.toBeInTheDocument();
    expect(reloadButton).not.toBeInTheDocument();
  });

  it('Error - Show generic error message and reload button when payment is Failed and detail is GENERIC_ERROR', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const message = result.getByTestId('generic-error-message');
    const reloadButton = result.getByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(message).toHaveTextContent('detail.payment.error.generic-error');
  });

  it('should show error message for PAYMENT_UNAVAILABLE', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const errorMessage = result.getByTestId('assistence-error-message');
    const reloadButton = result.queryByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for DOMAIN_UNKNOWN', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const errorMessage = result.getByTestId('assistence-error-message');
    const reloadButton = result.queryByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for PAYMENT_UNKNOWN. Reload buttons should exist', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const errorMessage = result.getByTestId('assistence-error-message');
    const reloadButton = result.queryByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for PAYMENT_DUPLICATED. Reload buttons should exist', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_DUPLICATED,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );

    const errorMessage = result.getByTestId('payment-duplicated-message');
    const reloadButton = result.queryByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.duplicated');
  });

  it('should show creditorTaxId if notification is Cancelled', () => {
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={pagoPAItem}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={true}
      />
    );

    const creditorTaxId = result.getByTestId('creditorTaxId');
    expect(creditorTaxId).toBeInTheDocument();
  });
});
