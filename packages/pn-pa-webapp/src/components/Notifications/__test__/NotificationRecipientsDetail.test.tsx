import { vi } from 'vitest';

import {
  notificationDTOMultiRecipient,
  recipients,
} from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import NotificationRecipientsDetail from '../NotificationRecipientsDetail';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationRecipientsDetail Component', () => {
  const original = navigator.clipboard;

  const writeTextFn = vi.fn();

  beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: writeTextFn },
    });
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: original });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - no remaining items', () => {
    const { queryAllByTestId, queryByTestId } = render(
      <NotificationRecipientsDetail
        recipients={notificationDTOMultiRecipient.recipients}
        iun={notificationDTOMultiRecipient.iun}
      />
    );
    const recipientsElem = queryAllByTestId('recipients');
    expect(recipientsElem).toHaveLength(recipients.length);
    recipientsElem.forEach((recipientElem, index) => {
      expect(recipientElem).toHaveTextContent(
        recipients[index].denomination + ' - ' + recipients[index].taxId
      );
    });
    const remainingRecipients = queryByTestId('remaining-recipients');
    expect(remainingRecipients).not.toBeInTheDocument();
  });

  it('renders component - remaining items', async () => {
    const recipients = [
      ...notificationDTOMultiRecipient.recipients,
      ...notificationDTOMultiRecipient.recipients.map((recipient) => ({
        ...recipient,
        taxId: recipient.taxId.split('').reverse().join(''),
        denomination: recipient.denomination.split('').reverse().join(''),
      })),
    ];
    const { queryAllByTestId, queryByTestId } = render(
      <NotificationRecipientsDetail
        recipients={recipients}
        iun={notificationDTOMultiRecipient.iun}
      />
    );
    const recipientsElem = queryAllByTestId('recipients');
    expect(recipientsElem).toHaveLength(3);
    recipientsElem.forEach((recipientElem, index) => {
      if (index >= 3) {
        return false;
      }
      return expect(recipientElem).toHaveTextContent(
        recipients[index].denomination + ' - ' + recipients[index].taxId
      );
    });
    const remainingRecipients = queryByTestId('remaining-recipients');
    expect(remainingRecipients).toBeInTheDocument();
    expect(remainingRecipients).toHaveTextContent('+ 1 detail.recipients detail.show-all');
    // check modal with all recipients
    const showAllButton = queryByTestId('show-all-recipients');
    fireEvent.click(showAllButton!);
    const dialog = await waitFor(() => queryByTestId('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogAllRecipients = queryAllByTestId('dialog-all-recipients');
    expect(dialogAllRecipients).toHaveLength(recipients.length);
    dialogAllRecipients.forEach((dialogRecipient, index) => {
      expect(dialogRecipient).toHaveTextContent(
        recipients[index].denomination + ' - ' + recipients[index].taxId
      );
    });
    // simulate copy to clipboard
    const copyToClipboardBtn = within(dialogAllRecipients[0]).queryByRole('button');
    fireEvent.click(copyToClipboardBtn!);
    await waitFor(() => {
      expect(writeTextFn).toBeCalledTimes(1);
      expect(writeTextFn).toBeCalledWith(recipients[0].denomination + ' - ' + recipients[0].taxId);
    });
    // close dialog
    const closeDialogBtn = within(dialog!).queryByTestId('close-dialog');
    fireEvent.click(closeDialogBtn!);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
