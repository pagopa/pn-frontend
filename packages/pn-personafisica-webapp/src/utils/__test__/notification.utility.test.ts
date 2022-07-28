import {
  LegalFactId,
  NotificationDetail,
  NotificationStatus,
  NotificationStatusHistory,
} from '@pagopa-pn/pn-commons';
import { notificationToFeTwoRecipients } from '../../redux/notification/__test__/test-utils';

// some functions useful to analyze the notificationStatusHistory
function historyElementByStatus(notification: NotificationDetail, status: NotificationStatus) {
  return notification.notificationStatusHistory.find((elem) => elem.status === status);
}

function allLegalFactsIds(historyElement?: NotificationStatusHistory) {
  return historyElement?.steps
    ? historyElement.steps.reduce(
        (legalFacts, elem) =>
          elem.legalFactsIds ? [...legalFacts, ...elem.legalFactsIds] : legalFacts,
        [] as Array<LegalFactId>
      )
    : [];
}

/**
 * This test suite tests the parseNotificationDetailForRecipient function in a rather indirect mode:
 * it resorts to notificationToFeTwoRecipients which in turn calls parseNotificationDetailForRecipient.
 */
describe('Parse notification detail to FE - for a given recipient', () => {
  it('Current recipient if first recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      false
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toEqual('TTTUUU29J84Z600X');
  });

  it('Current recipient if second recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      false
    );
    expect(notification.currentRecipientIndex).toEqual(1);
    expect(notification.currentRecipient.taxId).toEqual('CGNNMO80A03H501U');
  });

  it('Current recipient if the user looks the notifications of first recipient as delegator - both users are recipients', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toEqual('TTTUUU29J84Z600X');
  });

  it('Current recipient if the user looks the notifications of second recipient as delegator - both users are recipients', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(1);
    expect(notification.currentRecipient.taxId).toEqual('CGNNMO80A03H501U');
  });

  it('Current recipient if the user looks the notifications of first recipient as delegator - user not recipient', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501A',
      'TTTUUU29J84Z600X',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toEqual('TTTUUU29J84Z600X');
  });

  it('Current recipient if the user looks the notifications of second recipient as delegator - user not recipient', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600T',
      'CGNNMO80A03H501U',
      true
    );
    expect(notification.currentRecipientIndex).toEqual(1);
    expect(notification.currentRecipient.taxId).toEqual('CGNNMO80A03H501U');
  });

  /*
   * Delivered history element: 1 legal fact for recipient 0
   * Viewed history element: 1 legal fact for all recipients + 1 legal fact (in the "courtesy" timeline element) for recipient 0
   */

  it('Legal facts if first recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      false
    );

    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.DELIVERED))
    ).toHaveLength(1);
    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if second recipient logged', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      false
    );

    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.DELIVERED))
    ).toHaveLength(0);
    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if the user looks the notifications of second recipient as delegator - both users are recipients', () => {
    const notification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      true
    );

    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.DELIVERED))
    ).toHaveLength(0);
    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if the user looks the notifications of first recipient as delegator - both users are recipients', () => {
    const notification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      true
    );

    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.DELIVERED))
    ).toHaveLength(1);
    expect(
      allLegalFactsIds(historyElementByStatus(notification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if the user looks the notifications of second recipient as delegator - user not recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600T',
      'CGNNMO80A03H501U',
      true
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(0);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if the user looks the notifications of first recipient as delegator - user not recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501A',
      'TTTUUU29J84Z600X',
      true
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(1);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });
});
