import * as _ from 'lodash-es';

import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { parseNotificationDetailForRecipient } from '../notification.utility';

const recipientIndex = notificationDTO.recipients.findIndex((rec) => rec.taxId);

describe('Tests notification utility', () => {
  it('parseNotificationDetailForRecipient - recipient is the current user logged', () => {
    const notification = parseNotificationDetailForRecipient(_.cloneDeep(notificationDTO));
    expect(notification.currentRecipientIndex).toEqual(recipientIndex);
    expect(notification.currentRecipient.taxId).toEqual(
      notificationDTO.recipients[recipientIndex].taxId
    );
  });

  it('parseNotificationDetailForRecipient - more than one recipients defined', () => {
    const clonedNotification = _.cloneDeep(notificationDTO);
    for (const recipient of clonedNotification.recipients) {
      if (!recipient.taxId) {
        recipient.taxId = 'BNCSRA34H41G645K';
        recipient.denomination = 'Sara Bianchi';
      }
    }
    const notification = parseNotificationDetailForRecipient(clonedNotification);
    expect(notification.currentRecipientIndex).toEqual(-1);
    expect(notification.currentRecipient).toBeUndefined();
  });
});
