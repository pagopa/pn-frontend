import React from 'react';

import { render, fireEvent } from '../../../test-utils';
import { PaymentHistory, RecipientType } from '../../../types';
import { formatEurocentToCurrency, formatFiscalCode } from '../../../utils';
import NotificationPaidDetail from '../NotificationPaidDetail';

describe('NotificationDetailPaid Component', () => {
  const paymentHistory: Array<PaymentHistory> = [
    {
      recipientDenomination: 'Mario Rossi',
      recipientTaxId: 'RSSMRA80A01H501U',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PF,
      amount: 10000.45,
      creditorTaxId: '77777777777',
      noticeCode: '302181677769720267',
    },
    {
      recipientDenomination: 'Sara Bianchi',
      recipientTaxId: 'BNCSRA00E44H501J',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PF,
      amount: 30.67,
      creditorTaxId: '77777777777',
      noticeCode: '302181677459720267',
      idF24: 'aw345s',
    },
    {
      recipientDenomination: 'Ufficio Tal dei Tali',
      recipientTaxId: '12345678910',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PG,
      amount: 65.12,
      creditorTaxId: '77777777777',
      noticeCode: '302181677459720267',
    },
  ];

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
      const row = table.querySelector(`[data-testid="${tableRow.id}"]`);
      if (payment[tableRow.id] || tableRow.id === 'paymentType') {
        if (tableRow.id === 'recipientType' && !isSender) {
          expect(row).not.toBeInTheDocument();
          continue;
        }
        expect(row).toBeInTheDocument();
        const label = row!.querySelector(`[data-testid="label"]`);
        const value = row!.querySelector(`[data-testid="value"]`);
        expect(label).toHaveTextContent(tableRow.label);
        expect(value!.textContent).toBe(tableRow.value);
        continue;
      }
      expect(row).not.toBeInTheDocument();
    }
  }

  it('renders NotificationPaidDetail - one recipient and no sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={[paymentHistory[0]]} />);
    const table = result.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = result.queryByTestId('paymentRecipient');
    expect(recipient).not.toBeInTheDocument();
    testTableData(paymentHistory[0], table, false);
  });

  it('renders NotificationPaidDetail - one recipient and sender', () => {
    const result = render(
      <NotificationPaidDetail paymentDetailsList={[paymentHistory[0]]} isSender />
    );
    const table = result.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const recipient = result.getByTestId('paymentRecipient');
    expect(recipient).toBeInTheDocument();
    expect(recipient).toHaveTextContent(
      `${paymentHistory[0].recipientDenomination} - ${paymentHistory[0].recipientTaxId}`
    );
    testTableData(paymentHistory[0], table, true);
  });

  it('renders NotificationPaidDetail - multi recipient and no sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={paymentHistory} />);
    const tables = result.getAllByTestId('paymentTable');
    expect(tables).toHaveLength(paymentHistory.length);
    tables.forEach((table, index) => {
      testTableData(paymentHistory[index], table, false);
    });
  });

  it('renders NotificationPaidDetail - multi recipient and sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={paymentHistory} isSender />);
    const accordions = result.getAllByTestId('paymentAccordion');
    expect(accordions).toHaveLength(paymentHistory.length);
    accordions.forEach((accordion, index) => {
      const recipient = accordion.querySelector(`[data-testid="recipient"]`);
      expect(recipient).toBeInTheDocument();
      expect(recipient).toHaveTextContent(
        `${paymentHistory[index].recipientDenomination} - ${paymentHistory[index].recipientTaxId}`
      );
      const table = accordion.querySelector(`[data-testid="paymentTable"]`);
      expect(table).toBeInTheDocument();
      testTableData(paymentHistory[index], table as HTMLElement, true);
      const button = accordion.querySelector(`[role="button"]`);
      // accordion collapsed
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
    // click on first accordion
    const buttonFirst = accordions[0].querySelector(`[role="button"]`);
    fireEvent.click(buttonFirst!);
    // accordion expanded
    expect(buttonFirst).toHaveAttribute('aria-expanded', 'true');
    // click on last accordion
    const buttonlast = accordions[accordions.length - 1].querySelector(`[role="button"]`);
    fireEvent.click(buttonlast!);
    // accordion expanded and others collapsed
    expect(buttonlast).toHaveAttribute('aria-expanded', 'true');
    expect(buttonFirst).toHaveAttribute('aria-expanded', 'false');
  });
});
