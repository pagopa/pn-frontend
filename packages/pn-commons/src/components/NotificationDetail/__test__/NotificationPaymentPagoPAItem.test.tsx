import React from 'react';

import { render } from '@testing-library/react';

import { PagoPAPaymentHistory, PaymentStatus, RecipientType } from '../../../types';
import NotificationPaymentPagoPAItem from '../NotificationPaymentPagoPAItem';

describe('NotificationPaymentPagoPAItem Component', () => {
  const pagopPAItem: PagoPAPaymentHistory = {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695132',
    applyCostFlg: true,
    attachment: {
      digests: {
        sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38c.pdf',
        versionToken: 'v1',
      },
    },
    status: PaymentStatus.REQUIRED,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Prima rata TARI',
    dueDate: '2025-07-31',
    recIndex: 0,
    recipientType: RecipientType.PF,
    paymentSourceChannel: 'EXTERNAL_REGISTRY',
  };

  it('renders NotificationPaymentPagoPAItem - should show radio button when status is REQUIRED', () => {
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={pagopPAItem} loading={false} isSelected={false} />
    );

    const radioButton = result.getByTestId('radio-button');
    expect(radioButton).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show caption if applyCostFlg is true', () => {
    const result = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={{ ...pagopPAItem, amount: 999 }}
        loading={false}
        isSelected={false}
      />
    );

    const caption = result.getByTestId('apply-costs-caption');
    expect(caption).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is SUCCEEDED and not show radio', () => {
    const item = { ...pagopPAItem, status: PaymentStatus.SUCCEEDED };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.succeded');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is FAILED and not show radio', () => {
    const item = { ...pagopPAItem, status: PaymentStatus.FAILED };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    const chip = result.getByTestId('statusChip-detail.payment.status.failed');
    const radio = result.queryByTestId('radio-button');

    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders NotificationPaymentPagoPAItem - should show badge when status is INPROGRESS and not show radio', () => {
    const item = { ...pagopPAItem, status: PaymentStatus.INPROGRESS };
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
    const item = { ...pagopPAItem, amount };
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={item} loading={false} isSelected={false} />
    );

    expect(result.container).toHaveTextContent(/1.000,00 €/i); // TODO sostituire con variabile
  });

  it('renders NotificationPaymentPagoPAItem - radio button should be checked if isSelected', () => {
    const result = render(
      <NotificationPaymentPagoPAItem pagoPAItem={pagopPAItem} loading={false} isSelected={true} />
    );

    const radioButton = result.container.querySelector(
      '[data-testid="radio-button"] input'
    ) as Element;

    expect(radioButton).toBeChecked();
  });
});
