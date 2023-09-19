import React from 'react';

import { mockPaymentHistory } from '../../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, fireEvent, render, within } from '../../../test-utils';
import { PaymentHistory, RecipientType } from '../../../types';
import { formatEurocentToCurrency, formatFiscalCode } from '../../../utils';
import NotificationPaidDetail from '../NotificationPaidDetail';

describe('NotificationDetailPaid Component', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
  });

  function testTableData(payment: PaymentHistory, table: HTMLElement, isSender: boolean) {
    const tableRows = [
      {
        id: 'recipientType',
        label: 'Tipo di destinatario',
        value: payment.recipientType === RecipientType.PF ? 'Persona fisica' : 'Persona giuridica',
      },
      { id: 'paymentObject', label: 'Oggetto del pagamento', value: payment.paymentObject || '-' },
      {
        id: 'amount',
        label: 'Importo',
        value: payment.amount ? formatEurocentToCurrency(payment.amount) : '-',
      },
      {
        id: 'paymentType',
        label: 'Tipologia di pagamento',
        value: payment.idF24 ? 'F24' : 'Avviso pagoPA',
      },
      {
        id: 'noticeCode',
        label: 'Codice Avviso',
        value: payment.noticeCode ? payment.noticeCode.match(/.{1,4}/g)?.join(' ') : '-',
      },
      {
        id: 'creditorTaxId',
        label: 'Codice Fiscale Ente',
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
  }

  it('renders NotificationPaidDetail - one recipient and no sender', async () => {
    await act(async () => {
      result = render(<NotificationPaidDetail paymentDetailsList={[mockPaymentHistory[0]]} />);
    });
    const table = result?.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = result?.queryByTestId('paymentRecipient');
    expect(recipient).not.toBeInTheDocument();
    testTableData(mockPaymentHistory[0], table!, false);
  });

  it('renders NotificationPaidDetail - one recipient and sender', () => {
    const result = render(
      <NotificationPaidDetail paymentDetailsList={[mockPaymentHistory[0]]} isSender />
    );
    const table = result.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = result.getByTestId('paymentRecipient');
    expect(recipient).toBeInTheDocument();
    expect(recipient).toHaveTextContent(
      `${mockPaymentHistory[0].recipientDenomination} - ${mockPaymentHistory[0].recipientTaxId}`
    );
    testTableData(mockPaymentHistory[0], table, true);
  });

  it('renders NotificationPaidDetail - multi recipient and no sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={mockPaymentHistory} />);
    const tables = result.getAllByTestId('paymentTable');
    expect(tables).toHaveLength(mockPaymentHistory.length);
    tables.forEach((table, index) => {
      testTableData(mockPaymentHistory[index], table, false);
    });
  });

  it('renders NotificationPaidDetail - multi recipient and sender', () => {
    const result = render(
      <NotificationPaidDetail paymentDetailsList={mockPaymentHistory} isSender />
    );
    const accordions = result.getAllByTestId('paymentAccordion');
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
