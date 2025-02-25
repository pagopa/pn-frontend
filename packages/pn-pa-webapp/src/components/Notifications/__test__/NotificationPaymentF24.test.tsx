import { getF24Payments } from '@pagopa-pn/pn-commons';

import { notificationDTOMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import NotificationPaymentF24 from '../NotificationPaymentF24';

const f24Payments = getF24Payments(
  notificationDTOMultiRecipient.recipients[0].payments ?? [],
  0,
  false
);

describe('NotificationPaymentF24 Component', () => {
  it('renders component - no remaining items', () => {
    // render component
    const { container, queryByTestId, queryAllByTestId } = render(
      <NotificationPaymentF24 iun={notificationDTOMultiRecipient.iun} payments={f24Payments} />
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
      ...f24Payments.map((f24, index) => ({
        ...f24,
        description: f24.title.split('').reverse().join(''),
        attachmentIdx: f24Payments.length + index,
      })),
    ];
    const { queryAllByTestId, queryByTestId } = render(
      <NotificationPaymentF24 iun={notificationDTOMultiRecipient.iun} payments={f24LotPayments} />
    );
    const f24Elem = queryAllByTestId('f24');
    expect(f24Elem).toHaveLength(5);
    f24Elem.forEach((f24, index) => {
      if (index >= 3) {
        return false;
      }
      return expect(f24).toHaveTextContent(f24LotPayments[index].title);
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
