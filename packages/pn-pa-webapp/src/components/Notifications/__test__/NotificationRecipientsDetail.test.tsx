import { vi } from 'vitest';

import {
  notificationDTOMultiRecipient,
  recipients,
} from '../../../__mocks__/NotificationDetail.mock';
import { render } from '../../../__test__/test-utils';
import NotificationRecipientsDetail from '../NotificationRecipientsDetail';

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
      <NotificationRecipientsDetail recipients={notificationDTOMultiRecipient.recipients} />
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
      <NotificationRecipientsDetail recipients={recipients} />
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
    expect(remainingRecipients).toHaveTextContent('+1 detail.recipient');
    expect(queryByTestId('show-all-recipients')).not.toBeInTheDocument();
  });

  it('renders component - show all recipients', () => {
    const recipients = [
      ...notificationDTOMultiRecipient.recipients,
      ...notificationDTOMultiRecipient.recipients.map((recipient) => ({
        ...recipient,
        taxId: recipient.taxId.split('').reverse().join(''),
        denomination: recipient.denomination.split('').reverse().join(''),
      })),
    ];

    const { queryAllByTestId, queryByTestId } = render(
      <NotificationRecipientsDetail recipients={recipients} showAll />
    );

    const recipientsElem = queryAllByTestId('recipients');
    expect(recipientsElem).toHaveLength(recipients.length);

    recipientsElem.forEach((recipientElem, index) => {
      expect(recipientElem).toHaveTextContent(
        recipients[index].denomination + ' - ' + recipients[index].taxId
      );
    });

    expect(queryByTestId('remaining-recipients')).not.toBeInTheDocument();
  });
});
