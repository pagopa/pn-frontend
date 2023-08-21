import React from 'react';

import { render } from '@testing-library/react';

import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, recipient } from '../../../__mocks__/NotificationDetail.mock';
import { PagoPAPaymentHistory, PaymentHistory, PaymentStatus } from '../../../types';
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
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
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
      />
    );

    const caption = result.getByTestId('apply-costs-caption');
    expect(caption).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is SUCCEEDED and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.SUCCEEDED };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.succeded');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is FAILED and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.FAILED };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.failed');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is INPROGRESS and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.INPROGRESS };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
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
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    expect(result.container).toHaveTextContent(/1.000,00 €/i); // TODO sostituire con variabile
  });

  it('renders NotificationPaymentPagoPAItem - radio button should be checked if isSelected', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={true} />
    );

    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    expect(radioButton).toBeChecked();
  });
});
