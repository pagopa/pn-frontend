import React from 'react';
import { render } from '@testing-library/react';
import { payments } from '../../../__mocks__/NotificationDetail.mock';
import { F24PaymentDetails } from '../../../types';
import NotificationPaymentF24Item from '../NotificationPaymentF24Item';

describe('NotificationPaymentF24Item Component', () => {
  const f24Item = payments.find((item) => !item.pagoPA && item.f24)?.f24 as F24PaymentDetails;

  it('renders NotificationPaymentPagoPAItem - should show title of f24Item', () => {
    const item = { ...f24Item, title: 'F24 Rata' };
    const result = render(<NotificationPaymentF24Item f24Item={item} loading={false} />);

    expect(result.container).toHaveTextContent(item.title);
  });
});
