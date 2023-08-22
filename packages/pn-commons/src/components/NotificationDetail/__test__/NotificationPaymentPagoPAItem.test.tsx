import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, recipient } from '../../../__mocks__/NotificationDetail.mock';
import {
  PagoPAPaymentHistory,
  PaymentHistory,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../types';
import { populatePaymentHistory } from '../../../utils';
import NotificationPaymentPagoPAItem from '../NotificationPaymentPagoPAItem';

describe('NotificationPaymentPagoPAItem Component', () => {
  const pagoPAItems: PaymentHistory[] = populatePaymentHistory(
    recipient.taxId,
    notificationToFe.timeline,
    notificationToFe.recipients,
    paymentInfo
  );

  const pagoPAItem = pagoPAItems.find((item) => item.pagoPA)?.pagoPA as PagoPAPaymentHistory;

  it('renders NotificationPaymentPagoPAItem - should show radio button when status is REQUIRED', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
      />
    );

    const radioButton = result.getByTestId('radio-button');
    expect(radioButton).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show caption if applyCostFlg is true', () => {
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={{ ...pagoPAItem, amount: 999 }}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
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
      />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.succeded');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is FAILED and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.FAILED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
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
      />
    );

    expect(result.container).toHaveTextContent(/1.000,00 €/i); // TODO sostituire con variabile
  });

  it('renders NotificationPaymentPagoPAItem - radio button should be checked if isSelected', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={true}
        handleReloadPayment={() => void 0}
      />
    );

    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    expect(radioButton).toBeChecked();
  });

  it('Should call handleReloadPayment when reload button is clicked', async () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
      errorCode: PaymentInfoDetail.GENERIC_ERROR,
    };
    const handleReloadPaymentMk = jest.fn();
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={handleReloadPaymentMk}
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
      errorCode: PaymentInfoDetail.GENERIC_ERROR,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
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
      errorCode: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
      detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
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
      errorCode: PaymentInfoDetail.DOMAIN_UNKNOWN,
      detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
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
      errorCode: PaymentInfoDetail.PAYMENT_UNKNOWN,
      detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
    };
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleReloadPayment={() => void 0}
      />
    );

    const errorMessage = result.getByTestId('assistence-error-message');
    const reloadButton = result.queryByTestId('reload-button');

    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });
});
