import React from 'react';

import { F24PaymentDetails } from '@pagopa-pn/pn-commons';

import { notificationToFeMultiRecipient } from '../../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor, within } from '../../../../__test__/test-utils';
import NotificationPaymentF24 from '../NotificationPaymentF24';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const f24Payments =
  notificationToFeMultiRecipient.recipients[0].payments?.reduce((arr, item) => {
    if (item.f24) {
      arr.push(item.f24);
    }
    return arr;
  }, [] as Array<F24PaymentDetails>) ?? [];

describe('NotificationPaymentF24 Component', () => {
  it('renders component - no remaining items', () => {
    // render component
    const { container, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentF24 iun={notificationToFeMultiRecipient.iun} payments={f24Payments} />
    );
    expect(container).toHaveTextContent('payment.f24-attached');
    const f24Elem = queryAllByTestId('f24');
    expect(f24Elem).toHaveLength(f24Payments.length);
    f24Elem.forEach((elem, index) => {
      expect(elem).toHaveTextContent(f24Payments[index].title);
    });
    const remainingF24 = queryByTestId('remaining-f24');
    expect(remainingF24).not.toBeInTheDocument();
  });

  it('renders component - remaining items', async () => {
    const f24LotPayments = [
      ...f24Payments,
      ...f24Payments.map((f24) => ({
        ...f24,
        description: f24.title.split('').reverse().join(''),
      })),
    ];
    const { queryAllByTestId, queryByTestId } = render(
      <NotificationPaymentF24 iun={notificationToFeMultiRecipient.iun} payments={f24LotPayments} />
    );
    const f24Elem = queryAllByTestId('f24');
    expect(f24Elem).toHaveLength(5);
    f24Elem.forEach((f24, index) => {
      if (index >= 3) {
        return false;
      }
      expect(f24).toHaveTextContent(f24LotPayments[index].title);
    });
    const remainingF24 = queryByTestId('remaining-f24');
    expect(remainingF24).toBeInTheDocument();
    expect(remainingF24).toHaveTextContent('+ 1 payment.attachmentsdetail.show-all');
    // check modal with all f24
    const showAllButton = queryByTestId('show-all-attachments');
    fireEvent.click(showAllButton!);
    const dialog = await waitFor(() => queryByTestId('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogAllF24 = queryAllByTestId('dialog-all-attachments');
    expect(dialogAllF24).toHaveLength(f24LotPayments.length);
    dialogAllF24.forEach((dialogF24, index) => {
      expect(dialogF24).toHaveTextContent(f24LotPayments[index].title);
    });
    // close dialog
    const closeDialogBtn = within(dialog!).queryByTestId('close-dialog');
    fireEvent.click(closeDialogBtn!);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
