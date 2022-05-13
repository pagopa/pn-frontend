import { formatNotificationRecipients } from '../notification.utility';
import { formattedRecipients, formRecipients } from './test-utils';

test('return recipients to be passed to the creation API', () => {
  const result = formatNotificationRecipients(formRecipients);

  expect(result).toEqual(formattedRecipients);
});
