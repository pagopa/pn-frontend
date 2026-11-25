import { render } from '../../../test-utils';
import InformalNotificationMessage from '../InformalNotificationMessage';

const attachmentsKey = 'detail.informal_notification_markdown.attachments_info';
const paymentKey = 'detail.informal_notification_markdown.payment_instructions';
const assistanceKey = 'detail.informal_notification_markdown.assistance';
const attachmentsPfKey = 'detail.informal_notification_markdown.attachments_info_pf';

const getParagraphByKey = (container: HTMLElement, key: string) =>
  Array.from(container.querySelectorAll('p')).find((paragraph) =>
    paragraph.textContent?.includes(key)
  );

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

  it.each(['body1', 'body2'] as const)(
    'renders attachments and payment in separate paragraphs with variant %s',
    (variant) => {
      const { container } = render(
        <InformalNotificationMessage message="Testo" hasAttachments hasPayment variant={variant} />
      );

      expect(container).not.toHaveTextContent('detail.informal_notification_markdown.greeting');

      const attachmentsParagraph = getParagraphByKey(container, attachmentsKey);
      const paymentParagraph = getParagraphByKey(container, paymentKey);

      expect(attachmentsParagraph).toBeDefined();
      expect(paymentParagraph).toBeDefined();
      expect(attachmentsParagraph?.tagName).toBe('P');
      expect(paymentParagraph?.tagName).toBe('P');
      expect(attachmentsParagraph).not.toBe(paymentParagraph);
      expect(attachmentsParagraph).not.toHaveTextContent(paymentKey);
      expect(paymentParagraph).not.toHaveTextContent(attachmentsKey);

      expect(attachmentsParagraph?.nextElementSibling).toBe(paymentParagraph);
      const assistanceParagraph = getParagraphByKey(container, assistanceKey);

      expect(paymentParagraph?.nextElementSibling).toBe(assistanceParagraph);
    }
  );

  it.each([
    { hasAttachments: true, hasPayment: false, expectedParagraphs: 3 },
    { hasAttachments: false, hasPayment: true, expectedParagraphs: 3 },
    { hasAttachments: false, hasPayment: false, expectedParagraphs: 2 },
  ])(
    'renders conditional sentences: attachments=$hasAttachments, payment=$hasPayment',
    ({ hasAttachments, hasPayment, expectedParagraphs }) => {
      const { container } = render(
        <InformalNotificationMessage
          message="Testo"
          hasAttachments={hasAttachments}
          hasPayment={hasPayment}
        />
      );

      const attachmentsParagraph = getParagraphByKey(container, attachmentsKey);

      if (hasAttachments) {
        expect(attachmentsParagraph?.tagName).toBe('P');
      } else {
        expect(attachmentsParagraph).toBeUndefined();
      }

      const paymentParagraph = getParagraphByKey(container, paymentKey);

      if (hasPayment) {
        expect(paymentParagraph?.tagName).toBe('P');
      } else {
        expect(paymentParagraph).toBeUndefined();
      }

      const assistanceParagraph = getParagraphByKey(container, assistanceKey);

      expect(assistanceParagraph?.tagName).toBe('P');

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(expectedParagraphs);

      paragraphs.forEach((paragraph) => {
        expect(paragraph).not.toBeEmptyDOMElement();
      });
    }
  );

  it.each([
    { prop: 'greetingKey', defaultKey: 'detail.informal_notification_markdown.greeting' },
    { prop: 'attachmentsInfoKey', defaultKey: attachmentsKey },
    { prop: 'paymentInstructionsKey', defaultKey: paymentKey },
    { prop: 'assistanceKey', defaultKey: assistanceKey },
  ] as const)('uses the custom translation key for $prop', ({ prop, defaultKey }) => {
    const customKey = `custom.${prop}`;

    const { container } = render(
      <InformalNotificationMessage
        message="Testo"
        recipientDenomination="Destinatario di Test"
        senderDenomination="Ente di Test"
        hasAttachments
        hasPayment
        variant="body2"
        {...{ [prop]: customKey }}
      />
    );

    const greetingKey = 'detail.informal_notification_markdown.greeting';
    const expectedAttachmentsKey = prop === 'attachmentsInfoKey' ? customKey : attachmentsKey;
    const expectedPaymentKey = prop === 'paymentInstructionsKey' ? customKey : paymentKey;
    const expectedAssistanceKey = prop === 'assistanceKey' ? customKey : assistanceKey;

    expect(container).toHaveTextContent(prop === 'greetingKey' ? customKey : greetingKey);
    expect(container).not.toHaveTextContent(defaultKey);

    const attachmentsParagraph = getParagraphByKey(container, expectedAttachmentsKey);
    const paymentParagraph = getParagraphByKey(container, expectedPaymentKey);
    const assistanceParagraph = getParagraphByKey(container, expectedAssistanceKey);

    expect(attachmentsParagraph?.tagName).toBe('P');
    expect(paymentParagraph?.tagName).toBe('P');
    expect(assistanceParagraph?.tagName).toBe('P');

    expect(attachmentsParagraph?.textContent?.trim()).toBe(`notifiche ${expectedAttachmentsKey}`);
    expect(paymentParagraph?.textContent?.trim()).toBe(`notifiche ${expectedPaymentKey}`);
    expect(assistanceParagraph?.textContent?.trim()).toBe(`notifiche ${expectedAssistanceKey}`);

    expect(attachmentsParagraph?.nextElementSibling).toBe(paymentParagraph);
    expect(paymentParagraph?.nextElementSibling).toBe(assistanceParagraph);
  });

  it('hides the custom attachments sentence when there are no attachments', () => {
    const { container } = render(
      <InformalNotificationMessage
        message="Testo"
        hasAttachments={false}
        hasPayment
        attachmentsInfoKey={attachmentsPfKey}
      />
    );

    expect(container).not.toHaveTextContent(attachmentsPfKey);
    expect(getParagraphByKey(container, paymentKey)?.tagName).toBe('P');
    expect(getParagraphByKey(container, assistanceKey)?.tagName).toBe('P');
    expect(container.querySelectorAll('p')).toHaveLength(3);
  });
});
