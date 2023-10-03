import _ from 'lodash';

import { arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { parseNotificationDetailForRecipient } from '../notification.utility';

const recipientIndex = notificationDTO.recipients.findIndex((rec) => rec.taxId);
const filterOutRecipientIndex = notificationDTO.recipients.findIndex((rec) => !rec.taxId);

describe('Tests notification utility', () => {
  it('parseNotificationDetailForRecipient - recipient is the current user logged', () => {
    const notification = parseNotificationDetailForRecipient(
      _.cloneDeep(notificationDTO),
      notificationDTO.recipients[recipientIndex].taxId,
      arrayOfDelegators
    );
    expect(notification.currentRecipientIndex).toEqual(recipientIndex);
    expect(notification.currentRecipient.taxId).toEqual(
      notificationDTO.recipients[recipientIndex].taxId
    );
  });

  it("parseNotificationDetailForRecipient - recipient isn't the current user logged neither a delegator", () => {
    const notification = parseNotificationDetailForRecipient(
      _.cloneDeep(notificationDTO),
      notificationDTO.recipients[filterOutRecipientIndex].taxId,
      arrayOfDelegators
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toBeUndefined();
  });

  it('parseNotificationDetailForRecipient - recipient has delegated the current user logged', () => {
    const notification = parseNotificationDetailForRecipient(
      _.cloneDeep(notificationDTO),
      'CGNNMO80A03H501U',
      arrayOfDelegators,
      arrayOfDelegators[2].mandateId
    );
    expect(notification.currentRecipientIndex).toEqual(recipientIndex);
    expect(notification.currentRecipient.taxId).toEqual(
      notificationDTO.recipients[recipientIndex].taxId
    );
  });

  it("parseNotificationDetailForRecipient - recipient hasn't delegated the current user logged", () => {
    const notification = parseNotificationDetailForRecipient(
      _.cloneDeep(notificationDTO),
      'CGNNMO80A03H501U',
      arrayOfDelegators,
      arrayOfDelegators[0].mandateId
    );
    expect(notification.currentRecipientIndex).toEqual(0);
    expect(notification.currentRecipient.taxId).toBeUndefined();
  });
});
