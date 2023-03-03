import React from 'react';

import { render } from '../../../test-utils';
import { PaymentHistory, RecipientType } from '../../../types';
import NotificationPaidDetail from '../NotificationPaidDetail';

describe('NotificationDetailPaid Component', () => {
  const paymentHistory: Array<PaymentHistory> = [
    {
      recipientDenomination: 'Mario Rossi',
      recipientTaxId: 'RSSMRA80A01H501U',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PF,
      amount: 100,
      creditorTaxId: '77777777777',
      noticeCode: '302181677769720267',
    },
    {
      recipientDenomination: 'Sara Bianchi',
      recipientTaxId: 'BNCSRA00E44H501J',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PF,
      amount: 30,
      creditorTaxId: '77777777777',
      noticeCode: '302181677459720267',
      idF24: 'aw345s',
    },
  ];

  function testTableData(payment: PaymentHistory, table: HTMLElement, isSender: boolean) {
    const tableRows = [
      'recipientType',
      'paymentObject',
      'amount',
      'paymentType',
      'noticeCode',
      'creditorTaxId',
    ];
    for (const key of tableRows) {
      const row = table.querySelector(`[data-testid="${key}"]`);
      if (payment[key] || key === 'paymentType') {
        if (key === 'recipientType' && !isSender) {
          expect(row).not.toBeInTheDocument();
          continue;
        }
        expect(row).toBeInTheDocument();
        continue;
      }
      expect(row).not.toBeInTheDocument();
    }
  }

  it('renders NotificationPaidDetail - one recipient and no sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={[paymentHistory[0]]} />);
    const table = result.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    testTableData(paymentHistory[0], table, false);
  });

  it('renders NotificationPaidDetail - one recipient and sender', () => {
    const result = render(
      <NotificationPaidDetail paymentDetailsList={[paymentHistory[0]]} isSender />
    );
    const table = result.getByTestId('paymentTable');
    expect(table).toBeInTheDocument();
    const sender = result.getByTestId('sender');
    expect(sender).toBeInTheDocument();
    expect(sender).toHaveTextContent(
      `${paymentHistory[0].recipientDenomination} - ${paymentHistory[0].recipientTaxId}`
    );
    testTableData(paymentHistory[0], table, true);
  });

  it.skip('renders NotificationPaidDetail - multi recipient and sender', () => {
    const result = render(<NotificationPaidDetail paymentDetailsList={paymentHistory} isSender />);
    const tables = result.getAllByTestId('paymentTable');
    expect(tables).toHaveLength(paymentHistory.length);
    tables.forEach((table, index) => {
      testTableData(paymentHistory[index], table, true);
    });
  });
});
