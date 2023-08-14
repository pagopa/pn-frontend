import React from 'react';

import { render } from '../../../../__test__/test-utils';
import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../../../__mocks__/NotificationDetail.mock';
import NotificationPaymentSender from '../NotificationPaymentSender';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationPaymentSender Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const result = render(<NotificationPaymentSender recipients={notificationToFe.recipients} />);
    expect(result.container).toHaveTextContent('payment.title');
    expect(result.container).toHaveTextContent('payment.subtitle-single');
  });

  it('renders component - multi recipient', () => {
    // render component
    const result = render(
      <NotificationPaymentSender recipients={notificationToFeMultiRecipient.recipients} />
    );
    expect(result.container).toHaveTextContent('payment.title');
    expect(result.container).toHaveTextContent('payment.subtitle-multiple');
  });
});
