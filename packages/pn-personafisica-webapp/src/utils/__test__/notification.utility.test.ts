import { notificationToFeTwoRecipients } from "../../redux/notification/__test__/test-utils";

/**
 * This test suite tests the parseNotificationDetailForRecipient function in a rather indirect mode:
 * it resorts to notificationToFeTwoRecipients which in turn calls parseNotificationDetailForRecipient.
 */
describe('Parse notification detail to FE - for a given recipient', () => {
  it('Recipient if first recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      false
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toEqual('TTTUUU29J84Z600X');
  });

  it('Recipient if second recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      false
    );
    expect(notification.currentRecipientIndex).toEqual(1);
    expect(notification.currentRecipient.taxId).toEqual('CGNNMO80A03H501U');
  });

  it('Recipient if the user looks the notifications of first recipient as delegator ', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toEqual('TTTUUU29J84Z600X');
  });

  it('Recipient if the user looks the notifications of second recipient as delegator ', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(1);
    expect(notification.currentRecipient.taxId).toEqual('CGNNMO80A03H501U');
  });
});
