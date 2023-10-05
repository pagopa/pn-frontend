import React from 'react';

import { notificationToFeMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { PaymentHistory, RecipientType } from '../../../models';
import { fireEvent, initLocalizationForTest, render, within } from '../../../test-utils';
import { formatEurocentToCurrency, formatFiscalCode } from '../../../utility';
import NotificationPaidDetail from '../NotificationPaidDetail';

const mockPaymentHistory = notificationToFeMultiRecipient.paymentHistory!;

const testTableData = (payment: PaymentHistory, table: HTMLElement, isSender: boolean) => {
  const tableRows = [
    {
      id: 'recipientType',
      label: 'notifiche - detail.payment.recipient-type',
      value:
        payment.recipientType === RecipientType.PF
          ? 'notifiche - detail.payment.natural-person'
          : 'notifiche - detail.payment.legal-person',
    },
    {
      id: 'paymentObject',
      label: 'notifiche - detail.payment.object',
      value: payment.paymentObject || '-',
    },
    {
      id: 'amount',
      label: 'notifiche - detail.payment.amount',
      value: payment.amount ? formatEurocentToCurrency(payment.amount) : '-',
    },
    {
      id: 'paymentType',
      label: 'notifiche - detail.payment.type',
      value: payment.idF24 ? 'F24' : 'notifiche - detail.payment.pagopa-notice',
    },
    {
      id: 'noticeCode',
      label: 'notifiche - detail.notice-code',
      value: payment.noticeCode ? payment.noticeCode.match(/.{1,4}/g)?.join(' ') : '-',
    },
    {
      id: 'creditorTaxId',
      label: 'notifiche - detail.creditor-tax-id',
      value: payment.creditorTaxId ? formatFiscalCode(payment.creditorTaxId) : '-',
    },
  ];
  for (const tableRow of tableRows) {
    const row = within(table).queryByTestId(tableRow.id);
    if (payment[tableRow.id] || tableRow.id === 'paymentType') {
      if (tableRow.id === 'recipientType' && !isSender) {
        expect(row).not.toBeInTheDocument();
        continue;
      }
      expect(row).toBeInTheDocument();
      const label = within(row!).getByTestId('label');
      const value = within(row!).getByTestId('value');
      expect(label).toHaveTextContent(tableRow.label);
      expect(value!.textContent).toBe(tableRow.value);
      continue;
    }
    expect(row).not.toBeInTheDocument();
  }
};

describe('NotificationDetailPaid Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component - one recipient and no sender', async () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationPaidDetail paymentDetailsList={[mockPaymentHistory[0]]} />
    );
    const table = getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = queryByTestId('paymentRecipient');
    expect(recipient).not.toBeInTheDocument();
    testTableData(mockPaymentHistory[0], table!, false);
  });

  it('renders NotificationPaidDetail - one recipient and sender', () => {
    const { getByTestId } = render(
      <NotificationPaidDetail paymentDetailsList={[mockPaymentHistory[0]]} isSender />
    );
    const table = getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = getByTestId('paymentRecipient');
    expect(recipient).toBeInTheDocument();
    expect(recipient).toHaveTextContent(
      `${mockPaymentHistory[0].recipientDenomination} - ${mockPaymentHistory[0].recipientTaxId}`
    );
    testTableData(mockPaymentHistory[0], table, true);
  });

  it('renders NotificationPaidDetail - multi recipient and no sender', () => {
    const { getAllByTestId } = render(
      <NotificationPaidDetail paymentDetailsList={mockPaymentHistory} />
    );
    const tables = getAllByTestId('paymentTable');
    expect(tables).toHaveLength(mockPaymentHistory.length);
    tables.forEach((table, index) => {
      testTableData(mockPaymentHistory[index], table, false);
    });
  });

  it('renders NotificationPaidDetail - multi recipient and sender', () => {
    const { getAllByTestId } = render(
      <NotificationPaidDetail paymentDetailsList={mockPaymentHistory} isSender />
    );
    const accordions = getAllByTestId('paymentAccordion');
    expect(accordions).toHaveLength(mockPaymentHistory.length);
    accordions.forEach((accordion, index) => {
      const recipient = within(accordion).getByTestId('recipient');
      expect(recipient).toBeInTheDocument();
      expect(recipient).toHaveTextContent(
        `${mockPaymentHistory[index].recipientDenomination} - ${mockPaymentHistory[index].recipientTaxId}`
      );
      const table = within(accordion).getByTestId('paymentTable');
      expect(table).toBeInTheDocument();
      testTableData(mockPaymentHistory[index], table as HTMLElement, true);
      const button = within(accordion).getByRole('button');
      // accordion collapsed
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
    // click on first accordion
    const buttonFirst = within(accordions[0]).getByRole('button');
    fireEvent.click(buttonFirst!);
    // accordion expanded
    expect(buttonFirst).toHaveAttribute('aria-expanded', 'true');
    // click on last accordion
    const buttonlast = within(accordions[accordions.length - 1]).getByRole('button');
    fireEvent.click(buttonlast!);
    // accordion expanded and others collapsed
    expect(buttonlast).toHaveAttribute('aria-expanded', 'true');
    expect(buttonFirst).toHaveAttribute('aria-expanded', 'false');
  });
});
