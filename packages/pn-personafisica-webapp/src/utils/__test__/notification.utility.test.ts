import { LegalFactId, NotificationDetail, NotificationStatus, NotificationStatusHistory } from "@pagopa-pn/pn-commons";
import { notificationToFeTwoRecipients } from "../../redux/notification/__test__/test-utils";


// some functions useful to analyze the notificationStatusHistory
function historyElementByStatus(notification: NotificationDetail, status: NotificationStatus) {
  return notification.notificationStatusHistory.find(
    (elem) => elem.status === status
  );  
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
 * Changes the recipient for the "courtesy" timeline element to the second one
 */
function touchCourtesyTimelineIndex(notification: NotificationDetail) {
  const courtesyTimelineIndex = notification.timeline.findIndex(
    (elem) => elem.elementId === 'c_b429-202203021814_send_courtesy_rec0'
  );
  const newTimeline =
    courtesyTimelineIndex > -1
      ? [
          ...notification.timeline.slice(0, courtesyTimelineIndex),
          {
            ...notification.timeline[courtesyTimelineIndex],
            details: { recIndex: 1 },
          },
          ...notification.timeline.slice(courtesyTimelineIndex + 1),
        ]
      : notification.timeline;
  return { ...notification, timeline: newTimeline };
};



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
    ).toHaveLength(1);
  });

  it('Legal facts if first recipient logged - setting one legal fact for second recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      false,
      touchCourtesyTimelineIndex
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(1);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(1);
  });
  
  it('Legal facts if second recipient logged - setting one legal fact for second recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      false,
      touchCourtesyTimelineIndex,
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(0);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if first recipient logged - if the user looks the notifications of second recipient as delegator', () => {
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
    ).toHaveLength(1);
  });

  it('Legal facts if second recipient logged - if the user looks the notifications of first recipient as delegator', () => {
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

  it('Legal facts if first recipient logged - if the user looks the notifications of second recipient as delegator - setting one legal fact for second recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'TTTUUU29J84Z600X',
      'CGNNMO80A03H501U',
      true,
      touchCourtesyTimelineIndex
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(0);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(2);
  });

  it('Legal facts if second recipient logged - if the user looks the notifications of first recipient as delegator - setting one legal fact for second recipient', () => {
    const touchedNotification = notificationToFeTwoRecipients(
      'CGNNMO80A03H501U',
      'TTTUUU29J84Z600X',
      true,
      touchCourtesyTimelineIndex
    );

    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.DELIVERED))
    ).toHaveLength(1);
    expect(
      allLegalFactsIds(historyElementByStatus(touchedNotification, NotificationStatus.VIEWED))
    ).toHaveLength(1);
  });
});
