import { render } from '../../../test-utils';
import InformalNotificationMessage from '../InformalNotificationMessage';

const attachmentsKey = 'detail.informal_notification_markdown.attachments_info';
const paymentKey = 'detail.informal_notification_markdown.payment_instructions';
const assistanceKey = 'detail.informal_notification_markdown.assistance';

describe('InformalNotificationMessage Component', () => {
  it('renders greeting, markdown message and assistance sentence', () => {
    const { container, getByText } = render(
      <InformalNotificationMessage
        message={'Primo paragrafo **importante**\n\nSecondo paragrafo'}
        recipientDenomination="Mario Rossi"
        senderDenomination="Ente di Test"
      />
    );
    expect(container).toHaveTextContent('detail.informal_notification_markdown.greeting');
    expect(getByText('importante').tagName).toBe('STRONG');
    expect(getByText('Secondo paragrafo').tagName).toBe('P');
    expect(container).toHaveTextContent(assistanceKey);
    expect(container).not.toHaveTextContent(attachmentsKey);
    expect(container).not.toHaveTextContent(paymentKey);
  });

  it('renders attachments and payment sentences', () => {
    const { container } = render(
      <InformalNotificationMessage message="Testo" hasAttachments hasPayment />
    );
    expect(container).not.toHaveTextContent('detail.informal_notification_markdown.greeting');
    expect(container).toHaveTextContent(attachmentsKey);
    expect(container).toHaveTextContent(paymentKey);
  });
});
